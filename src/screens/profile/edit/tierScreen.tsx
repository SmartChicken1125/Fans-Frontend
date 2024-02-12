import { ListMarkSvg } from "@assets/svgs/common";
import FormControl from "@components/common/FormControl";
import RoundButton from "@components/common/RoundButton";
import RoundTextInput from "@components/common/RoundTextInput";
import { FypSvg, FypText } from "@components/common/base";
import CustomTopNavBar from "@components/common/customTopNavBar";
import FileDropzone from "@components/common/fileDropzone";
import AppLayout, { LayoutContentsContainer } from "@components/common/layout";
import { TierPerk } from "@components/profiles";
import { defaultPickerMedia } from "@constants/common";
import { defaultTierFormData } from "@constants/defaultFormData";
import { ProfileActionType, useAppContext } from "@context/useAppContext";
import { cdnURL } from "@helper/Utils";
import { createTier, updateTier } from "@helper/endpoints/profile/apis";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MediaType } from "@usertypes/commonEnums";
import { ProfileNavigationStacks } from "@usertypes/navigations";
import { IPickerMedia, ISubscriptionTier } from "@usertypes/types";
import useDocumentPicker from "@utils/useDocumentPicker";
import useUploadFiles from "@utils/useUploadFile";
import React, { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const TierScreen = (
	props: NativeStackScreenProps<ProfileNavigationStacks, "Tier">,
) => {
	const { navigation, route } = props;
	const { id } = route.params;
	const insets = useSafeAreaInsets();

	const { state, dispatch } = useAppContext();
	const { tiers } = state.profile;

	const isEditPage = !!id;
	const { uploadFiles } = useUploadFiles();
	const { useImagePicker } = useDocumentPicker();

	const [inProgress, setInProgress] = useState(false);
	const [tierForm, setTierForm] =
		useState<ISubscriptionTier>(defaultTierFormData);
	const [coverImg, setCoverImg] = useState<IPickerMedia>(defaultPickerMedia);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const onChange = (name: string, value: string) => {
		setTierForm({
			...tierForm,
			[name]: value,
		});
	};

	const onChangePerk = (index: number, val: string) => {
		const perks = tierForm.perks;
		setTierForm({
			...tierForm,
			perks: perks.map((el, i) => (i === index ? val : el)),
		});
	};

	const onDeletePerk = (index: number) => {
		const perks = tierForm.perks;
		setTierForm({
			...tierForm,
			perks: perks.filter((el, i) => i !== index),
		});
	};

	const handleAddNewPerk = () => {
		setTierForm({
			...tierForm,
			perks: [...tierForm.perks, ""],
		});
	};

	const handleEdit = async (newCoverImg: string) => {
		setInProgress(true);

		const resp = await updateTier(
			{
				title: tierForm.title,
				currency: tierForm.currency,
				description: tierForm.description,
				cover: newCoverImg,
				perks: tierForm.perks,
				price: parseFloat(tierForm.price as string),
			},
			{ id: id as string },
		);
		setInProgress(false);
		if (resp.ok) {
			dispatch.setProfile({
				type: ProfileActionType.updateProfile,
				data: {
					tiers: tiers.map((el) =>
						el.id === id ? { ...tierForm, cover: newCoverImg } : el,
					),
				},
			});

			navigation.goBack();
		} else {
			Toast.show({
				type: "error",
				text1: "Failed to update tier",
			});
		}
	};

	const handleCreate = async (newCoverImg: string) => {
		const resp = await createTier({
			...tierForm,
			price: parseFloat(tierForm.price as string),
			cover: newCoverImg,
		});

		if (resp.ok) {
			dispatch.setProfile({
				type: ProfileActionType.updateProfile,
				data: {
					tiers: [
						...tiers,
						{
							id: resp.data.id,
							title: resp.data.title,
							currency: resp.data.currency,
							description: resp.data.description,
							cover: resp.data.cover,
							perks: resp.data.perks,
							price: resp.data.price.toString(),
						},
					],
				},
			});

			navigation.goBack();
		} else {
			Toast.show({
				type: "error",
				text1: "Failed to create tier",
			});
		}

		setInProgress(false);
	};

	const handleSave = async () => {
		setIsSubmitted(true);
		if (
			tierForm.title === "" ||
			tierForm.price === "" ||
			parseFloat((tierForm.price as string) ?? "") > 200 ||
			tierForm.description === "" ||
			tierForm.perks.length === 0
		) {
			return;
		}
		setInProgress(true);

		let newCoverImg = coverImg.uri;
		if (coverImg.isPicker && coverImg.uri) {
			const resp = await uploadFiles([
				{ uri: coverImg.uri, type: MediaType.Image },
			]);
			if (resp.ok) {
				newCoverImg = resp.data[0].url;
			} else {
				newCoverImg = "";
			}
		}

		if (id) {
			handleEdit(newCoverImg);
		} else {
			handleCreate(newCoverImg);
		}
	};

	const onPickDocument = async () => {
		const result = await useImagePicker();
		if (result.ok) {
			const medias = result.data;
			if (medias.length > 0) {
				setCoverImg(medias[0]);
			}
		} else {
			Toast.show({
				type: "error",
				text1: result?.message ?? "",
			});
		}
	};

	useEffect(() => {
		if (id) {
			const tier = tiers.find((el) => el.id === id);
			if (tier) {
				setTierForm({
					...tier,
					price: tier?.price
						? tier?.price.toString()
						: ("" as string),
				});
				setCoverImg({
					uri: tier.cover,
					isPicker: false,
					type: MediaType.Image,
				});
			} else {
				setTierForm(defaultTierFormData);
			}
		} else {
			setTierForm(defaultTierFormData);
		}
	}, [id]);

	return (
		<AppLayout
			title="Edit Profile | FYP.Fans"
			description="FYP.Fans allows creators to make an income doing what they love!"
		>
			<View style={tw.style("flex-1")}>
				<ScrollView style={tw.style("flex-1")}>
					<LayoutContentsContainer>
						<CustomTopNavBar
							title={isEditPage ? "Edit tier" : "Add tier"}
							onClickLeft={() => navigation.goBack()}
							onClickRight={handleSave}
							rightLabel="Save"
							loading={inProgress}
						/>
						<View
							style={[
								tw.style("px-[18px] pt-6"),
								{
									paddingBottom: insets.bottom + 35,
								},
							]}
						>
							<FormControl
								value={tierForm.title}
								placeholder="e.g.Diamond"
								onChangeText={(val: string) =>
									onChange("title", val)
								}
								styles="mb-8"
								label="Tier name"
								hasError={isSubmitted && tierForm.title === ""}
								validateString="required field"
							/>

							<FormControl
								value={tierForm.price as string}
								placeholder="e.g.0"
								onChangeText={(val: string) =>
									onChange("price", val)
								}
								styles="mb-8"
								label="Cost per month (USD)"
								keyboardType="numeric"
								hasError={
									(isSubmitted && tierForm.price === "") ||
									parseFloat(
										(tierForm.price as string) ?? "",
									) > 200
								}
								validateString={
									tierForm.price === ""
										? "required field"
										: "Price should be max $200"
								}
							/>

							<View style={tw.style("mb-9")}>
								<FypText
									fontSize={17}
									lineHeight={22}
									fontWeight={600}
									margin={{ b: 15 }}
									style={tw.style(
										"text-fans-black dark:text-fans-white",
									)}
								>
									Tier description
								</FypText>
								<RoundTextInput
									value={tierForm.description}
									onChangeText={(val) =>
										onChange("description", val)
									}
									placeholder="Write a description..."
									multiline
									numberOfLines={4}
									maxLength={100}
									customStyles="py-3 px-5 rounded-[7px] h-[128px]"
									hasError={
										isSubmitted &&
										tierForm.description === ""
									}
								/>
							</View>

							<View style={tw.style("mb-4")}>
								<FypText
									fontSize={17}
									lineHeight={22}
									margin={{ b: 15 }}
									style={tw.style(
										isSubmitted &&
											tierForm.perks.length === 0
											? "red"
											: "text-fans-black dark:text-fans-white",
									)}
								>
									Tier perks
								</FypText>

								<View style={tw.style("gap-y-3")}>
									{tierForm.perks.map((el, index) => (
										<TierPerk
											key={index}
											value={el}
											onCancel={() => onDeletePerk(index)}
											onChange={(val) =>
												onChangePerk(index, val)
											}
										/>
									))}
								</View>
								<View
									style={tw.style(
										"pl-[42px] mt-3",
										tierForm.perks.length > 9 && "hidden",
									)}
								>
									<Pressable
										onPress={handleAddNewPerk}
										style={tw.style(
											"bg-[rgba(240,240,240,0.4)] h-[42px] flex-row items-center pl-11 rounded-[42px]",
										)}
									>
										<View
											style={tw.style(
												"absolute left-[18px]",
											)}
										>
											<FypSvg
												svg={ListMarkSvg}
												width={14.88}
												height={14.89}
												color="fans-grey-70/50 dark:fans-grey-b1/50"
											/>
										</View>
										<FypText
											fontSize={18}
											lineHeight={24}
											style={tw.style(
												"text-fans-black/50 dark:text-fans-white/50",
											)}
										>
											Add perk
										</FypText>
									</Pressable>
								</View>
							</View>

							<View style={tw.style("mb-9")}>
								<FypText
									fontSize={17}
									lineHeight={22}
									fontWeight={600}
									margin={{ b: 15 }}
									style={tw.style(
										"text-fans-black dark:text-fans-white",
									)}
								>
									Cover image
								</FypText>
								<View>
									{coverImg.uri ? (
										<Image
											source={{
												uri: coverImg.isPicker
													? coverImg.uri
													: cdnURL(coverImg.uri),
											}}
											style={tw.style(
												"w-full h-[390px] mb-4",
											)}
											resizeMode="cover"
										/>
									) : null}
									<FileDropzone
										fileCounts={0}
										onPress={onPickDocument}
									/>
								</View>
							</View>

							<RoundButton
								onPress={handleSave}
								loading={inProgress}
							>
								Save tier
							</RoundButton>
						</View>
					</LayoutContentsContainer>
				</ScrollView>
			</View>
		</AppLayout>
	);
};

export default TierScreen;
