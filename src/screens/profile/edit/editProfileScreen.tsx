import { ChevronRightSvg, PhotoCameraSvg } from "@assets/svgs/common";
import AvatarWithStatus from "@components/common/AvatarWithStatus";
import FormControl from "@components/common/FormControl";
import RoundButton from "@components/common/RoundButton";
import RoundTextInput from "@components/common/RoundTextInput";
import {
	FypCollapsible,
	FypNullableView,
	FypSvg,
	FypText,
} from "@components/common/base";
import CustomMaskInput from "@components/common/customMaskInput";
import AppLayout, { LayoutContentsContainer } from "@components/common/layout";
import { FansIconButton, FansView } from "@components/controls";
import {
	BackgroundColor,
	EditSubLink,
	ProfileCarousel,
	ProfileThreeDotsDialog,
	SocialMediaLink,
	TopActions,
} from "@components/profiles";
import { PROFILE_THREE_DOTS_DIALOG_ID } from "@constants/modal";
import {
	ModalActionType,
	ProfileActionType,
	useAppContext,
} from "@context/useAppContext";
import {
	updateMyProfile,
	updateProfileAvatar,
	updateSocialLinks,
} from "@helper/endpoints/profile/apis";
import { ProfileReqBody } from "@helper/endpoints/profile/schemas";
import { updateSetting } from "@helper/endpoints/settings/apis";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFeatureGates } from "@state/featureGates";
import {
	ComponentSizeTypes,
	MediaType,
	RoundButtonType,
} from "@usertypes/commonEnums";
import { ProfileNavigationStacks } from "@usertypes/navigations";
import useDocumentPicker from "@utils/useDocumentPicker";
import useUploadFiles from "@utils/useUploadFile";
import { DateTime } from "luxon";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Toast from "react-native-toast-message";

