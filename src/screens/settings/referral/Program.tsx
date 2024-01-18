import {
	ChevronLeft1Svg,
	ExpandSvg,
	LaunchSvg,
	ProfitSvg,
} from "@assets/svgs/common";
import RoundButton from "@components/common/RoundButton";
import RoundTextInput from "@components/common/RoundTextInput";
import { FypDropdown, FypSwitch, FypText } from "@components/common/base";
import FansInfoCard from "@components/common/infoCard";
import AppLayout, { LayoutContentsContainer } from "@components/common/layout";
import { FansGap, FansSvg, FansText, FansView } from "@components/controls";
import { ProfileActionType, useAppContext } from "@context/useAppContext";
import { updateMyProfile } from "@helper/endpoints/profile/apis";
import { ProfileReqBody } from "@helper/endpoints/profile/schemas";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFeatureGates } from "@state/featureGates";
import { RoundButtonType } from "@usertypes/commonEnums";
import { ProfileNavigationStacks } from "@usertypes/navigations";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Dimensions,
	ScrollView,
	Text,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import YoutubePlayer from "react-native-youtube-iframe";

const ReferralProgramScreen = (
	props: NativeStackScreenProps<ProfileNavigationStacks, "ReferralProgram">,
) => {
	const router = useRouter();
	const featureGates = useFeatureGates();
	const dimensions = Dimensions.get("window");

	const { dispatch } = useAppContext();
	const insets = useSafeAreaInsets();
	const isSetting = props.route?.params?.isSetting ?? true;
	const [inProgress, setInProgress] = useState(false);
	const [joinProgram, setJoinProgram] = useState(false);
	const [revenueShare, setRevenueShare] = useState("");
	const [marketingLink, setMarketingLink] = useState("");
	const navigation = useNavigation();

	const onSkip = () => {
		router.replace("/posts");
	};

	const onSave = async () => {
		setInProgress(true);

		const postbody: ProfileReqBody = {
			isFanReferralEnabled: joinProgram,
			fanReferralShare: Number(revenueShare),
			marketingContentLink: marketingLink,
		};
		const resp = await updateMyProfile(postbody);

		if (resp.ok) {
			dispatch.setProfile({
				type: ProfileActionType.updateProfile,
				data: {
					isFanReferralEnabled: joinProgram,
					fanReferralShare: Number(revenueShare),
					marketingContentLink: marketingLink,
				},
			});
			if (!isSetting) {
				onSkip();
			} else {
				Toast.show({
					type: "success",
					text1: "Your Referral Program settings was saved!",
				});
			}
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
		setInProgress(false);
	};

	const handlerClick = () => {
		isSetting ? onSave() : onSkip();
	};

	const [isLargeScreen, setIsLargeScreen] = useState(tw.prefixMatch("lg"));
	useEffect(() => {
		setIsLargeScreen(tw.prefixMatch("lg"));
	}, [tw, tw.prefixMatch]);

	if (!featureGates.has("2023_12-fans-referral")) {
		router.replace("/posts");
		return null;
	}

	return (
		<AppLayout>
			<FansView style={tw.style("relative w-full")}>
				<FansView
					height={{ xs: 64, lg: 103 }}
					alignItems="center"
					flexDirection="row"
					padding={{ x: 24 }}
					style={tw.style(
						"bg-fans-white dark:bg-fans-black-1d",
						"border-b border-fans-grey-f0 dark:border-fans-grey-43",
					)}
				>
					<FansView
						touchableOpacityProps={{
							onPress: () => {
								if (navigation.canGoBack()) {
									navigation.goBack();
								} else {
									if (router.canGoBack()) {
										router.back();
									} else {
										router.replace({
											pathname: "posts",
											params: { screen: "Home" },
										});
									}
								}
							},
						}}
						width={40}
						height={40}
						padding={{ x: 4, y: 12 }}
					>
						<FansSvg
							width={8}
							height={16}
							svg={ChevronLeft1Svg}
							color1={
								tw.prefixMatch("dark") ? "grey-b1" : "grey-70"
							}
						/>
					</FansView>
					<FansGap viewStyle={{ flex: "1" }} />
					<FansText fontFamily="inter-bold" fontSize={19}>
						Referral Program
					</FansText>
					<FansGap viewStyle={{ flex: "1" }} />
					<FansView
						touchableOpacityProps={{
							onPress: handlerClick,
						}}
						height={40}
					>
						<FansText
							color={
								tw.prefixMatch("dark") ? "grey-b1" : "grey-70"
							}
							fontFamily="inter-bold"
							fontSize={17}
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								height: 40,
							}}
						>
							{isSetting ? "Save" : "Skip"}
						</FansText>
					</FansView>
				</FansView>

				<ScrollView style={tw.style("relative w-full")}>
					<LayoutContentsContainer>
						<View
							style={{
								paddingBottom: insets.bottom + 35,
							}}
						>
							<View style={tw.style("pt-6 px-4.5")}>
								<FypText
									fontSize={16}
									lineHeight={21}
									textAlign="center"
									margin={{ b: 40 }}
								>
									Accelerate your success with our unique
									Referral Program! Watch your fanbase grow
									rapidly as individuals share your content
									far and wide
								</FypText>
								<View>
									<FansText
										style={tw.style("text-[19px] mb-1.5")}
									>
										Referral Program
									</FansText>
									<View
										style={tw.style(
											"h-13 flex-row items-center justify-between mb-3",
										)}
									>
										<FansText
											style={tw.style(
												"text-[18px] leading-6 text-black",
											)}
										>
											Join Program
										</FansText>
										<FypSwitch
											value={joinProgram}
											onValueChange={(val) =>
												setJoinProgram(val)
											}
										/>
									</View>

									<FansInfoCard text="Joining is optional, and you can discontinue program at any time" />

									<View style={tw.style("mb-7.5")}>
										<FansText
											style={tw.style(
												"text-[17px] mb-3 text-black relative",
											)}
										>
											Revenue share
											<Text
												style={tw.style(
													"text-sm absolute top-[-0.5em] text-fans-red",
												)}
											>
												*
											</Text>
										</FansText>
										<FypText
											fontSize={16}
											lineHeight={21}
											margin={{ b: 16 }}
											style={tw.style(
												"text-fans-dark-grey",
											)}
										>
											Choose what percent of revenue
											referrers earn from new fans they
											refer
										</FypText>
										<FypDropdown
											data={[
												{
													data: "5",
													label: "5%",
												},
												{
													data: "10",
													label: "10%",
												},
												{
													data: "25",
													label: "25%",
												},
												{
													data: "40",
													label: "40%",
												},
											]}
											value={revenueShare}
											onSelect={(val) =>
												setRevenueShare(val as string)
											}
											placeholder="Revenue share"
										/>
									</View>

									<View style={tw.style("mb-8")}>
										<FansText
											fontSize={17}
											lineHeight={22}
											style={tw.style("mb-3")}
										>
											Upload content
										</FansText>
										<FansText
											color="grey-70"
											fontSize={16}
											lineHeight={21}
											style={tw.style("mb-9")}
										>
											Upload marketing content that
											marketers can use. Attach a google
											drive link that has material
										</FansText>
										<RoundTextInput
											customStyles="text-fans-grey-dark"
											placeholder="drive.google.com/drive/fypfans"
											maxLength={200}
											value={marketingLink}
											onChangeText={(text: string) =>
												setMarketingLink(text)
											}
										/>
									</View>
								</View>
								<View style={tw.style("mb-9")}>
									<FypText
										fontSize={17}
										lineHeight={22}
										fontWeight={600}
										margin={{ b: 15 }}
									>
										Video explanation
									</FypText>

									<YoutubePlayer
										width={
											isLargeScreen
												? 670
												: dimensions.width - 36
										}
										height={
											isLargeScreen
												? 436
												: (dimensions.width - 36) * 0.65
										}
										videoId={"mcYrfIMIeqk"}
									/>
								</View>
								<View
									style={tw.style(
										"gap-y-8 mx-[26px] mb-50 mt-6",
									)}
								>
									<View
										style={{
											flexDirection: isLargeScreen
												? "row"
												: "column",
										}}
									>
										<View
											style={{
												flex: 1,
												width: "100%",
											}}
										>
											<View
												style={tw.style(
													"flex-row justify-center mb-3 p-1",
												)}
											>
												<LaunchSvg size={73} />
											</View>
											<FypText
												fontSize={16}
												lineHeight={21}
												textAlign="center"
												margin={{ b: 12 }}
											>
												1. Launch
											</FypText>
											<FypText
												fontSize={16}
												lineHeight={21}
												textAlign="center"
												style={tw.style(
													"text-fans-dark-grey dark:text-fans-grey-b1",
												)}
											>
												Setup your referral program by
												picking revenue share given to
												referrers, empowering fans to
												become promoters
											</FypText>
										</View>

										{!isLargeScreen && (
											<FansGap height={32} />
										)}

										<View
											style={{
												flex: 1,
												width: "100%",
											}}
										>
											<View
												style={tw.style(
													"flex-row justify-center mb-3",
												)}
											>
												<ExpandSvg size={82} />
											</View>
											<FypText
												fontSize={16}
												lineHeight={21}
												textAlign="center"
												margin={{ b: 12 }}
											>
												2. Expand
											</FypText>
											<FypText
												fontSize={16}
												lineHeight={21}
												textAlign="center"
												style={tw.style(
													"text-fans-dark-grey",
												)}
											>
												Fans and expert marketers spread
												your work, attracting new users
												via their unique referral links
											</FypText>
										</View>
									</View>

									<View
										style={{
											width: isLargeScreen
												? "50%"
												: "100%",
											marginHorizontal: isLargeScreen
												? "25%"
												: 0,
										}}
									>
										<View
											style={tw.style(
												"flex-row justify-center mb-3",
											)}
										>
											<ProfitSvg size={77.8} />
										</View>
										<FypText
											fontSize={16}
											lineHeight={21}
											textAlign="center"
											margin={{ b: 12 }}
										>
											3. Profit
										</FypText>
										<FypText
											fontSize={16}
											lineHeight={21}
											textAlign="center"
											style={tw.style(
												"text-fans-dark-grey",
											)}
										>
											With each successful referral, your
											promoters enjoy a share of lifetime
											earnings, further fueling your
											expansive growth
										</FypText>
									</View>
								</View>

								{!isSetting && (
									<RoundButton
										variant={RoundButtonType.PRIMARY}
										onPress={onSave}
										disabled={
											joinProgram && revenueShare === ""
										}
									>
										Save
									</RoundButton>
								)}
							</View>
						</View>
					</LayoutContentsContainer>
				</ScrollView>
				<ActivityIndicator
					animating={true}
					color="#a854f5"
					style={tw.style(
						"absolute top-1/2 left-1/2",
						!inProgress && "hidden",
					)}
				/>
			</FansView>
		</AppLayout>
	);
};

export default ReferralProgramScreen;
