import {
	OutlinedDollarSvg,
	OutlinedInfoSvg,
	Clock1Svg,
	VideoRecordSvg,
	StarCheckSvg,
	ChatSvg,
	AddressSvg,
} from "@assets/svgs/common";
import { MoneyGuarantee } from "@components/chat/videoCalls";
import AvatarWithStatus from "@components/common/AvatarWithStatus";
import {
	FypDropdown,
	FypLinearGradientView,
	FypSvg,
	FypText,
	FypLink,
} from "@components/common/base";
import CustomTopNavBar from "@components/common/customTopNavBar";
import AppLayout from "@components/common/layout";
import PaymentMethodDropdown from "@components/common/paymentMethodDropdown";
import { FansView, FansDivider } from "@components/controls";
import { defaultProfileStateData } from "@context/state/profileState";
import { useAppContext } from "@context/useAppContext";
import { cdnURL } from "@helper/Utils";
import { getCreatorProfileByLink } from "@helper/endpoints/profile/apis";
import { getProfileVideoCallSettings } from "@helper/endpoints/settings/apis";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CreatorProfileNavigationStacks } from "@usertypes/navigations";
import { IProfile, IVideoCallSetting } from "@usertypes/types";
import { useBlankLink } from "@utils/useBlankLink";
import { Video } from "expo-av";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView } from "react-native";
import Toast from "react-native-toast-message";
import { ContentPreferencesList } from "../../../components/common/ContentPreferencesList";

const ChatWithUsBlock = () => {
	const [openLink] = useBlankLink();
	const handlePressChat = () => {
		openLink("https://support.fyp.fans/");
	};
	return (
		<FansView
			borderRadius={15}
			padding={{ t: 20, b: 28, x: 18 }}
			style={tw.style(
				"border border-fans-grey-de dark:border-fans-grey-50",
			)}
		>
			<FypText
				fontSize={17}
				lineHeight={22}
				fontWeight={600}
				textAlign="center"
				margin={{ b: 16 }}
			>
				Need help?
			</FypText>
			<FansView
				height={42}
				flexDirection="row"
				alignItems="center"
				justifyContent="center"
				borderRadius={42}
				gap={10}
				style={tw.style("border border-fans-purple")}
				pressableProps={{
					onPress: handlePressChat,
				}}
			>
				<FypSvg
					svg={ChatSvg}
					width={15}
					height={15}
					color="fans-purple"
				/>
				<FypText
					fontSize={19}
					lineHeight={26}
					fontWeight={700}
					style={tw.style("text-fans-purple")}
				>
					Chat with us
				</FypText>
			</FansView>
		</FansView>
	);
};

