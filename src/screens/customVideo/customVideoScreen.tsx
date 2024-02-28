import {
	OutlinedDollarSvg,
	OutlinedInfoSvg,
	Clock1Svg,
	StarCheckSvg,
	CameoVideoSVG,
	ChevronDownSvg,
	FilledHeartSvg,
	PlaySvg,
	TrashSvg,
} from "@assets/svgs/common";
import { StarImage, MediasImage } from "@assets/svgs/images";
import { MoneyGuarantee } from "@components/chat/videoCalls";
import AvatarWithStatus from "@components/common/AvatarWithStatus";
import { ContentPreferencesList } from "@components/common/ContentPreferencesList";
import FormControl from "@components/common/FormControl";
import {
	FypLinearGradientView,
	FypSvg,
	FypText,
	FypLink,
	FypCollapsible,
	FypNullableView,
	FypButton2,
	FypVideo,
} from "@components/common/base";
import CustomTopNavBar from "@components/common/customTopNavBar";
import AppLayout from "@components/common/layout";
import PaymentMethodDropdown from "@components/common/paymentMethodDropdown";
import {
	FansView,
	FansDivider,
	FansGap,
	FansIconButton,
} from "@components/controls";
import { AddPaymentCardDialog } from "@components/profiles";
import {
	ChatWithUsBlock,
	CreatorDurationPriceItem,
	OrderSummary,
	GuideItem,
} from "@components/videoCall";
import {
	testPaymentToken,
	defaultCreatorCustomVideoSettingsData,
} from "@constants/common";
import { defaultVideoCallDurationFormData } from "@constants/defaultFormData";
import { defaultProfileStateData } from "@context/state/profileState";
import { useAppContext } from "@context/useAppContext";
import { cdnURL, formatPrice } from "@helper/Utils";
import {
	getCreatorCustomVideoSettings,
	createCustomVideoOrder,
	createCustomVideoMediaRequest,
} from "@helper/endpoints/cameo/apis";
import { getCreatorProfileByLink } from "@helper/endpoints/profile/apis";
import { getPaymentMethods } from "@helper/endpoints/subscriptions/apis";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFeatureGates } from "@state/featureGates";
import { UploadUsageType, ResizeMode } from "@usertypes/commonEnums";
import { CustomVideoStackParams } from "@usertypes/navigations";
import {
	IProfile,
	IVideoDuration,
	IPaymentMethod,
	ICreatorCustomVideoSettings,
	RecipientPronoun,
	IPickerMedia,
} from "@usertypes/types";
import { useBlankLink } from "@utils/useBlankLink";
import useDocumentPicker from "@utils/useDocumentPicker";
import useUploadFiles from "@utils/useUploadFile";
import { createURL } from "expo-linking";
import { useRouter } from "expo-router";
import moment from "moment";
import React, { FC, useEffect, useState, useRef } from "react";
import { Image, ScrollView } from "react-native";
import Toast from "react-native-toast-message";

interface IOrderForm {
	instructions: string;
	recipientName: string;
	recipientPronoun: RecipientPronoun;
}

interface PronounItemProps {
	selected: boolean;
	text: string;
	onSelect: () => void;
}

const PronounItem: FC<PronounItemProps> = (props) => {
	const { selected, text, onSelect } = props;
	return (
		<FansView
			height={42}
			justifyContent="center"
			borderRadius={15}
			pressableProps={{
				onPress: onSelect,
			}}
			style={tw.style(
				selected
					? "border-[2px] border-fans-purple"
					: "border border-fans-grey dark:border-fans-grey-43",
				tw.prefixMatch("md") ? "w-[158px]" : "flex-1",
			)}
		>
			<FypText fontSize={16} fontWeight={500} textAlign="center">
				{text}
			</FypText>
		</FansView>
	);
};

interface UploadFileDropzoneProps {
	medias: IPickerMedia[];
	setMedias: (medias: IPickerMedia[]) => void;
}

