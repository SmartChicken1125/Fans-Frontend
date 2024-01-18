import RoundButton from "@components/common/RoundButton";
import RoundTextInput from "@components/common/RoundTextInput";
import { FypText } from "@components/common/base";
import CustomTopNavBar from "@components/common/customTopNavBar";
import AppLayout, { LayoutContentsContainer } from "@components/common/layout";
import getSocialIconComponent from "@components/socialIcons";
import { ProfileActionType, useAppContext } from "@context/useAppContext";
import { updateSocialLinks } from "@helper/endpoints/profile/apis";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ComponentSizeTypes, RoundButtonType } from "@usertypes/commonEnums";
import { ProfileNavigationStacks } from "@usertypes/navigations";
import { ISocialLink } from "@usertypes/types";
import { validateSocialLink } from "@utils/validateHelper";
import React, { FC, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

interface SocialMediaLinkInputProps {
	data: ISocialLink;
	isSubmitted: boolean;
	onChange: (val: string) => void;
}

export const SocialMediaLinkInput: FC<SocialMediaLinkInputProps> = (props) => {
	const { data, onChange, isSubmitted } = props;

	return (
		<View>
			<FypText
				fontSize={17}
				lineHeight={21}
				fontWeight={600}
				margin={{ b: 16 }}
				style={tw.style("text-fans-black dark:text-fans-white")}
			>
				{data.title}
			</FypText>
			<View style={tw.style("relative")}>
				<RoundTextInput
					value={data.url}
					onChangeText={onChange}
					customStyles="pl-12"
					autoCapitalize="none"
					maxLength={100}
					hasError={isSubmitted && !validateSocialLink(data).isValid}
					helperText={validateSocialLink(data).message}
				/>
				<View style={tw.style("absolute top-1 left-1")}>
					{getSocialIconComponent({
						iconName: data.provider,
						size: ComponentSizeTypes.sm,
					})}
				</View>
			</View>
		</View>
	);
};

const AddSocialMediaLinksScreen = (
	props: NativeStackScreenProps<ProfileNavigationStacks, "SocialLinks">,
) => {
	const { navigation } = props;
	const insets = useSafeAreaInsets();

	const { state, dispatch } = useAppContext();
	const { socialLinks } = state.profile;

	const [socials, setSocials] = useState<ISocialLink[]>([]);
	const [inProgress, setInProgress] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSave = async () => {
		setIsSubmitted(true);
		let hasError = false;
		socials.forEach((link) => {
			if (!validateSocialLink(link).isValid) {
				hasError = true;
			}
		});
		if (hasError) {
			return;
		}
		const postbody = {
			links: socials.map((social) => ({
				provider: social.provider,
				url:
					social.url !== ""
						? `${
								social.url.includes("https://")
									? social.url
									: `https://${social.url}`
						  }`
						: "",
			})),
		};

		setInProgress(true);

		const resp = await updateSocialLinks(postbody);

		if (resp.ok) {
			setInProgress(false);
			dispatch.setProfile({
				type: ProfileActionType.updateSocialLinks,
				data: resp.data.socialLinks,
			});
			navigation.goBack();
		} else {
			Toast.show({
				type: "error",
				text1: "Failed to add links",
			});
		}
	};

	const handleChange = (provider: string, value: string) => {
		setSocials(
			socials.map((social) =>
				social.provider === provider
					? { ...social, url: value }
					: social,
			),
		);
	};

	useEffect(() => {
		setSocials(socialLinks);
	}, []);

	return (
		<AppLayout
			title="Edit Profile | FYP.Fans"
			description="FYP.Fans allows creators to make an income doing what they love!"
		>
			<View style={tw.style("flex-1")}>
				<ScrollView style={tw.style("flex-1")}>
					<LayoutContentsContainer>
						<CustomTopNavBar
							title="Add social media links"
							onClickLeft={() => navigation.goBack()}
							onClickRight={handleSave}
							rightLabel="Save"
							loading={inProgress}
						/>
						<View
							style={tw.style("px-[18px] pt-6", {
								paddingBottom: insets.bottom + 35,
							})}
						>
							<FypText
								fontSize={16}
								lineHeight={21}
								textAlign="center"
								style={tw.style(
									"text-fans-black dark:text-fans-white max-w-[250px] mx-auto mb-10",
								)}
							>
								Add your social media accounts to your profile
								page
							</FypText>

							<View style={tw.style("gap-y-[28px]")}>
								{socials.map((social) => (
									<SocialMediaLinkInput
										key={social.provider}
										data={social}
										isSubmitted={isSubmitted}
										onChange={(val) =>
											handleChange(social.provider, val)
										}
									/>
								))}
							</View>

							<View
								style={tw.style(
									"flex-row justify-between gap-x-[14px] mt-[30px]",
								)}
							>
								<View style={tw.style("flex-1")}>
									<RoundButton
										variant={
											RoundButtonType.OUTLINE_PRIMARY
										}
										onPress={() => navigation.goBack()}
									>
										Discard
									</RoundButton>
								</View>
								<View style={tw.style("flex-1")}>
									<RoundButton
										onPress={handleSave}
										loading={inProgress}
									>
										Save
									</RoundButton>
								</View>
							</View>
						</View>
					</LayoutContentsContainer>
				</ScrollView>
			</View>
		</AppLayout>
	);
};
export default AddSocialMediaLinksScreen;