const EditProfileScreen = (
	props: NativeStackScreenProps<ProfileNavigationStacks, "Edit">,
) => {
	const { navigation } = props;
	const { state, dispatch } = useAppContext();

	const profile = state.profile;
	const { userInfo } = state.user;
	const { socialLinks } = profile;
	const datePattern =
		/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;

	const { useImagePicker } = useDocumentPicker();
	const { uploadFiles } = useUploadFiles();
	const featureGates = useFeatureGates();
	const job2Enabled = featureGates.has("2023_10-swan-job-2");

	const [formData, setFormData] = useState({
		displayName: "",
		profileLink: "",
		birthday: "",
		location: "",
		bio: "",
	});

	const [isSubmitted, setIsSubmitted] = useState(false);
	const [hideSocials, setHideSocials] = useState(true);
	const [inUpdatingAvatar, setInUpdatingAvatar] = useState(false);
	const [inProgress, setInProgress] = useState(false);

	const onChangeField = (name: string, value: string) => {
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSave = async () => {
		setIsSubmitted(true);
		if (!datePattern.test(formData.birthday) && formData.birthday !== "") {
			return false;
		}

		const currentYear = new Date().getFullYear();
		const age = currentYear - parseInt(formData.birthday.split("/")[2]);
		if (age < 18) {
			Toast.show({
				type: "error",
				text1: "To use our platform you have to be 18 years or older.",
			});
			return;
		}

		if (formData.displayName === "" || formData.profileLink === "") {
			return;
		}

		setInProgress(true);
		const birthday = moment(formData.birthday).toDate();
		await updateSetting({
			birthdate: birthday,
		});
		/*
		const usernameRes = await updateSetting({
			username: formData.profileLink,
		});
		if (!usernameRes.ok) {
			Toast.show({
				type: "error",
				text1: usernameRes.data.message,
			});
			setInProgress(false);
			return;
		}
		*/

		const updatedProfileLink = formData.profileLink;

		const postbody: ProfileReqBody = {
			displayName: formData.displayName,
			bio: formData.bio,
			location: formData.location,
		};
		if (
			profile.profileLink &&
			profile.profileLink !== formData.profileLink
		) {
			postbody.profileLink = updatedProfileLink;
		}
		const resp = await updateMyProfile(postbody);

		if (resp.ok) {
			dispatch.setProfile({
				type: ProfileActionType.updateProfile,
				data: {
					...formData,
					displayName: formData.displayName.slice(0, 50),
					profileLink: updatedProfileLink,
					user: profile.user
						? {
								...profile.user,
								birthdate: birthday.toJSON(),
						  }
						: undefined,
				},
			});
			navigation.goBack();
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
		setInProgress(false);
	};

	const handleDiscard = () => {
		navigation.goBack();
	};

	const handleEditSocialMedia = () => {
		navigation.navigate("SocialLinks");
	};

	const handleDeleteSocialMedia = async (id: string) => {
		const postbody = {
			links: profile.socialLinks.map((social) => ({
				provider: social.provider,
				url: social.id === id ? "" : social.url,
			})),
		};

		dispatch.setShowLoading();

		const resp = await updateSocialLinks(postbody);

		if (resp.ok) {
			dispatch.setHideLoading();
			dispatch.setProfile({
				type: ProfileActionType.updateSocialLinks,
				data: resp.data.socialLinks,
			});
		} else {
			Toast.show({
				type: "error",
				text1: "Failed to add links",
			});
		}
	};

	const onChangeAvatar = async () => {
		const result = await useImagePicker();
		if (result.ok) {
			const medias = result.data;
			if (medias.length > 0) {
				setInUpdatingAvatar(true);
				const resp = await uploadFiles([
					{ uri: medias[0].uri, type: MediaType.Image },
				]);
				if (resp?.ok) {
					const avatarResp = await updateProfileAvatar({
						avatar: resp.data[0].url as string,
					});
					if (avatarResp.ok) {
						dispatch.fetchUserInfo();
						dispatch.fetchProfile();
					} else {
						Toast.show({
							type: "error",
							text1: avatarResp.data.message,
						});
					}
				}
				setInUpdatingAvatar(false);
			}
		} else {
			Toast.show({
				type: "error",
				text1: result?.message ?? "",
			});
			setInUpdatingAvatar(false);
		}
	};

	const onClickThreeDots = useCallback(() => {
		dispatch.setModal({
			type: ModalActionType.showModal,
			data: { id: PROFILE_THREE_DOTS_DIALOG_ID, show: true },
		});
	}, []);

	useEffect(() => {
		let _birthday = "";
		if (profile.user?.birthdate) {
			_birthday = DateTime.fromISO(profile.user?.birthdate).toFormat(
				"MM/dd/yyyy",
			);
		}
		setFormData({
			displayName: profile.displayName,
			profileLink: profile.profileLink ? profile.profileLink : "",
			birthday: _birthday,
			location: profile.location,
			bio: profile.bio,
		});
	}, [profile.user]);

	return (
		<AppLayout
			title="Edit Profile | FYP.Fans"
			description="FYP.Fans allows creators to make income doing what they love!"
		>
			<FansView flex="1">
				<ScrollView style={tw.style("flex-1")}>
					<LayoutContentsContainer paddingTop={0}>
						<FansView padding={{ b: 78 }} position="relative">
							<TopActions
								onClickBack={() => {
									navigation.goBack();
								}}
								onClickMenu={onClickThreeDots}
							/>

							<FansView position="relative">
								<ProfileCarousel images={profile.cover} />
								<FansView
									position="absolute"
									top={85}
									left={0}
									justifyContent="center"
									flexDirection="row"
									gap={8}
									style={tw.style("w-full")}
								>
									<FansIconButton
										size={40}
										backgroundColor="bg-fans-white/75 dark:bg-fans-black-1d/75"
										onPress={() =>
											navigation.navigate("Cover")
										}
									>
										<FypSvg
											svg={PhotoCameraSvg}
											width={19}
											height={17}
											color="fans-black dark:fans-white"
										/>
									</FansIconButton>
								</FansView>
							</FansView>

							<FansView padding={{ x: 18 }} margin={{ b: 32 }}>
								<FansView
									flexDirection="row"
									alignItems="end"
									margin={{ t: -30, b: 18 }}
									justifyContent="between"
								>
									<FansView position="relative">
										<AvatarWithStatus
											size={79}
											avatar={userInfo.avatar}
										/>
										{inUpdatingAvatar ? (
											<ActivityIndicator
												animating={true}
												color="#fff"
												style={[
													tw.style(
														"absolute top-1/2 left-1/2",
													),
													{
														transform: [
															{
																translateX: -12,
															},
															{
																translateY: -12,
															},
														],
													},
												]}
											/>
										) : (
											<FansIconButton
												onPress={onChangeAvatar}
												backgroundColor="bg-fans-white/75 dark:bg-fans-black-1d/75"
												size={34}
												style={[
													tw.style(
														"absolute top-1/2 left-1/2",
													),
													{
														transform: [
															{
																translateX: -17,
															},
															{
																translateY: -17,
															},
														],
													},
												]}
											>
												<FypSvg
													svg={PhotoCameraSvg}
													width={19}
													height={17}
													color="fans-black dark:fans-white"
												/>
											</FansIconButton>
										)}
									</FansView>

									<FansView flexDirection="row" gap={7}>
										<RoundButton
											size={ComponentSizeTypes.md}
											variant={
												RoundButtonType.OUTLINE_PRIMARY
											}
											onPress={handleDiscard}
										>
											Discard
										</RoundButton>
										<RoundButton
											onPress={handleSave}
											size={ComponentSizeTypes.md}
											customStyles="flex-row items-center"
										>
											<FansView
												flexDirection="row"
												alignItems="center"
											>
												<ActivityIndicator
													animating={true}
													size={16}
													color="#fff"
													style={tw.style(
														"mr-1",
														!inProgress && "hidden",
													)}
												/>
												Save
											</FansView>
										</RoundButton>
									</FansView>
								</FansView>

								<FormControl
									label="Display name"
									value={formData.displayName}
									onChangeText={(text: string) =>
										onChangeField("displayName", text)
									}
									placeholder=""
									hasError={
										isSubmitted &&
										formData.displayName === ""
									}
									validateString="Please enter display name"
									styles="mb-6"
									maxLength={50}
								/>

								<FansView margin={{ b: 24 }}>
									<FypText
										fontSize={17}
										lineHeight={22}
										fontWeight={600}
										style={tw.style(
											"mb-[14px] text-fans-black dark:text-fans-white",
										)}
									>
										Profile link
									</FypText>
									<FansView>
										<FansView flexDirection="row">
											<FansView padding={{ t: 9 }}>
												<FypText
													fontSize={18}
													lineHeight={24}
													color="purple"
												>
													fyp.fans/
												</FypText>
											</FansView>

											<FansView
												flex="1"
												margin={{ l: 14 }}
											>
												<RoundTextInput
													value={formData.profileLink}
													onChangeText={(
														text: string,
													) =>
														onChangeField(
															"profileLink",
															text,
														)
													}
													placeholder=""
													customStyles="text-fans-purple"
													autoCapitalize="none"
													hasError={
														isSubmitted &&
														formData.profileLink ===
															""
													}
													helperText="Please enter link name"
													maxLength={100}
												/>
											</FansView>
										</FansView>
									</FansView>
								</FansView>

								<FormControl
									label="Bio"
									value={formData.bio}
									onChangeText={(val: string) =>
										onChangeField("bio", val)
									}
									placeholder=""
									isTextArea
									styles="mb-6"
									maxLength={1000}
								/>
								<FormControl
									label="Location"
									value={formData.location}
									onChangeText={(val: string) =>
										onChangeField("location", val)
									}
									placeholder="Enter location"
									styles="mb-6"
									maxLength={50}
								/>

								<FansView>
									<FypText
										fontSize={17}
										lineHeight={22}
										fontWeight={600}
										style={tw.style(
											"mb-[14px] text-fans-black dark:text-fans-white",
										)}
									>
										Birth date
									</FypText>
									<CustomMaskInput
										value={formData.birthday}
										onChangeText={(val) =>
											onChangeField("birthday", val)
										}
										placeholder="MM/DD/YYYY"
										hasError={
											isSubmitted &&
											!datePattern.test(
												formData.birthday,
											) &&
											formData.birthday !== ""
										}
										helperText="Invalid birth date"
										type="date"
									/>
								</FansView>
							</FansView>

							<FansView gap={4} margin={{ b: 36 }}>
								<EditSubLink
									title="Subscription plans & bundles"
									onPress={() => {
										navigation.navigate("Subscription");
									}}
								/>

								<FansView>
									<FansView
										flexDirection="row"
										alignItems="center"
										justifyContent="between"
										padding={{ y: 15, x: 18 }}
										pressableProps={{
											onPress: () =>
												setHideSocials(!hideSocials),
										}}
									>
										<FypText
											fontSize={17}
											lineHeight={22}
											fontWeight={600}
											style={tw.style(
												"text-fans-black dark:text-fans-white",
											)}
										>
											Social media
										</FypText>
										{hideSocials && (
											<FypSvg
												svg={ChevronRightSvg}
												width={8.14}
												height={14.3}
												color="fans-grey-70 dark:fans-grey-b1"
											/>
										)}
									</FansView>
									<FypCollapsible collapsed={hideSocials}>
										<FansView padding={{ x: 18, b: 12 }}>
											<FansView>
												{socialLinks
													.filter(
														(el) => el.url !== "",
													)
													.map((social) => (
														<SocialMediaLink
															key={social.id}
															data={social}
															onClickEdit={
																handleEditSocialMedia
															}
															onClickDelete={() =>
																handleDeleteSocialMedia(
																	social.id,
																)
															}
														/>
													))}
											</FansView>
											<RoundButton
												variant={
													RoundButtonType.OUTLINE_PRIMARY
												}
												customStyles="mt-[18px]"
												onPress={() =>
													navigation.navigate(
														"SocialLinks",
													)
												}
											>
												Link social media
											</RoundButton>
										</FansView>
									</FypCollapsible>
								</FansView>
								<FypNullableView visible={job2Enabled}>
									<EditSubLink
										title="Tracking links"
										onPress={() => {
											navigation.navigate(
												"TrackingLinks",
											);
										}}
									/>
								</FypNullableView>

								<EditSubLink
									title="Preview"
									onPress={() => {
										navigation.navigate("Preview");
									}}
								/>
								<EditSubLink
									title="Highlights"
									onPress={() => {
										navigation.navigate("Highlights");
									}}
								/>
								<EditSubLink
									title="Categories"
									onPress={() => {
										navigation.navigate("Categories");
									}}
								/>
								<EditSubLink
									title="Payouts"
									onPress={() => {
										navigation.navigate("GetPaid");
									}}
								/>
								<FypNullableView
									visible={featureGates.has(
										"2024_02-xp-system",
									)}
								>
									<EditSubLink
										title="Fans levels / roles"
										onPress={() => {
											navigation.navigate("Levels");
										}}
									/>
								</FypNullableView>
								<FypNullableView visible={job2Enabled}>
									<EditSubLink
										title="Badge system"
										onPress={() => {
											navigation.navigate("Badge");
										}}
									/>
								</FypNullableView>
								<FypNullableView
									visible={featureGates.has(
										"2023_12-edit-the-edit-profile-page",
									)}
								>
									<EditSubLink title="Custom video orders" />
									<EditSubLink title="Video calls" />
									<EditSubLink title="Store" />
								</FypNullableView>
								<FypNullableView
									visible={featureGates.has(
										"2023_12-custom-profile-background",
									)}
								>
									<FansView padding={{ x: 18, t: 15 }}>
										<FypText
											fontSize={17}
											fontWeight={600}
											lineHeight={22}
											margin={{ b: 11 }}
											style={tw.style(
												"text-fans-black dark:text-fans-white",
											)}
										>
											Custom profile background
										</FypText>
										<FypText
											fontSize={16}
											lineHeight={21}
											margin={{ b: 24 }}
											style={tw.style(
												"text-fans-grey-70 dark:text-fans-grey-b1",
											)}
										>
											Personalize your profile page's
											appearance by choosing the
											background gradient colors
										</FypText>
										<FansView flexDirection="row" gap={14}>
											<BackgroundColor
												title="Primary color"
												background="fans-purple-f6"
											/>
											<BackgroundColor
												title="Secondary color"
												background="fans-blue-1D/20"
											/>
										</FansView>
									</FansView>
								</FypNullableView>
							</FansView>

							<FansView
								flexDirection="row"
								justifyContent="between"
								gap={14}
								padding={{ x: 18 }}
							>
								<FansView flex="1">
									<RoundButton
										variant={
											RoundButtonType.OUTLINE_PRIMARY
										}
										onPress={handleDiscard}
									>
										Discard
									</RoundButton>
								</FansView>
								<FansView flex="1">
									<RoundButton
										onPress={handleSave}
										loading={inProgress}
									>
										Save
									</RoundButton>
								</FansView>
							</FansView>
						</FansView>
					</LayoutContentsContainer>
				</ScrollView>
			</FansView>
			<ProfileThreeDotsDialog navigation={navigation} />
		</AppLayout>
	);
};

export default EditProfileScreen;