const UploadFileDropzone: FC<UploadFileDropzoneProps> = (props) => {
	const { medias, setMedias } = props;
	const { useImagePicker, useVideoPicker } = useDocumentPicker();

	const onPressDropzone = async () => {
		const result = await useVideoPicker();
		if (result.ok) {
			const medias = result.data;
			setMedias(medias);
		} else {
			Toast.show({
				type: "error",
				text1: result?.message ?? "",
			});
		}
	};

	return (
		<FansView>
			{medias.length === 0 ? (
				<FansView
					borderRadius={15}
					alignItems="center"
					style={tw.style(
						"border-dashed border border-fans-grey dark:border-fans-grey-43",
						"pb-5 pt-5 md:pt-10 md:pb-[30px]",
						"gap-2 md:gap-3",
					)}
					pressableProps={{
						onPress: onPressDropzone,
					}}
				>
					<FypSvg
						svg={MediasImage}
						width={{ xs: 76, md: 100 }}
						height={{ xs: 57, md: 75 }}
					/>
					<FypText
						fontSize={17}
						textAlign="center"
						style={tw.style("flex")}
					>
						{tw.prefixMatch("md")
							? "Drop file here or "
							: "Browse library"}
						<FypText
							fontSize={17}
							fontWeight={600}
							style={tw.style("text-fans-purple hidden md:flex")}
						>
							browse
						</FypText>
					</FypText>
				</FansView>
			) : (
				<FansView position="relative" width="full" height={178}>
					<FypVideo
						source={{
							uri: cdnURL(medias[0]?.uri) ?? "",
						}}
						resizeMode={ResizeMode.CONTAIN}
						style={[tw.style("w-full h-full")]}
					/>
					<FansIconButton
						style={tw.style("absolute top-5 right-5")}
						onPress={() => setMedias([])}
					>
						<FypSvg
							svg={TrashSvg}
							width={15}
							height={15}
							color="fans-red"
						/>
					</FansIconButton>
				</FansView>
			)}
		</FansView>
	);
};