const OrderVideoCallScreen = (
	props: NativeStackScreenProps<
		CreatorProfileNavigationStacks,
		"OrderVideoCallScreen"
	>,
) => {
	const router = useRouter();
	const { state } = useAppContext();
	const { creatorUsername: username } = state.common;

	const [profile, setProfile] = useState<IProfile>(defaultProfileStateData);
	const [settings, setSettings] = useState<IVideoCallSetting>();
	const [bufferBeforeCall, setBufferBeforeCall] = useState<string>("");
	const [time, setTime] = useState(0);
	const [payment, setPayment] = useState("");

	const timeOptions = [
		{ data: "15", label: "15 min" },
		{ data: "20", label: "20 min" },
	];

	const handlePressTerms = () => {
		router.push("/terms");
	};

	const handlePressOrderCall = () => {};

	const fetchVideoCallSettings = async () => {
		const resp = await getProfileVideoCallSettings({ id: profile.id });
		if (resp.ok) {
			setSettings(resp.data);
		}
	};

	const fetchProfileData = async () => {
		const resp = await getCreatorProfileByLink({
			profileLink: username as string,
		});
		if (resp.ok) {
			setProfile(resp.data);
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	useEffect(() => {
		fetchProfileData();
	}, [username]);

	useEffect(() => {
		if (profile.id !== "0") {
			fetchVideoCallSettings();
		}
	}, [profile.id]);

	return (
		<AppLayout
			title={`${profile.displayName} | FYP.Fans`}
			description={profile.bio}
		>
			<FansView flex="1" position="relative">
				<ScrollView style={tw.style("flex-1")}>
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
									title="Order a 1:1 video call"
									onClickLeft={() => router.back()}
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
										{profile.cover.length === 0 ? (
											<FypLinearGradientView
												colors={["#8a49f1", "#d885ff"]}
												position="relative"
												height={85}
											/>
										) : (
											<Image
												source={{
													uri: cdnURL(
														profile.cover[0],
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
												avatar={profile.avatar}
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
													svg={VideoRecordSvg}
													width={18}
													height={17}
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
											{profile.displayName ? (
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
														{profile.displayName}
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
												{profile.bio}
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
														24 HR AVAILABLE
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
														$ 15-30 PRICES
													</FypText>
												</FansView>
											</FansView>
										</FansView>
									</FansView>
								</FansView>
								<FansView
									style={tw.style("px-[18px] md:px-0 pb-10")}
								>
									<FansView
										padding={{ y: 18, x: 18 }}
										borderRadius={15}
										style={tw.style("bg-fans-purple")}
										gap={14}
									>
										<FypText
											fontSize={16}
											lineHeight={21}
											textAlign="center"
											style={tw.style("text-white")}
										>
											<FypSvg
												svg={OutlinedInfoSvg}
												width={15}
												height={15}
												color="fans-white"
											/>
											{"  "}
											We need to verify you’re 18 or
											older. Please allow access to your
											camera
										</FypText>
										<FansView
											width={170}
											height={42}
											borderRadius={42}
											justifyContent="center"
											style={tw.style(
												"bg-fans-white mx-auto",
											)}
										>
											<FypText
												fontSize={19}
												lineHeight={26}
												fontWeight={700}
												textAlign="center"
												style={tw.style(
													"text-fans-purple",
												)}
											>
												Verify
											</FypText>
										</FansView>
									</FansView>
									<FansView
										height={{ xs: 234, md: 436 }}
										position="relative"
										style={tw.style(
											"mt-[26px] md:mt-[30px] mb-7 md:mb-8",
										)}
									>
										<Video
											source={require("@assets/video/video-1.mp4")}
											style={tw.style(
												"w-full h-full rounded-[7px]",
											)}
										/>
									</FansView>
									<FypText
										fontWeight={600}
										fontSize={17}
										textAlign="center"
										style={tw.style("mb-5")}
									>
										Type of content
									</FypText>
									{settings?.contentPreferences && (
										<ContentPreferencesList
											availableOptionIds={
												settings?.contentPreferences ??
												[]
											}
										/>
									)}
									<FansDivider
										color="fans-grey-f0"
										style={tw.style(
											"mt-6 md:mt-[34px] mb-[18px] md:mb-10",
										)}
									/>

									<FypText
										fontWeight={600}
										fontSize={19}
										margin={{ b: 10 }}
									>
										Make your order
									</FypText>
									<FypText
										fontSize={16}
										style={tw.style(
											"text-fans-grey-70 dark:text-fans-grey-b1",
											"mb-[26px]",
										)}
									>
										Order a video call with me, just pick
										the date and time you prefer. Can’t wait
										to meet you! We’ll have fun!
									</FypText>
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
										style={tw.style("flex mb-9 mx-[-6px] ")}
									>
										{settings?.meetingDurations.map(
											(duration) => (
												<FansView
													key={duration.length}
													padding={3}
													style={tw.style(
														"w-1/3 md:w-1/4",
													)}
												>
													<FansView
														height={77}
														borderRadius={7}
														justifyContent="center"
														style={tw.style(
															"border",
															time ===
																duration.length
																? "border-fans-purple border-[2px]"
																: "border-fans-grey-f0 dark:border-fans-grey-43",
														)}
														pressableProps={{
															onPress: () =>
																setTime(
																	duration.length,
																),
														}}
													>
														<FypText
															fontSize={16}
															fontWeight={500}
															textAlign="center"
															lineHeight={21}
														>
															{`${duration.length} min`}
														</FypText>
														<FypText
															fontSize={19}
															fontWeight={600}
															textAlign="center"
															lineHeight={26}
															style={tw.style(
																"text-fans-purple",
															)}
														>
															{`$${duration.price}`}
														</FypText>
													</FansView>
												</FansView>
											),
										)}
									</FansView>
									<FypText
										fontWeight={600}
										fontSize={17}
										margin={{ b: 15 }}
									>
										When
									</FypText>
									<FypDropdown
										data={timeOptions}
										value={bufferBeforeCall}
										onSelect={(val) =>
											setBufferBeforeCall(val as string)
										}
										placeholder="Select Time"
										valueField="data"
									/>
									<FansView
										margin={{ t: 34, b: 30 }}
										flexDirection="row"
										alignItems="center"
										gap={28}
									>
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
												fontSize={17}
												fontWeight={600}
											>
												15 MIN
											</FypText>
										</FansView>
										<FansView
											flexDirection="row"
											alignItems="center"
											gap={6}
										>
											<FypSvg
												svg={AddressSvg}
												width={15}
												height={17}
												color="fans-purple"
											/>
											<FypText
												fontSize={17}
												fontWeight={600}
											>
												ZOOM
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
												fontSize={17}
												fontWeight={600}
											>
												$15 USD
											</FypText>
										</FansView>
									</FansView>
									<FansView>
										<FypText
											fontSize={17}
											lineHeight={22}
											fontWeight={600}
											margin={{ b: 14 }}
										>
											Total
										</FypText>
										<FypText
											fontSize={16}
											lineHeight={21}
											margin={{ b: 5 }}
											style={tw.style(
												"text-fans-grey-70 dark:text-fans-grey-b1",
											)}
										>
											$15.00 USD + $1.50 Platform fee
										</FypText>
										<FypText
											fontSize={21}
											fontWeight={600}
											lineHeight={28}
											margin={{ b: 18 }}
										>
											$16.50
										</FypText>
										<FansView flexDirection="row">
											<FansView
												flexDirection="row"
												alignItems="center"
												borderRadius={30}
												gap={7}
												padding={{ l: 12, r: 23, y: 6 }}
												style={tw.style(
													"bg-fans-purple-f6 dark:bg-fans-purple-47",
												)}
											>
												<FypSvg
													svg={OutlinedInfoSvg}
													width={13}
													height={13}
													color="fans-purple"
												/>
												<FypText
													fontSize={13}
													lineHeight={17}
													fontWeight={700}
													style={tw.style(
														"text-fans-purple",
													)}
												>
													ONLY CHARGED IF ACCEPTED
												</FypText>
											</FansView>
										</FansView>
									</FansView>
									<FansDivider
										style={tw.style("mt-[26px] mb-5")}
									/>
									<FansView margin={{ b: 22 }}>
										<FypText
											fontSize={17}
											lineHeight={22}
											fontWeight={600}
											margin={{ b: 15 }}
										>
											Payment method
										</FypText>
										<PaymentMethodDropdown
											options={[]}
											value={payment}
											onChange={setPayment}
											handleAddMethod={() => {}}
										/>
									</FansView>
									<FansView
										height={42}
										borderRadius={42}
										alignItems="center"
										justifyContent="center"
										margin={{ b: 18 }}
										style={tw.style("bg-fans-purple")}
									>
										<FypText
											fontSize={19}
											lineHeight={26}
											fontWeight={700}
											style={tw.style("text-fans-white")}
										>
											Pay $16.50
										</FypText>
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
							<FansView
								height={42}
								borderRadius={42}
								justifyContent="center"
								style={tw.style("bg-fans-purple")}
								pressableProps={{
									onPress: handlePressOrderCall,
								}}
							>
								<FypText
									fontSize={19}
									lineHeight={26}
									fontWeight={700}
									textAlign="center"
									style={tw.style("text-fans-white")}
								>
									Order 1:1 video call
								</FypText>
							</FansView>
							<FansView margin={{ t: 32 }}>
								<MoneyGuarantee />
							</FansView>
							<FansView margin={{ t: 40 }}>
								<ChatWithUsBlock />
							</FansView>
						</FansView>
					</FansView>
				</ScrollView>
			</FansView>
		</AppLayout>
	);
};

export default OrderVideoCallScreen;