const CustomVideoScreen = (
	props: NativeStackScreenProps<CustomVideoStackParams, "Home">,
) => {
	const { route } = props;
	const { username } = route.params;
	const router = useRouter();
	const { state, dispatch } = useAppContext();
	const [openLink] = useBlankLink();
	const { useImagePicker, useVideoPicker } = useDocumentPicker();
	const { uploadFiles } = useUploadFiles();
	const featureGates = useFeatureGates();

	const scrollRef = useRef<ScrollView>(null);

	const [creator, setCreator] = useState<IProfile>(defaultProfileStateData);
	const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);
	const [payment, setPayment] = useState(testPaymentToken);
	const [customVideoSettings, setCustomVideoSettings] =
		useState<ICreatorCustomVideoSettings>(
			defaultCreatorCustomVideoSettingsData,
		);
	const [duration, setDuration] = useState<IVideoDuration>(
		defaultVideoCallDurationFormData,
	);
	const [openPaymentModal, setOpenPaymentModal] = useState(false);
	const [formPositionY, setFormPositionY] = useState(0);
	const [collapsedForm, setCollapsedForm] = useState(false);
	const [orderForm, setOrderForm] = useState<IOrderForm>({
		instructions: "",
		recipientName: "",
		recipientPronoun: "He",
	});
	const [medias, setMedias] = useState<IPickerMedia[]>([]);

	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [price, setPrice] = useState(0);
	const [platformFee, setPlatformFee] = useState(0);
	const [vatFee, setVatFee] = useState(0);
	const [total, setTotal] = useState(0);

	const handleGoBack = () => {
		if (router.canGoBack()) {
			router.back();
		} else {
			router.push("/posts");
		}
	};

	const handlePressTerms = () => {
		const url = createURL(`/terms`);
		openLink(url);
	};

	const handleAddPaymentMethod = () => {
		setOpenPaymentModal(true);
	};

	const handlePressOrderVideo = () => {
		scrollRef.current?.scrollTo({ y: formPositionY, animated: true });
	};

	const fetchCreatorData = async () => {
		const resp = await getCreatorProfileByLink({
			profileLink: username as string,
		});
		if (resp.ok) {
			setCreator(resp.data);
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const getPaymentMethodsData = async () => {
		const paymentMethodsData = await getPaymentMethods();
		if (paymentMethodsData.ok) {
			setPaymentMethods(paymentMethodsData.data);
		}
	};

	const fetchCreatorCustomVideoSettings = async () => {
		const resp = await getCreatorCustomVideoSettings({ id: creator.id });
		if (resp.ok) {
			setCustomVideoSettings(resp.data);
		}
	};

	const handleChangeForm = (
		name: string,
		value: string | RecipientPronoun,
	) => {
		setOrderForm({
			...orderForm,
			[name]: value,
		});
	};

	const handlePay = async () => {
		setIsSubmitted(true);
		if (duration.length === 0) {
			Toast.show({
				type: "error",
				text1: "Please select duration.",
			});
			return;
		}
		if (orderForm.recipientName === "" || orderForm.instructions === "") {
			return;
		}
		const postbody = {
			duration: duration.length,
			creatorId: creator.id,
			instructions: orderForm.instructions,
			recipientName: orderForm.recipientName,
			recipientPronoun: orderForm.recipientPronoun,
		};
		setIsLoading(true);
		const resp = await createCustomVideoOrder(postbody);

		if (resp.ok) {
			if (medias.length > 0) {
				const uploadResp = await uploadFiles(
					medias,
					UploadUsageType.CUSTOM_VIDEO,
				);
				console.log(uploadResp);
				if (uploadResp.ok) {
					const orderUpdateResp = await createCustomVideoMediaRequest(
						{ uploadId: uploadResp.data[0].id },
						{ id: resp.data.id },
					);
					setIsLoading(false);
					console.log(orderUpdateResp);
					if (!orderUpdateResp.ok) {
						Toast.show({
							type: "error",
							text1: orderUpdateResp.data.message,
						});
					}
				} else {
					setIsLoading(false);
					Toast.show({
						type: "error",
						text1:
							uploadResp.errorString ?? "Failed to upload files",
					});
				}
			}
			setIsLoading(false);
			router.replace("/posts");
		} else {
			setIsLoading(false);
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	useEffect(() => {
		fetchCreatorData();
		getPaymentMethodsData();
	}, [username]);

	useEffect(() => {
		if (creator.id !== "0") {
			fetchCreatorCustomVideoSettings();
		}
	}, [creator.id]);

	return (
		<AppLayout
			title={`${creator.displayName} | FYP.Fans`}
			description={creator.bio}
		>
			<FansView flex="1" position="relative">
				<ScrollView style={tw.style("flex-1")} ref={scrollRef}>
					<FansView flexDirection="row" flex="1">
						<FansView
							flex="1"
							alignItems="center"
							style={tw.style(
								"md:border-r border-fans-grey-f0 dark:border-fans-grey-43",
							)}
						>
							<FansView
								flex="1"
								position="relative"
								style={tw.style(
									"w-full md:max-w-[710px] bg-fans-white dark:bg-fans-black-1d",
								)}
							>
								<CustomTopNavBar
									title="Order a custom video"
									onClickLeft={handleGoBack}
								/>
								<FansView
									style={tw.style(
										"md:pt-10 mb-[26px] md:mb-[66px]",
									)}
								>
									<FansView
										height={85}
										style={tw.style("md:hidden")}
									>
										{creator.cover.length === 0 ? (
											<FypLinearGradientView
												colors={["#8a49f1", "#d885ff"]}
												position="relative"
												height={85}
											/>
										) : (
											<Image
												source={{
													uri: cdnURL(
														creator.cover[0],
													),
												}}
												style={tw.style(
													"h-full w-full",
												)}
											/>
										)}
									</FansView>
									<FansView
										gap={{ xs: 18, md: 24 }}
										style={tw.style(
											"mt-[-43px] md:mt-0 flex flex-col md:flex-row md:items-center",
										)}
									>
										<FansView
											width={117}
											height={117}
											position="relative"
											padding={4}
											borderRadius={109}
											alignItems="center"
											justifyContent="center"
											style={tw.style(
												"mx-auto md:ml-0 bg-fans-white dark:bg-fans-black-1d",
											)}
										>
											<AvatarWithStatus
												size={109}
												avatar={creator.avatar}
											/>
											<FypLinearGradientView
												colors={["#d885ff", "#1d21e5"]}
												width={42}
												height={42}
												borderRadius={42}
												alignItems="center"
												justifyContent="center"
												position="absolute"
												style={tw.style(
													"border-[4px] border-fans-white dark:border-fans-black-1d",
													"right-[6px] bottom-[-8px]",
												)}
											>
												<FypSvg
													svg={CameoVideoSVG}
													width={20}
													height={20}
													color="fans-white"
												/>
											</FypLinearGradientView>
										</FansView>
										<FansView
											flex="1"
											style={tw.style(
												"px-[18px] md:px-0 items-center md:items-start",
											)}
										>
											{creator.displayName ? (
												<FansView
													flexDirection="row"
													alignItems="center"
													gap={15}
													style={tw.style("mb-3")}
												>
													<FypText
														fontSize={23}
														lineHeight={31}
														fontWeight={700}
													>
														{creator.displayName}
													</FypText>
													<FypSvg
														svg={StarCheckSvg}
														width={16}
														height={15}
													/>
												</FansView>
											) : null}

											<FypText
												fontSize={16}
												lineHeight={21}
												style={tw.style(
													"mb-3 text-center md:text-left",
												)}
												numberOfLines={2}
											>
												{
													customVideoSettings.description
												}
											</FypText>
											<FansView
												flexDirection="row"
												alignItems="center"
												gap={32}
											>
												<FansView
													flexDirection="row"
													alignItems="center"
													gap={6}
												>
													<FypSvg
														svg={StarImage}
														width={12}
														height={12}
														color="fans-purple"
													/>
													<FypText
														fontSize={15}
														lineHeight={21}
														fontWeight={600}
													>
														4.97{" "}
														<FypText
															fontSize={15}
															lineHeight={21}
															style={tw.style(
																"text-fans-grey-48 dark:text-fans-grey-b1",
															)}
														>
															(1259)
														</FypText>
													</FypText>
												</FansView>

												<FansView
													flexDirection="row"
													alignItems="center"
													gap={6}
												>
													<FypSvg
														svg={Clock1Svg}
														width={19}
														height={19}
														color="fans-purple"
													/>
													<FypText
														fontSize={15}
														lineHeight={21}
														fontWeight={600}
													>
														24 HR DELIVERY
													</FypText>
												</FansView>

												<FansView
													flexDirection="row"
													alignItems="center"
													gap={6}
												>
													<FypSvg
														svg={OutlinedDollarSvg}
														width={17}
														height={17}
														color="fans-purple"
													/>
													<FypText
														fontSize={15}
														lineHeight={21}
														fontWeight={600}
													>
														{`${formatPrice(
															duration.price,
														)}-${Math.round(
															duration.length /
																60,
														)} PRICES`}
													</FypText>
												</FansView>
											</FansView>
										</FansView>
									</FansView>
								</FansView>

								<FansView
									style={tw.style("px-[18px] md:px-0 pb-10")}
								>
									<FypNullableView
										visible={
											customVideoSettings.contentTypes
												.length > 0 ||
											customVideoSettings.customContentType !==
												""
										}
									>
										<FypText
											fontWeight={600}
											fontSize={17}
											style={tw.style("mb-5")}
										>
											Types of videos offered
										</FypText>
										<FansView
											borderRadius={15}
											padding={{ t: 26, b: 24, x: 20 }}
											style={tw.style(
												"border border-fans-grey dark:border-fans-grey-43",
											)}
										>
											<ContentPreferencesList
												availableOptionIds={
													customVideoSettings.contentTypes
												}
											/>
											{customVideoSettings.customContentType ? (
												<FypText
													fontSize={16}
													margin={{ t: 20 }}
													textAlign="center"
													style={tw.style(
														"text-fans-grey-48 dark:text-fans-grey-b1 italic",
													)}
												>
													{
														customVideoSettings.customContentType
													}
												</FypText>
											) : null}
										</FansView>
									</FypNullableView>

									<FansGap height={40} />

									<FypText
										fontWeight={600}
										fontSize={19}
										margin={{ b: 10 }}
										onLayout={(e) =>
											setFormPositionY(
												e.nativeEvent.layout.y,
											)
										}
									>
										Make your order
									</FypText>
									<FypText
										fontSize={16}
										style={tw.style(
											"text-fans-grey-70 dark:text-fans-grey-b1",
										)}
									>
										Order your custom video below. Pick a
										duration, price, and describe what you
										want (creator) to do
									</FypText>
									<FansGap height={30} />

									<FansView
										flexDirection="row"
										alignItems="center"
										gap={18}
										justifyContent={
											tw.prefixMatch("md")
												? "start"
												: "between"
										}
										pressableProps={{
											onPress: () =>
												setCollapsedForm(
													!collapsedForm,
												),
										}}
									>
										<FypText
											fontSize={17}
											lineHeight={22}
											fontWeight={600}
										>
											How it works
										</FypText>
										<FansView
											width={12}
											height={6}
											style={{
												transform: [
													{
														rotate: collapsedForm
															? "0deg"
															: "180deg",
													},
												],
											}}
										>
											<FypSvg
												svg={ChevronDownSvg}
												width={12}
												height={6}
												color="fans-grey-48 dark:fans-grey-b1"
											/>
										</FansView>
									</FansView>

									<FypCollapsible collapsed={collapsedForm}>
										<FansGap height={30} />
										<FypText
											fontWeight={600}
											fontSize={17}
											margin={{ b: 15 }}
										>
											Duration & prices
										</FypText>
										<FansView
											flexDirection="row"
											flexWrap="wrap"
											style={tw.style(
												"flex mx-[-4px] md:mx-[-8px]",
											)}
										>
											{customVideoSettings.customVideoDurations.map(
												(el) => (
													<FansView
														key={el.length}
														style={tw.style(
															"w-1/3 md:w-1/4 p-[4px] md:p-2",
														)}
													>
														<CreatorDurationPriceItem
															minutes={Math.round(
																el.length / 60,
															)}
															price={
																el.price / 100
															}
															selected={
																duration.length ===
																el.length
															}
															onPress={() =>
																setDuration(el)
															}
														/>
													</FansView>
												),
											)}
										</FansView>
										<FansGap height={{ xs: 26, md: 30 }} />
										<FansDivider
											style={tw.style("md:hidden")}
										/>
										<FansGap height={{ xs: 16, md: 0 }} />
										<FypText fontSize={19} fontWeight={600}>
											Make your request memorable
										</FypText>
										<FansGap height={28} />
										<FormControl
											label="To (first name)"
											value={orderForm.recipientName}
											placeholder="First name"
											onChangeText={(val: string) =>
												handleChangeForm(
													"recipientName",
													val,
												)
											}
											hasError={
												isSubmitted &&
												orderForm.recipientName === ""
											}
										/>
										<FansGap height={8} />
										<FansView
											flexDirection="row"
											alignItems="center"
											style={tw.style(
												"gap-2 md:gap-[15px]",
											)}
										>
											<PronounItem
												text="He/him"
												selected={
													orderForm.recipientPronoun ===
													"He"
												}
												onSelect={() =>
													handleChangeForm(
														"recipientPronoun",
														"He",
													)
												}
											/>
											<PronounItem
												text="She/her"
												selected={
													orderForm.recipientPronoun ===
													"She"
												}
												onSelect={() =>
													handleChangeForm(
														"recipientPronoun",
														"She",
													)
												}
											/>
											<PronounItem
												text="They/them"
												selected={
													orderForm.recipientPronoun ===
													"They"
												}
												onSelect={() =>
													handleChangeForm(
														"recipientPronoun",
														"They",
													)
												}
											/>
										</FansView>
										<FansGap height={32} />
										<FormControl
											label={`Instructions for ${creator.displayName}`}
											value={orderForm.instructions}
											onChangeText={(val: string) =>
												handleChangeForm(
													"instructions",
													val,
												)
											}
											placeholder="Describe what you want for your video..."
											isTextArea
											maxLength={1000}
											hasError={
												isSubmitted &&
												orderForm.instructions === ""
											}
										/>
										<FansGap height={32} />

										<FypText
											fontSize={17}
											fontWeight={600}
											margin={{ b: 12 }}
										>
											Photo or video (optional)
										</FypText>
										<FypText
											fontSize={16}
											margin={{ b: 15 }}
											style={tw.style(
												"text-fans-grey-48 dark:text-fans-grey-b1",
											)}
										>
											Attach a file to your request
										</FypText>

										<UploadFileDropzone
											medias={medias}
											setMedias={setMedias}
										/>
									</FypCollapsible>

									<FansGap height={34} />
									<FansDivider />
									<FansGap height={26} />

									<FansView>
										<OrderSummary
											creator={creator}
											subtotal={0}
											platformFee={0}
											total={0}
											type="customVideo"
											dateText={moment(new Date())
												.format("MMMM DD")
												.toString()}
											timeText={`${
												duration.length / 60
											} minutes`}
										/>
										<FansGap height={14} />
										<FansView
											borderRadius={15}
											padding={{ t: 10, b: 12, x: 16 }}
											flexDirection="row"
											alignItems="center"
											justifyContent="center"
											gap={8}
											style={tw.style(
												"bg-fans-purple-light",
											)}
										>
											<FypSvg
												svg={OutlinedInfoSvg}
												width={14}
												height={14}
												color="fans-black-1d"
											/>
											<FypText
												fontSize={16}
												style={tw.style(
													"text-fans-black-1d",
												)}
											>
												Only charged if accepted
											</FypText>
										</FansView>
									</FansView>

									<FansGap height={34} />

									<FansView margin={{ b: 14 }}>
										<FypText
											fontSize={17}
											lineHeight={22}
											fontWeight={600}
											margin={{ b: 15 }}
										>
											Payment method
										</FypText>
										<PaymentMethodDropdown
											options={paymentMethods}
											value={payment}
											onChange={(
												customerPaymentProfileId,
											) =>
												setPayment(
													customerPaymentProfileId,
												)
											}
											handleAddMethod={
												handleAddPaymentMethod
											}
										/>
									</FansView>
									<FansView margin={{ b: 18 }}>
										<FypLinearGradientView
											height={42}
											colors={[
												"#1D21E5",
												"#A854F5",
												"#D885FF",
											]}
											start={[0, 1]}
											end={[1, 0]}
											borderRadius={42}
										>
											<FypButton2
												textStyle={tw.style(
													"text-fans-white",
												)}
												pressableProps={{
													onPress: handlePay,
												}}
												loading={isLoading}
											>
												Pay $16.50
											</FypButton2>
										</FypLinearGradientView>
									</FansView>

									<FypText
										fontSize={12}
										lineHeight={21}
										textAlign="center"
										style={tw.style(
											"text-fans-grey-70 dark:text-fans-grey-b1",
										)}
									>
										By moving forward, you agree to our{" "}
										<FypLink
											fontSize={12}
											lineHeight={21}
											style={tw.style("text-fans-purple")}
											onPress={handlePressTerms}
										>
											Terms of Use.
										</FypLink>
									</FypText>
									<FansView
										margin={{ t: 32 }}
										style={tw.style("md:hidden")}
									>
										<MoneyGuarantee />
									</FansView>
									<FansView
										margin={{ t: 40 }}
										style={tw.style("md:hidden")}
									>
										<ChatWithUsBlock />
									</FansView>
								</FansView>
							</FansView>
						</FansView>
						<FansView
							style={tw.style(
								"hidden pt-15.5 2lg:flex px-5 w-100 xl:w-[536px] xl:px-10 xl:pr-[140px] 2lg:min-h-screen",
							)}
						>
							<FypLinearGradientView
								height={42}
								colors={["#1D21E5", "#A854F5", "#D885FF"]}
								start={[0, 1]}
								end={[1, 0]}
								borderRadius={42}
							>
								<FypButton2
									textStyle={tw.style("text-fans-white")}
									pressableProps={{
										onPress: handlePressOrderVideo,
									}}
								>
									Order custom video
								</FypButton2>
							</FypLinearGradientView>
							<FansView margin={{ t: 32 }}>
								<MoneyGuarantee />
							</FansView>
							<FansView margin={{ t: 40 }}>
								<ChatWithUsBlock />
							</FansView>
							<FansGap height={22} />
							<FansView>
								<FypText
									fontSize={21}
									fontWeight={600}
									lineHeight={28}
								>
									How it works
								</FypText>
								<FansGap height={32} />
								<FansView gap={22}>
									<GuideItem
										title="Tell the creator what you want"
										text="During checkout write instructions for what you want (creator name) to do in your custom video. This video is delivered exclusively to you"
										icon={
											<FypSvg
												svg={FilledHeartSvg}
												width={21}
												height={18}
												color="fans-purple"
											/>
										}
									/>
									<GuideItem
										title="Receive your personalized video"
										text="The creator will have a short time period to fulfill your request. Once it’s done, we’ll deliver it straight to your email and chatbox"
										icon={
											<FypSvg
												svg={PlaySvg}
												width={17}
												height={19}
												color="fans-purple"
											/>
										}
									/>
									<GuideItem
										title="Access your video anytime"
										text="Your video will be permanently available in your ‘Purchases’ section for unlimited viewing"
										icon={
											<FypSvg
												svg={StarCheckSvg}
												width={22}
												height={21}
												color="fans-purple"
											/>
										}
									/>
								</FansView>
							</FansView>
						</FansView>
					</FansView>
				</ScrollView>
			</FansView>
			<AddPaymentCardDialog
				visible={openPaymentModal}
				handleClose={() => setOpenPaymentModal(false)}
				handleToggleModal={setOpenPaymentModal}
			/>
		</AppLayout>
	);
};

export default CustomVideoScreen;
