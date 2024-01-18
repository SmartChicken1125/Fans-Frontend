import {
	AnalyticsSvg,
	Check1Svg,
	ChevronLeft1Svg,
	Copy1Svg,
	EditSvg,
	PhonewithCashSvg,
	ReferCreatorsAnalytics,
} from "@assets/svgs/common";
import RoundButton from "@components/common/RoundButton";
import { FypModal, FypSvg, FypText } from "@components/common/base";
import {
	FansButton3,
	FansGap,
	FansImage2,
	FansScreen3,
	FansSvg,
	FansText,
	FansView,
} from "@components/controls";
import SettingsNavigationHeader from "@components/screens/settings/SettingsNavigationHeader";
import SettingsNavigationLayout from "@components/screens/settings/SettingsNavigationLayout";
import { CommonActionType, useAppContext } from "@context/useAppContext";
import { getReferralLinks } from "@helper/endpoints/referral/apis";
import tw from "@lib/tailwind";
import {
	NativeStackNavigationProp,
	createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { useFeatureGates } from "@state/featureGates";
import { RoundButtonType, UserRoleTypes } from "@usertypes/commonEnums";
import { Colors } from "@usertypes/enums";
import {
	ReferralProgramNativeStackParams,
	SettingsReferCreatorsNativeStackParams,
} from "@usertypes/navigations";
import { CreatorReferral } from "@usertypes/types";
import { useBlankLink } from "@utils/useBlankLink";
import { setStringAsync } from "expo-clipboard";
import { LinearGradient as LinearGradientView } from "expo-linear-gradient";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { Defs, G, LinearGradient, Path, Stop, Svg } from "react-native-svg";
import ToastMessage from "react-native-toast-message";
import YoutubePlayer from "react-native-youtube-iframe";
import CreateNewLinkDialog from "./dialogs/CreateNewLinkDialog";
import EditLinkDialog from "./dialogs/EditLinkDialog";
import ViewAnalyticsDialog from "./dialogs/ViewAnalyticsDialog";
import ReferralLinkCreatedModal from "./modal/ReferralLinkCreatedModal";

const Stack =
	createNativeStackNavigator<SettingsReferCreatorsNativeStackParams>();

const SettingsReferCreatorsNativeStack = () => {
	const router = useRouter();

	return (
		<Stack.Navigator
			initialRouteName="ReferCreators"
			screenOptions={{
				header: (props) => SettingsNavigationHeader(props, router),
			}}
		>
			<Stack.Screen
				name="ReferCreators"
				component={ReferCreatorsEarnContentView}
				options={{
					title: "Refer and earn",
				}}
			/>
		</Stack.Navigator>
	);
};

const ReferCreatorsEarnContentView = () => {
	const router = useRouter();
	const featureGates = useFeatureGates();
	if (!featureGates.has("2023_11-referral-links")) {
		router.replace("/posts");
		return <></>;
	}

	const navigation =
		useNavigation<
			NativeStackNavigationProp<ReferralProgramNativeStackParams>
		>();

	navigation.setOptions({
		header: (props) => {
			const { navigation, options } = props;
			const { title } = options;

			const handlePress = () => {
				if (navigation.canGoBack()) {
					navigation.goBack();
				} else {
					if (router.canGoBack()) {
						router.back();
					} else {
						router.replace("/posts");
					}
				}
			};

			return (
				<FansView style={tw.style("overflow-hidden")}>
					<LinearGradientView
						colors={["#5F17D3", "#A854F5"]}
						start={{ x: 0.3, y: 0.9 }}
						end={{ x: 1.3, y: -0.1 }}
						style={{
							width: "100%",
							height: tw.prefixMatch("lg")
								? 733
								: 320 + (dimensions.width - 36) * 0.65,
							position: "absolute",
						}}
					/>

					<FansView
						height={{ xs: 64, lg: 103 }}
						alignItems="center"
						border={{ b: 1 }}
						borderColor="grey-f0"
						flexDirection="row"
						padding={{ x: 24 }}
					>
						<FansView
							touchableOpacityProps={{ onPress: handlePress }}
							width={40}
							height={40}
							padding={{ x: 4, y: 12 }}
						>
							<FansSvg
								width={8}
								height={16}
								svg={ChevronLeft1Svg}
								color1="white"
							/>
						</FansView>
						<FansGap viewStyle={{ flex: "1" }} />
						<FansText
							fontFamily="inter-bold"
							fontSize={19}
							color="white"
						>
							{title}
						</FansText>
						<FansGap viewStyle={{ flex: "1" }} />
						<FansGap width={40} />
					</FansView>
				</FansView>
			);
		},
	});

	const [openLink] = useBlankLink();
	const { dispatch, state } = useAppContext();
	const { userInfo } = state.user;

	const [newLinkCode, setNewLinkCode] = useState("");
	const [refreshKey, setRefreshKey] = useState(0);

	useEffect(() => {
		setCopiedIndex(-1);
		setSelectedReferral(undefined);
		getLinks();
	}, [newLinkCode, refreshKey]);

	const getLinks = async () => {
		const resp = await getReferralLinks();
		if (resp.ok) {
			setLinks(resp.data.creatorReferrals);
		}
	};
	const [links, setLinks] = useState<Array<CreatorReferral>>([]);

	const handlePressAnalytics = () => router.push("/refer-analytics");

	const dimensions = Dimensions.get("window");
	const [isLinkCreatedModalOpened, setLinkCreatedModalOpened] =
		useState(false);

	const handleCreateNewLink = () => {
		dispatch.setCommon({
			type: CommonActionType.toggleCreateNewReferralLinkModal,
			data: true,
		});
	};

	const handlePressPayout = () => router.push("/refer-payout");

	const [selectedReferral, setSelectedReferral] = useState<CreatorReferral>();

	const handleOpenLinkCreatedModal = (value?: string | undefined) => {
		setNewLinkCode(value ?? "");
		setLinkCreatedModalOpened(true);
	};
	const handleCloseLinkCreatedModal = () => {
		setLinkCreatedModalOpened(false);
	};

	const [copiedIndex, setCopiedIndex] = useState(-1);

	const getLinkCode = (index: number) => {
		return `https://fyp.fans/?r=${links[index].code ?? ""}`;
	};
	const handlePressCopy = (index: number) => {
		setStringAsync(getLinkCode(index));
		ToastMessage.show({
			type: "success",
			text1: "Copied",
		});
		setCopiedIndex(index);
	};

	const handleEditLink = (index: number) => {
		setSelectedReferral(links[index]);
		dispatch.setCommon({
			type: CommonActionType.toggleEditReferralLinkModal,
			data: true,
		});
	};
	const handleViewAnalytics = (index: number) => {
		setSelectedReferral(links[index]);
		dispatch.setCommon({
			type: CommonActionType.toggleViewAnalyticsModal,
			data: true,
		});
	};

	const [becomeCreatorModalVisible, setBecomeCreatorModalVisible] =
		useState(false);

	useEffect(() => {
		setBecomeCreatorModalVisible(userInfo.type !== UserRoleTypes.Creator);
	}, [userInfo.type]);

	const onCloseBecomeCreatorModal = () => {
		setBecomeCreatorModalVisible(false);
		router.push("/profile");
	};

	return (
		<FansScreen3 contentStyle={tw.style("p-[0px]")}>
			<FansView
				width="full"
				height={{
					xs: 320 + (dimensions.width - 36) * 0.65,
					lg: 733,
				}}
				position="absolute"
			>
				<LinearGradientView
					colors={["#5F17D3", "#A854F5"]}
					start={{ x: 0.3, y: 0.9 }}
					end={{ x: 1.3, y: -0.1 }}
					style={{ flex: 1 }}
				/>
			</FansView>
			<FansView
				style={tw.style("max-w-[707px] lg:max-w-full")}
				alignSelf="center"
				padding={{ x: 17 }}
			>
				<FansGap height={37} />
				<FansView alignItems="center">
					<FansView style={tw.style("max-w-[306px] lg:max-w-full")}>
						<FansText
							color="white"
							fontFamily="inter-bold"
							fontSize={{ xs: 23, lg: 27 }}
							textAlign="center"
						>
							Refer creators to FYP.Fans, make money
						</FansText>
					</FansView>
					<FansGap height={{ xs: 18.3, lg: 17.8 }} />
					<FansView style={tw.style("max-w-[319px]")}>
						<FansText
							color="white"
							fontSize={16}
							textAlign="center"
						>
							Earn LIFETIME 10% on creators income when they sign
							up with your link
						</FansText>
					</FansView>
					<FansGap height={27} />
					<FansView>
						<YoutubePlayer
							width={
								tw.prefixMatch("lg")
									? 670
									: dimensions.width - 36
							}
							height={
								tw.prefixMatch("lg")
									? 436
									: (dimensions.width - 36) * 0.65
							}
							videoId={"mcYrfIMIeqk"}
						/>
					</FansView>
				</FansView>

				<FansGap height={27} />

				{/* Your referral link ~ */}
				<FansView
					style={tw.style(
						"shadow-black/16 shadow-offset-[0px]/[1px] shadow-radius-[3px]",
						"bg-fans-white dark:bg-fans-black-1d",
					)}
					alignItems="center"
					borderRadius={15}
					padding={{ x: 18 }}
				>
					<FansGap height={25} />
					<FansText
						color="purple-5f"
						fontFamily="inter-semibold"
						fontSize={23}
					>
						Your referral links
					</FansText>
					<FansGap height={15} />
					<FansView style={tw.style("max-w-[255px] lg:max-w-none")}>
						<FansText fontSize={16} textAlign="center">
							Starting referring creators today, and see your
							networth soar
						</FansText>
					</FansView>
					<FansGap height={20} />

					{links.map((item, index) => {
						return (
							<>
								<FansView
									height={42}
									alignItems="center"
									alignSelf="stretch"
									borderRadius="full"
									flexDirection="row"
									padding={4}
									style={tw.style(
										"border border-fans-grey-f0 dark:border-fans-grey-43",
									)}
								>
									<FansGap width={12} />
									<FansText
										fontFamily="inter-semibold"
										fontSize={16}
									>
										{getLinkCode(index)}
									</FansText>
									<FansView
										width={34}
										height={34}
										touchableOpacityProps={
											copiedIndex === index
												? undefined
												: {
														onPress: () => {
															handlePressCopy(
																index,
															);
														},
												  }
										}
										alignItems="center"
										justifyContent="center"
									>
										{copiedIndex === index ? (
											<FansSvg
												width={14.71}
												height={18.73}
												svg={Check1Svg}
												color1="purple-5f"
											/>
										) : (
											<FansSvg
												width={14.71}
												height={18.73}
												svg={Copy1Svg}
												color1="purple-5f"
											/>
										)}
									</FansView>
									<FansGap grow />
									<FansView
										style={tw.style(
											"w-[34px] h-[34px] rounded-full bg-fans-grey-f0 p-2 items-center justify-center",
											"dark:bg-fans-grey-43",
										)}
										touchableOpacityProps={{
											onPress: () => {
												handleEditLink(index);
											},
										}}
									>
										<FypSvg
											svg={EditSvg}
											width={18}
											height={18}
											color="fans-black dark:fans-white"
										/>
									</FansView>
									<FansGap width={7.2} />
									<FansView
										style={tw.style(
											"w-[34px] h-[34px] rounded-full bg-fans-grey-f0 p-2 items-center justify-center",
											"dark:bg-fans-grey-43",
										)}
										touchableOpacityProps={{
											onPress: () => {
												handleViewAnalytics(index);
											},
										}}
									>
										<FypSvg
											svg={ReferCreatorsAnalytics}
											width={18}
											height={18}
											color="fans-black dark:fans-white"
										/>
									</FansView>
								</FansView>
								<FansGap height={10} />
							</>
						);
					})}
					<FansButton3
						style={{ width: "100%" }}
						title="+ Create new link"
						onPress={handleCreateNewLink}
					/>
					<FansGap height={22.9} />
				</FansView>
				{/* ~ Your referral link */}

				<FansGap height={{ xs: 39.9, lg: 37 }} />

				<FansView
					style={tw.style(
						"shadow-black/16 shadow-offset-[0px]/[1px] shadow-radius-[3px]",
						"bg-fans-white dark:bg-fans-black-1d",
					)}
					borderRadius={15}
				>
					{!tw.prefixMatch("lg") ? (
						<FansView
							style={tw.style(
								"ml-[17px] mr-[18px] mt-[20px] mb-[16.6px]",
							)}
						>
							<FansView flexDirection="row">
								<PhonewithCashSvg width={70.6} height={65.3} />
								<FansGap width={17.9} />
								<FansView
									style={{
										marginTop: "auto",
										marginBottom: "auto",
									}}
								>
									<FansText
										fontFamily="inter-semibold"
										fontSize={23}
									>
										Your balance
									</FansText>
									<FansText
										fontFamily="inter-semibold"
										fontSize={23}
									>
										${userInfo.payoutBalance}
									</FansText>
								</FansView>
							</FansView>
							<FansGap height={22} />
							<RoundButton
								variant={RoundButtonType.SECONDARY}
								customStyles="md:hidden"
								onPress={handlePressPayout}
							>
								<FansView
									style={tw.style(
										"flex flex-row items-center gap-[10px]",
									)}
								>
									<FansText
										fontSize={19}
										style={tw.style("font-inter-bold")}
									>
										Payout
									</FansText>
								</FansView>
							</RoundButton>
							<FansGap height={9.5} />
							<RoundButton
								variant={RoundButtonType.OUTLINE_SECONDARY}
								customStyles="md:hidden"
								onPress={handlePressAnalytics}
							>
								<FansView
									style={tw.style(
										"flex flex-row items-center gap-[10px]",
									)}
								>
									<AnalyticsSvg
										width={16}
										color={Colors.Green}
									/>
									<FansText
										fontSize={19}
										style={tw.style("font-inter-bold")}
									>
										Advanced analytics
									</FansText>
								</FansView>
							</RoundButton>
						</FansView>
					) : (
						<FansView
							style={tw.style(
								"ml-[16.6px] mr-[16.6px] mt-[34.4px] mb-[24px]",
							)}
						>
							<FansText
								fontFamily="inter-regular"
								fontSize={23}
								color="grey-70"
								textAlign="center"
							>
								Your balance
							</FansText>
							<FansText
								fontFamily="inter-semibold"
								fontSize={45}
								textAlign="center"
							>
								${userInfo.payoutBalance}
							</FansText>
							<FansGap height={23} />
							<FansView flexDirection="row">
								<RoundButton
									variant={RoundButtonType.SECONDARY}
									onPress={handlePressPayout}
									customStyles="flex-1"
								>
									<FansView
										style={tw.style(
											"flex flex-row items-center gap-[10px]",
										)}
									>
										<FansText
											fontSize={19}
											style={tw.style("font-inter-bold")}
										>
											Payout
										</FansText>
									</FansView>
								</RoundButton>
								<FansGap width={13.9} />
								<RoundButton
									variant={RoundButtonType.OUTLINE_SECONDARY}
									onPress={handlePressAnalytics}
									customStyles="flex-1"
								>
									<FansView
										style={tw.style(
											"flex flex-row items-center gap-[10px]",
										)}
									>
										<AnalyticsSvg
											width={16}
											color={Colors.Green}
										/>
										<FansText
											fontSize={19}
											style={tw.style("font-inter-bold")}
										>
											Advanced analytics
										</FansText>
									</FansView>
								</RoundButton>
							</FansView>
						</FansView>
					)}
				</FansView>

				<FansGap height={{ xs: 39.9, lg: 37 }} />

				{/* Our top referrers are making a phenomenal ~ */}
				<FansView
					style={tw.style(
						"rounded-[15px] border-[2px] border-fans-grey dark:border-fans-grey-43",
					)}
					alignItems="center"
					overflow="hidden"
				>
					<FansImage2
						width={{ xs: dimensions.width - 36, lg: 670 }}
						height={{ xs: 111.7, lg: 165.8 }}
						source={require("@assets/images/background/refer-banner.jpg")}
					/>
					<FansGap height={{ xs: 22.1, lg: 31 }} />
					<FansText
						fontFamily="inter-semibold"
						fontSize={19}
						style={tw.style("text-center mx-[50px]")}
					>
						Our top referrers are making a phenomenal
					</FansText>
					<FansText
						color="green-4d"
						fontFamily="inter-semibold"
						fontSize={21}
					>
						$25,000 monthly
					</FansText>
					<FansGap height={{ xs: 13, lg: 12 }} />
					<FansView
						style={tw.style("max-w-[320px] lg:max-w-[560px]")}
					>
						<FansText
							fontSize={16}
							style={tw.style(
								"text-center text-fans-grey-70 dark:text-fans-grey-b1",
							)}
						>
							This isn’t luck; it’s the power of our Referral
							Program. Start building a passive income stream
							today and set foot on the path to financial freedom.
							Your success story is waiting to be written!
						</FansText>
					</FansView>
					<FansGap height={26} />
				</FansView>
				{/* ~ Our top referrers are making a phenomenal */}

				<FansGap height={{ xs: 40, lg: 53 }} />

				<FansView
					style={tw.style(
						"shadow-black/16 shadow-offset-[0px]/[1px] shadow-radius-[3px]",
						"bg-fans-purple-f6 dark:bg-fans-purple-47",
					)}
					borderRadius={15}
				>
					<FansView
						style={tw.style(
							!tw.prefixMatch("lg")
								? "ml-[17px] mr-[18px] mt-[20px] mb-[16.6px]"
								: "ml-[16.6px] mr-[16.6px] mt-[34.4px] mb-[24px]",
						)}
					>
						{!tw.prefixMatch("lg") ? (
							<FansView flexDirection="row">
								<FansImage2
									width={63.95}
									height={74.4}
									source={require("@assets/images/refer-creators-tip.png")}
								/>
								<FansGap width={17.9} />
								<FansView
									style={{
										marginTop: "auto",
										marginBottom: "auto",
										flexShrink: 1,
									}}
								>
									<FansText
										fontFamily="inter-semibold"
										fontSize={19}
									>
										Marketing tips
									</FansText>
									<FansGap height={10} />
									<FansText
										fontFamily="inter-regular"
										fontSize={16}
									>
										Check our blog with posts about how to
										market creators
									</FansText>
								</FansView>
							</FansView>
						) : (
							<FansView alignItems="center">
								<FansImage2
									width={58.75}
									height={68.35}
									source={require("@assets/images/refer-creators-tip.png")}
								/>
								<FansGap height={11.2} />
								<FansText
									fontFamily="inter-semibold"
									fontSize={19}
								>
									Marketing tips
								</FansText>
								<FansGap height={10} />
								<FansText
									fontFamily="inter-regular"
									fontSize={16}
								>
									Check our blogs about how to find creators.
								</FansText>
							</FansView>
						)}

						<FansGap height={19} />

						<FansButton3
							style={{ width: "100%" }}
							title="Learn more"
							onPress={() => {
								openLink(
									"https://www.blog.fyp.fans/tag/creator-referral/",
								);
							}}
						/>
					</FansView>
				</FansView>

				<FansGap height={{ xs: 47.3, lg: 68.9 }} />

				{tw.prefixMatch("md") ? (
					<FansView flexDirection="row">
						{/* Lifetime passive income ~ */}
						<FansView alignItems="center">
							<FansView width={132.15} height={112.52}>
								<Svg viewBox="0 0 132.149 112.518">
									<Defs>
										<LinearGradient
											id="linear-gradient-1"
											x1="0.122"
											y1="1.064"
											x2="1.021"
											y2="-0.336"
											gradientUnits="objectBoundingBox"
										>
											<Stop
												offset="0"
												stopColor="#4dcc36"
											/>
											<Stop
												offset="1"
												stopColor="#89f276"
											/>
										</LinearGradient>
									</Defs>
									<Path
										d="M1500.782,231.638h0a29.211,29.211,0,0,0-32.339,3.136,1.093,1.093,0,0,1-.469.225l-.927.327-.061-.911.418-4.879c.083-.832.179-1.816.25-2.8a2.493,2.493,0,0,0-1.891-2.545.777.777,0,0,0-.154-.013,2.552,2.552,0,0,0-2.06,2.016,5.511,5.511,0,0,0-.113.8l-.837,9.118-.016.161c-.137,1.458-.277,2.971-.375,4.449a2.594,2.594,0,0,0,2.23,2.905,2.628,2.628,0,0,0,.267.02c1.79.182,3.605.34,5.359.5l5.483.488.648.06c.86.077,1.749.158,2.632.229a2.14,2.14,0,0,0,2.28-1.527,2.045,2.045,0,0,0-1.01-2.24,3.545,3.545,0,0,0-1.294-.423c-.806-.115-1.611-.195-2.434-.273l-.31-.029c-.369-.036-.739-.073-1.107-.115-.953-.1-1.906-.218-2.921-.338l-2.888-.338,1.04-.922a25.513,25.513,0,0,1,19.111-6.293,24.69,24.69,0,0,1,21.979,21.383,24.161,24.161,0,0,1-8.68,22.16,21.629,21.629,0,0,1-14.725,5.752c-.183,0-.366,0-.551-.007a27.618,27.618,0,0,1-24.4-14.736,45.132,45.132,0,0,1-4.053-10.806,37.191,37.191,0,0,0-8.495-16.124,28.656,28.656,0,0,0-16.321-9.116l-.039-.334c-.039-.34-.08-.691-.138-1.034a28.739,28.739,0,0,0-8.293-15.694,27.564,27.564,0,0,0-12.222-7.118,18.684,18.684,0,0,0-14.916,1.637,50.516,50.516,0,0,0-9.576,7.274,18.3,18.3,0,0,0-5.276,11.112,25.234,25.234,0,0,0,0,6.248,29.258,29.258,0,0,0,16.349,22.357c.415.193.848.382,1.285.564a29.422,29.422,0,0,0,.733,10.607,28.553,28.553,0,0,0,13.853,18.006,28.891,28.891,0,0,0,22.862,2.3,29.359,29.359,0,0,0,14.225-9.921,2.119,2.119,0,0,0-.221-2.984c-.027-.022-.052-.044-.081-.065a1.975,1.975,0,0,0-2.782.359c-.021.028-.041.054-.052.073-.135.148-.257.3-.375.44l-.247.308a23.922,23.922,0,0,1-21.45,8.894,24.291,24.291,0,0,1-21.94-20.945,28.262,28.262,0,0,1-.209-5.743c.327.068.652.116.966.161l.334.049a20.908,20.908,0,0,0,3.278.292,19.027,19.027,0,0,0,11.647-4.019c1.424-1.081,2.862-2.179,4.272-3.264l.677-.517a18.958,18.958,0,0,0,7.424-13.509l.032-.309c.032-.324.065-.658.08-1a23.957,23.957,0,0,1,12.579,7.068,35.185,35.185,0,0,1,8.265,15.086l.318,1.082a68.506,68.506,0,0,0,2.272,6.834A31.529,31.529,0,0,0,1475.34,283a29.216,29.216,0,0,0,16.724,2.163,28.686,28.686,0,0,0,23.479-27.753C1515.649,246.124,1510.683,237.451,1500.782,231.638Zm-95.334,15.249-.006.007,0-.009a24.965,24.965,0,0,1-12.669-19.758,16.2,16.2,0,0,1,2.507-10.894,14.335,14.335,0,0,1,11.854-6.582c.166-.007.383-.019.606-.019a3.05,3.05,0,0,1,.344.013c.421.026.831.064,1.306.106l.719.067a23.738,23.738,0,0,1,14.746,8.744,24.671,24.671,0,0,1,5.549,12.772,17.483,17.483,0,0,1-1.213,9.769,14.519,14.519,0,0,1-13.365,8.752c-.131,0-.264,0-.4,0A19.367,19.367,0,0,1,1405.448,246.887Zm-15.834-15.98.006.02a28.863,28.863,0,0,0,16.186,20.279,22.867,22.867,0,0,0,8.54,2.3,13.151,13.151,0,0,1-2.042.431,18.7,18.7,0,0,1-11.391-2.124,25.689,25.689,0,0,1-13.751-20.1,17.478,17.478,0,0,1,2.352-10.947A22.74,22.74,0,0,0,1389.613,230.907Z"
										transform="translate(-1383.395 -175.701)"
										fill="url(#linear-gradient-1)"
									/>
									<Path
										d="M1455.367,198.071l.2-.02.339.057h.015l.767.166h.011c.094.022.189.048.285.073l.254.073c.27.081.485.155.677.231l.168.065.237.109.036.006.209.1.023.009a2.953,2.953,0,0,1,.365.228l.169.135a2.079,2.079,0,0,1,.3.3l.119.155.192.3.347.75.215.636c.013.045.026.087.039.135l.163.636.193,1.143v.02h.144v-.006l.016-.1c.016-.1.034-.209.054-.331l.018-.087c.023-.121.048-.248.075-.375l.054-.282v-.02l.029-.125.025-.113.006-.028c.026-.108.057-.215.087-.322l.048-.164c.026-.094.058-.187.09-.282l.156-.411.166-.366c.022-.049.048-.1.076-.151l.16-.277.2-.272a1.88,1.88,0,0,1,.3-.3l.09-.074.305-.212.364-.2.269-.113c.152-.068.323-.129.458-.177l.533-.166c.071-.022.144-.041.195-.055l.546-.122.859-.137h.121l.01-.144c-.17-.022-.349-.055-.53-.087h-.012l-.77-.163h-.009c-.133-.035-.266-.068-.4-.106l-.151-.039c-.272-.081-.488-.154-.683-.231l-.169-.067-.475-.212-.021-.007a3.178,3.178,0,0,1-.366-.234l-.166-.132a1.994,1.994,0,0,1-.3-.3l-.048-.055-.264-.389-.3-.642-.3-.879-.132-.506c-.012-.049-.025-.1-.033-.147l-.2-1.149h-.145l0,.02-.072.418,0,.02c-.028.15-.058.3-.09.475l-.055.247,0,.016,0,.029-.057.237-.007.028c-.028.107-.058.216-.091.322l-.047.169c-.028.092-.058.183-.092.276l-.047.134-.3.7c-.016.032-.031.065-.05.1l-.162.282-.2.269a2,2,0,0,1-.3.3l-.09.073-.305.211-.629.317c-.134.055-.283.112-.462.176l-.725.219-.816.167-.5.077-.107-.017-.113-.017-.049.1.059.029Z"
										transform="translate(-1350.854 -181.702)"
										fill="url(#linear-gradient-1)"
									/>
									<Path
										d="M1445.043,206.541l.06,0c.272.039.581.092.947.161l.292.054,1.228.275c.232.057.476.122.748.2l.275.073.017,0c.489.151.906.292,1.274.431l.77.324.282.141c.055.026.109.055.163.083l.038.025a6.827,6.827,0,0,1,.709.442l.336.264a3.832,3.832,0,0,1,.572.574c.035.039.07.084.115.141l.113.148.035.051c.035.044.062.087.093.129l.242.4.36.715c.022.049.043.1.065.145s.045.1.067.142l.309.787c.02.055.039.109.058.164s.033.1.049.144l.115.362c.044.135.084.275.122.4l.222.847c.032.129.061.254.089.362l.049.27.209,1.118.029.164.042.282v.058c.016.089.031.177.041.263l.146-.013.025-.195v-.01c.029-.195.063-.4.1-.606l0-.023,0-.015c.051-.27.106-.575.174-.87v-.033l.049-.24c.019-.08.036-.16.054-.238l.015-.049,0-.025c.034-.137.07-.275.106-.414l.023-.087c.051-.2.109-.407.167-.607l.014-.038c.019-.073.041-.144.064-.216l.022-.065c.055-.179.109-.353.17-.521l.222-.6.075-.192.055-.134.266-.575c.046-.093.091-.183.142-.266l.071-.147.313-.492.321-.417a3.8,3.8,0,0,1,.574-.571c.031-.029.062-.054.1-.08l.426-.321.33-.2c.032-.019.061-.038.1-.055l.327-.173c.052-.029.1-.055.161-.081l.5-.225c.285-.122.578-.234.872-.334l.314-.1.693-.216c.132-.038.266-.073.4-.107l.553-.137.127-.035h.036c.1-.022.2-.044.3-.07l.491-.094c.089-.02.183-.041.26-.054l.259-.042.237-.042.614-.1v-.145h-.026c-.346-.052-.665-.106-.973-.163l-.295-.058-1.264-.282-.732-.189c-.058-.015-.116-.033-.176-.051l-.078-.023-.019,0c-.428-.129-.857-.275-1.272-.43l-.327-.135-.909-.434a6.53,6.53,0,0,1-.709-.443l-.337-.266a3.774,3.774,0,0,1-.569-.569l-.232-.3-.277-.426c-.03-.048-.061-.1-.091-.157l-.49-.992-.09-.215-.218-.582c-.039-.1-.077-.2-.109-.308l-.116-.359-.074-.245-.106-.363-.189-.738c-.023-.094-.045-.186-.064-.264l-.113-.567-.269-1.593h-.144l-.022.208v.013c-.031.195-.062.4-.1.606l0,.025,0,.015c-.06.334-.115.617-.173.867v.035l-.028.144-.038.17c-.013.058-.027.116-.039.18l-.016.07c-.033.144-.065.275-.1.413l-.026.087c-.042.16-.086.322-.13.484l-.134.443c-.048.161-.1.333-.171.524l-.089.247-.317.795-.2.433c-.049.1-.1.2-.15.286l-.08.145-.311.5-.324.417a3.848,3.848,0,0,1-.569.571c-.054.045-.106.089-.161.132l-.229.17c-.026.022-.052.039-.08.058l-.058.041-.036.023c-.051.035-.1.068-.158.1l-.5.282c-.071.036-.142.074-.222.109l-.074.035c-.05.023-.1.048-.154.07l-.273.121c-.27.115-.561.225-.864.331l-1.415.43-1.473.334-1.163.2-.187.025h-.006l-.019,0-.033.01Z"
										transform="translate(-1355.496 -180.062)"
										fill="url(#linear-gradient-1)"
									/>
									<Path
										d="M1418.9,223.378a10.1,10.1,0,0,0,6.651,3.82,16.814,16.814,0,0,0,2.445.179,18.611,18.611,0,0,0,4.626-.6,29.592,29.592,0,0,0,13.719-7.992,22.61,22.61,0,0,0,6.609-11.092,10.454,10.454,0,0,0-1.88-9.379c-.7-.874-1.367-1.75-2.1-2.724-.4-.527-.831-1.1-1.332-1.745a9.4,9.4,0,0,0-4.9-3.255,14.542,14.542,0,0,0-7.511-.2,29.573,29.573,0,0,0-18.781,13.15,17.076,17.076,0,0,0-2.824,6.74c-.488,3.643,0,6.139,1.643,8.345C1416.679,220.528,1417.835,222.037,1418.9,223.378Zm5.54-.787a21.611,21.611,0,0,0,9.2-2.259,29.225,29.225,0,0,0,13.525-12.2,20.268,20.268,0,0,0,2.157-5.3,5.923,5.923,0,0,1,.24,2.079,13.66,13.66,0,0,1-2.468,7.062,26.127,26.127,0,0,1-15.121,11.119,14.3,14.3,0,0,1-5.029.52,7.655,7.655,0,0,1-3.512-1.05C1423.776,222.582,1424.119,222.605,1424.443,222.591Zm21.489-22-.006.036,0,0a13.279,13.279,0,0,1-1.544,4.918,25.378,25.378,0,0,1-11.6,11.1,19.319,19.319,0,0,1-7.505,2.179c-.308.017-.651.026-1.079.026-.221,0-.434,0-.648,0s-.42,0-.628,0h-.135a8.647,8.647,0,0,1-2.828-.933,5.36,5.36,0,0,1-2.849-4.66,10.383,10.383,0,0,1,.941-4.884,26.024,26.024,0,0,1,17.835-14.318,12.137,12.137,0,0,1,5.563.015A5.789,5.789,0,0,1,1445.932,200.593Z"
										transform="translate(-1369.798 -182.898)"
										fill="url(#linear-gradient-1)"
									/>
									<Path
										d="M1398.069,210.759a15.133,15.133,0,0,0,8,3.316,7.484,7.484,0,0,0,.752.039h.026a7.825,7.825,0,0,0,7.272-4.885,13.288,13.288,0,0,0,.474-1.595c.046-.187.089-.362.134-.523l.015-.084c.017-.259.039-.5.058-.723a10.154,10.154,0,0,0,.054-1.229v-.132a12.731,12.731,0,0,0-.243-2.33,23.147,23.147,0,0,0-12.478-16.2,11.749,11.749,0,0,0-5.349-1.307h-.292a7.709,7.709,0,0,0-7.388,6,13.276,13.276,0,0,0,.039,6.021A23.409,23.409,0,0,0,1398.069,210.759Zm12.973-4.169-.013.067a4.11,4.11,0,0,1-4.426,3.762c-.121-.009-.245-.025-.4-.051a9.953,9.953,0,0,1-4.246-1.487,19.337,19.337,0,0,1-9.362-13.313,11.825,11.825,0,0,1-.145-1.845c0-.174-.007-.35-.016-.526l0-.065.15-.674a7.4,7.4,0,0,1,.237-.934,4.186,4.186,0,0,1,4.532-2.732,10.488,10.488,0,0,1,4.329,1.535,19.441,19.441,0,0,1,9.328,13.172A8.61,8.61,0,0,1,1411.042,206.59Z"
										transform="translate(-1380.96 -185.108)"
										fill="url(#linear-gradient-1)"
									/>
								</Svg>
							</FansView>
							<FansGap height={29.9} />
							<FansText fontFamily="inter-semibold" fontSize={17}>
								Lifetime passive income
							</FansText>
							<FansGap height={11} />
							<FansView style={tw.style("max-w-[320px]")}>
								<FansText
									fontSize={16}
									textAlign="center"
									style={tw.style(
										"text-fans-grey-70 dark:text-fans-grey-b1",
									)}
								>
									Create a lifelong passive income stream with
									a 10% share from this referral
								</FansText>
							</FansView>
						</FansView>
						{/* ~ Lifetime passive income */}

						<FansGap width={56.2} />

						{/* Instant payouts ~ */}
						<FansView alignItems="center">
							<FansView height={112.52} justifyContent="center">
								<FansView width={156.91} height={91.26}>
									<Svg viewBox="0 0 156.911 91.258">
										<Defs>
											<LinearGradient
												id="linear-gradient-2"
												x1="0.041"
												y1="1.176"
												x2="0.936"
												y2="-0.205"
												gradientUnits="objectBoundingBox"
											>
												<Stop
													offset="0"
													stopColor="#4dcc36"
												/>
												<Stop
													offset="1"
													stopColor="#89f276"
												/>
											</LinearGradient>
										</Defs>
										<Path
											d="M1577.361,255.259c-.452.164-.879.4-1.317.612A41.368,41.368,0,1,1,1565.434,178c13.958,2.721,23.979,10.714,30.151,23.532.212.436.372.9.622,1.315a2.106,2.106,0,0,0,3.807-1.743,8.523,8.523,0,0,0-.41-1.017,45.619,45.619,0,0,0-87.068,14.2,43.122,43.122,0,0,0,4.846,25.231c7.861,14.582,20.1,22.882,36.625,24.585a43.841,43.841,0,0,0,24.654-4.782,3.787,3.787,0,0,0,.726-.436,2.057,2.057,0,0,0,.491-2.724A2.032,2.032,0,0,0,1577.361,255.259Z"
											transform="translate(-1478.31 -173.055)"
											fill="url(#linear-gradient-2)"
										/>
										<Path
											d="M1586.423,197.625a27.78,27.78,0,1,0,27.8,27.762v-.017A27.836,27.836,0,0,0,1586.423,197.625Zm.042,51.325a23.514,23.514,0,1,1,.036,0Z"
											transform="translate(-1457.312 -161.935)"
											fill="url(#linear-gradient-2)"
										/>
										<Path
											d="M1506.447,225.654a8.264,8.264,0,0,0-.967-.026h-9.442c-.726,0-1.453-.009-2.179.007a1.994,1.994,0,0,0-1.84,1.162,2.089,2.089,0,0,0,1.948,3.039c2.013.048,4.032.01,6.048.013h3.387c1.007,0,2.019.042,3.024-.032a2.095,2.095,0,0,0,.016-4.163Z"
											transform="translate(-1487.576 -149.264)"
											fill="url(#linear-gradient-2)"
										/>
										<Path
											d="M1509.795,209.8c-.282-.026-.567-.01-.847-.01h-9.681a7.174,7.174,0,0,0-1.089.035,2.1,2.1,0,0,0-.074,4.115,5.887,5.887,0,0,0,1.084.061h8.837c.6,0,1.214.026,1.814-.029a2.093,2.093,0,0,0-.042-4.173Z"
											transform="translate(-1485.471 -156.434)"
											fill="url(#linear-gradient-2)"
										/>
										<Path
											d="M1502.321,199.263a2.095,2.095,0,0,0-.359-4.16c-1.817-.038-3.631-.007-5.452-.01s-3.631-.022-5.451.007a2.032,2.032,0,0,0-2.166,1.891c0,.067-.006.134,0,.2a2.061,2.061,0,0,0,2.013,2.108c.052,0,.1,0,.157,0,.282.016.566,0,.847,0h9.205A8.409,8.409,0,0,0,1502.321,199.263Z"
											transform="translate(-1488.889 -163.086)"
											fill="url(#linear-gradient-2)"
										/>
										<Path
											d="M1506.762,184.582c2.657.054,5.319.032,7.977,0a1.858,1.858,0,0,0,1.682-1.2,2.067,2.067,0,0,0-1.81-2.962c-1.285-.071-2.577-.016-3.868-.016h0c-1.291,0-2.583-.039-3.868.01a2.062,2.062,0,0,0-2.057,2.068v.03a2,2,0,0,0,1.935,2.07Z"
											transform="translate(-1481.68 -169.739)"
											fill="url(#linear-gradient-2)"
										/>
										<Path
											d="M1507.879,195.1c-.478-.042-.967-.007-1.452-.007h0c-.484,0-.971-.035-1.453.009a2.034,2.034,0,0,0-1.91,2.106,1.983,1.983,0,0,0,1.828,2.048,20.957,20.957,0,0,0,3.02,0,2.044,2.044,0,0,0,1.948-2.083A2.139,2.139,0,0,0,1507.879,195.1Z"
											transform="translate(-1482.474 -163.087)"
											fill="url(#linear-gradient-2)"
										/>
										<Path
											d="M1512.619,225.655a6.562,6.562,0,0,0-1.453.016,2.068,2.068,0,0,0-1.785,1.993,2.14,2.14,0,0,0,1.641,2.128,6.875,6.875,0,0,0,.962.077v-.032a6.021,6.021,0,0,0,.606,0,2.127,2.127,0,0,0,1.968-2.086A2.085,2.085,0,0,0,1512.619,225.655Z"
											transform="translate(-1479.615 -149.265)"
											fill="url(#linear-gradient-2)"
										/>
										<Path
											d="M1594.785,220.482c-1.618-.042-3.236-.013-4.854-.013h-3.862a6.953,6.953,0,0,0-4.078-4.086V215q0-4.188-.007-8.374a4.35,4.35,0,0,0-.16-1.307,2.1,2.1,0,0,0-3.457-.824,2.311,2.311,0,0,0-.656,1.763c.013,2.346,0,4.692,0,7.038v2.973c-3.531,2.138-4.823,4.358-4.33,7.338a6.448,6.448,0,0,0,5.01,5.324c3.655.667,6.16-.943,7.718-4.24h4.4c1.413,0,2.832.023,4.246-.016a2.033,2.033,0,0,0,2.093-1.666,2.062,2.062,0,0,0-1.538-2.477A2.122,2.122,0,0,0,1594.785,220.482Zm-14.905,4.368a2.309,2.309,0,1,1,.055,0l-.055,0Z"
											transform="translate(-1450.697 -159.097)"
											fill="url(#linear-gradient-2)"
										/>
										<Path
											d="M1554.937,227.917a10.092,10.092,0,0,0,2.343-4.189,9.2,9.2,0,0,0,.42-2.359,12.335,12.335,0,0,0-.167-2.481,10.278,10.278,0,0,0-1.1-3.1,10.478,10.478,0,0,0-3.826-3.993,10.2,10.2,0,0,0-2.943-1.214,11.526,11.526,0,0,0-2.593-.29,5.261,5.261,0,0,1-4.025-1.888,5.4,5.4,0,0,1-1.177-5.343,5.494,5.494,0,0,1,2.631-3.254,5.87,5.87,0,0,1,5.8.112,11.47,11.47,0,0,1,2.189,1.564l.334.29a2.2,2.2,0,0,0,2.013.51,2.315,2.315,0,0,0,1.91-1.888,2.188,2.188,0,0,0-.568-2.141,13.635,13.635,0,0,0-4.957-3.324,2.115,2.115,0,0,1-1.563-2.282v-1.281c0-.967,0-1.933.009-2.905a2.142,2.142,0,0,0-.237-.917,2.48,2.48,0,0,0-2.991-1.291,2.565,2.565,0,0,0-1.671,2.211c.01.927.007,1.862,0,2.8v1.317a2.417,2.417,0,0,1-.1.94,2.194,2.194,0,0,1-1.2,1.331,10.842,10.842,0,0,0-2.288,1.22,10.336,10.336,0,0,0-3.563,4.307,11.647,11.647,0,0,0-.782,2.577,9.534,9.534,0,0,0-.055,3.114,10.43,10.43,0,0,0,1.052,3.366,10.608,10.608,0,0,0,2.814,3.451,9.893,9.893,0,0,0,3.737,1.9,10.391,10.391,0,0,0,2.433.4,7.109,7.109,0,0,1,2.045.291,5.583,5.583,0,0,1-1.524,10.922,5.782,5.782,0,0,1-.9-.041h-.007a7.923,7.923,0,0,1-3-1.162,14.824,14.824,0,0,1-2.76-2.478,2.421,2.421,0,0,0-2.853-.535,2.461,2.461,0,0,0-1.13,3.292,2.515,2.515,0,0,0,.389.574,16.568,16.568,0,0,0,3.858,3.371c.658.381,1.388.75,2.365,1.2a2.1,2.1,0,0,1,1.453,2.186v.6h0v.667l-.007,1.621c-.009.535-.016.988.02,1.432a2.521,2.521,0,0,0,.218.847,2.388,2.388,0,0,0,1.512,1.3,2.092,2.092,0,0,0,1.7-.116,2.388,2.388,0,0,0,1.442-2.369v-3.983a2.226,2.226,0,0,1,1.474-2.234A10.161,10.161,0,0,0,1554.937,227.917Z"
											transform="translate(-1467.364 -167.135)"
											fill="url(#linear-gradient-2)"
										/>
									</Svg>
								</FansView>
							</FansView>
							<FansGap height={29.9} />
							<FansText fontFamily="inter-semibold" fontSize={17}>
								Instant payouts
							</FansText>
							<FansGap height={11} />
							<FansView style={tw.style("max-w-[276px]")}>
								<FansText
									style={tw.style(
										"text-fans-grey-70 dark:text-fans-grey-b1",
									)}
									fontSize={16}
									textAlign="center"
								>
									Get paid instantly through your{" "}
									<FansText
										color="green-4d"
										textDecorationLine="underline"
										onPress={() => {
											openLink("refer-payout");
										}}
									>
										Payout Dashboard
									</FansText>
									. Your earnings, in your pocket, right away
								</FansText>
							</FansView>
						</FansView>
						{/* ~ Instant payouts */}
					</FansView>
				) : (
					<FansView>
						{/* Lifetime passive income ~ */}
						<FansView alignItems="center">
							<FansView width={90.97} height={77.46}>
								<Svg viewBox="0 0 91.977 78.463">
									<Defs>
										<LinearGradient
											id="linear-gradient-3"
											x1="0.122"
											y1="1.064"
											x2="0.858"
											gradientUnits="objectBoundingBox"
										>
											<Stop
												offset="0"
												stopColor="#4dcc36"
											/>
											<Stop
												offset="0.282"
												stopColor="#4ecd37"
											/>
											<Stop
												offset="1"
												stopColor="#89f276"
											/>
										</LinearGradient>
									</Defs>
									<Path
										d="M12256.314,22570.037a19.646,19.646,0,0,1-9.534-12.395,20.2,20.2,0,0,1-.5-7.3c-.306-.125-.6-.254-.889-.391a20.125,20.125,0,0,1-11.251-15.391,17.04,17.04,0,0,1,0-4.3,12.592,12.592,0,0,1,3.631-7.648,34.655,34.655,0,0,1,6.589-5.008,12.863,12.863,0,0,1,10.271-1.127,18.924,18.924,0,0,1,8.412,4.9,19.762,19.762,0,0,1,5.711,10.8c.039.238.067.477.1.715l.028.227a19.737,19.737,0,0,1,11.233,6.277,25.614,25.614,0,0,1,5.847,11.1,31.274,31.274,0,0,0,2.793,7.443,19,19,0,0,0,16.8,10.141c.13,0,.255.01.379.01a14.906,14.906,0,0,0,10.141-3.965,16.62,16.62,0,0,0,5.971-15.256,16.992,16.992,0,0,0-15.125-14.717,17.561,17.561,0,0,0-13.16,4.328l-.714.639,1.988.232c.7.08,1.354.16,2.012.232.249.029.5.051.759.08l.215.018c.567.057,1.116.107,1.677.191a2.408,2.408,0,0,1,.89.289,1.42,1.42,0,0,1,.7,1.541,1.47,1.47,0,0,1-1.575,1.049c-.606-.047-1.218-.1-1.807-.154l-.448-.045-3.778-.334c-1.206-.107-2.453-.215-3.687-.34a1,1,0,0,1-.182-.018,1.779,1.779,0,0,1-1.535-2c.068-1.014.164-2.055.255-3.059l.012-.113.577-6.277a3.489,3.489,0,0,1,.08-.549,1.75,1.75,0,0,1,1.416-1.389.336.336,0,0,1,.107.012,1.718,1.718,0,0,1,1.3,1.752c-.051.674-.119,1.354-.176,1.926l-.288,3.359.045.623.635-.221a.723.723,0,0,0,.322-.16,20.12,20.12,0,0,1,22.264-2.158h.006c6.814,4.006,10.23,9.977,10.157,17.748a19.738,19.738,0,0,1-16.162,19.1,20.086,20.086,0,0,1-11.512-1.49,21.7,21.7,0,0,1-12.156-12.236,46.79,46.79,0,0,1-1.564-4.707l-.221-.742a24.266,24.266,0,0,0-5.687-10.391,16.491,16.491,0,0,0-8.662-4.865c-.011.238-.033.465-.057.691l-.017.209a13.09,13.09,0,0,1-5.115,9.3l-.465.355c-.969.748-1.96,1.5-2.94,2.244a13.1,13.1,0,0,1-8.016,2.77,13.965,13.965,0,0,1-2.26-.2c-.074-.012-.153-.018-.227-.035-.222-.027-.442-.062-.669-.107a19.228,19.228,0,0,0,.147,3.955,16.713,16.713,0,0,0,15.1,14.416,16.47,16.47,0,0,0,14.769-6.123l.17-.209c.079-.1.164-.205.255-.307a.514.514,0,0,0,.04-.051,1.347,1.347,0,0,1,.906-.521,1.4,1.4,0,0,1,1.009.277c.017.018.033.029.051.045a1.456,1.456,0,0,1,.152,2.057,20.208,20.208,0,0,1-9.789,6.826,19.9,19.9,0,0,1-15.742-1.58Zm-19.72-36.375a17.669,17.669,0,0,0,9.466,13.834,12.84,12.84,0,0,0,7.84,1.463,9.259,9.259,0,0,0,1.405-.295,15.707,15.707,0,0,1-5.88-1.586,19.883,19.883,0,0,1-11.144-13.959v-.018a15.689,15.689,0,0,1-.073-6.979A12.01,12.01,0,0,0,12236.595,22533.662Zm19.465,12.486h.271a10,10,0,0,0,9.2-6.021,12.024,12.024,0,0,0,.832-6.73,16.967,16.967,0,0,0-3.817-8.793,16.341,16.341,0,0,0-10.152-6.016l-.492-.045c-.329-.029-.612-.057-.9-.074a1.65,1.65,0,0,0-.237-.012c-.153,0-.307.012-.42.012a9.864,9.864,0,0,0-8.157,4.533,11.131,11.131,0,0,0-1.728,7.5,17.183,17.183,0,0,0,8.724,13.6A13.325,13.325,0,0,0,12256.06,22546.148Zm16.326-20.553a6.924,6.924,0,0,1-4.577-2.629c-.736-.924-1.535-1.965-2.51-3.273-1.128-1.52-1.468-3.234-1.128-5.744a11.78,11.78,0,0,1,1.943-4.641,20.37,20.37,0,0,1,12.928-9.053,10.075,10.075,0,0,1,5.172.137,6.517,6.517,0,0,1,3.377,2.242c.345.449.646.84.917,1.2.5.67.963,1.275,1.445,1.875a7.182,7.182,0,0,1,1.291,6.459,15.53,15.53,0,0,1-4.549,7.637,20.366,20.366,0,0,1-9.443,5.5,12.848,12.848,0,0,1-3.184.414A11.823,11.823,0,0,1,12272.386,22525.6Zm.957-2.465a9.911,9.911,0,0,0,3.462-.361,17.952,17.952,0,0,0,10.412-7.654,9.4,9.4,0,0,0,1.7-4.859,4.22,4.22,0,0,0-.164-1.434,14.13,14.13,0,0,1-1.484,3.648,20.156,20.156,0,0,1-9.313,8.4,14.912,14.912,0,0,1-6.333,1.553c-.227.012-.459-.006-.7-.018A5.3,5.3,0,0,0,12273.343,22523.131Zm6.158-20.354a17.9,17.9,0,0,0-12.276,9.857,7.082,7.082,0,0,0-.651,3.359,3.706,3.706,0,0,0,1.96,3.211,6.078,6.078,0,0,0,1.949.641h.526c.147,0,.295.006.442.006.294,0,.532-.006.747-.018a13.341,13.341,0,0,0,5.167-1.5,17.471,17.471,0,0,0,7.981-7.643,9.046,9.046,0,0,0,1.065-3.383l-.006-.006.006-.021a3.983,3.983,0,0,0-3.082-4.5,8.465,8.465,0,0,0-1.934-.225A8.254,8.254,0,0,0,12279.5,22502.777Zm23.1,17.352v-.039l-.028-.2-.022-.113-.142-.77-.034-.182c-.017-.074-.039-.164-.062-.25l-.152-.582c-.023-.092-.052-.187-.085-.279l-.08-.248c-.011-.029-.022-.068-.033-.1a.668.668,0,0,0-.04-.113l-.21-.545c-.017-.033-.033-.062-.051-.1s-.028-.068-.039-.1l-.25-.494-.17-.277c-.017-.027-.039-.057-.062-.09l-.023-.035-.079-.1c-.034-.039-.057-.068-.079-.1a2.546,2.546,0,0,0-.391-.4l-.232-.182a4.969,4.969,0,0,0-.487-.3l-.028-.021c-.04-.018-.073-.035-.113-.057l-.192-.092-.533-.227c-.249-.1-.538-.191-.872-.295l-.012-.006-.192-.045c-.187-.057-.351-.1-.516-.141l-.844-.187-.2-.039c-.255-.045-.471-.08-.651-.107h-.046v-.1l.023-.006h.017l.13-.016.8-.137,1.021-.232.969-.295c.209-.072.413-.152.595-.227l.192-.084c.039-.018.067-.035.1-.051l.051-.023a1.408,1.408,0,0,0,.153-.074l.346-.191a.7.7,0,0,0,.107-.074l.028-.012c.012-.006.022-.021.04-.027a.337.337,0,0,1,.057-.045l.152-.113c.04-.029.08-.062.113-.092a2.794,2.794,0,0,0,.392-.391l.227-.289.209-.34.057-.1c.034-.062.068-.125.1-.2l.142-.293.215-.551.063-.17c.045-.131.085-.248.119-.361l.091-.307c.034-.107.063-.221.091-.328l.017-.062c.022-.092.045-.182.073-.283l.006-.051a.953.953,0,0,0,.028-.119l.028-.119.018-.1v-.023c.039-.17.079-.363.118-.6v-.027c.028-.143.046-.283.068-.414v-.012l.017-.141h.1l.187,1.094.08.391c.011.057.028.119.039.182l.131.51.073.248.051.17.079.25c.023.068.052.137.08.209l.147.4.062.148.34.68a.427.427,0,0,0,.063.107l.188.295.164.2a2.38,2.38,0,0,0,.391.4l.232.182a4.969,4.969,0,0,0,.487.3l.629.3.221.1c.289.107.583.2.878.293l.012.006.057.012a.873.873,0,0,0,.119.035c.175.045.34.09.5.129l.872.2.2.039c.216.039.437.074.675.107h.017v.1l-.425.068c-.051.006-.107.018-.164.029l-.176.027c-.051.012-.119.023-.182.035l-.334.066c-.068.018-.136.035-.21.047h-.022l-.085.027-.385.092c-.091.027-.182.051-.272.078l-.481.148-.215.072c-.2.068-.4.143-.6.227l-.34.154c-.046.021-.08.039-.113.057l-.227.123a.51.51,0,0,0-.062.035l-.227.141-.295.217a.864.864,0,0,1-.067.057,2.585,2.585,0,0,0-.4.4l-.221.283-.215.34-.046.1c-.033.057-.067.119-.1.182l-.182.4-.039.1c-.018.045-.034.086-.051.131l-.153.408c-.04.113-.079.236-.113.361l-.018.045a1.382,1.382,0,0,0-.045.148l-.012.027c-.039.137-.079.273-.113.414l-.017.063c-.022.1-.051.188-.073.283l0,.018-.011.033a1.671,1.671,0,0,1-.04.164l-.034.164v.023c-.045.2-.085.414-.118.6v.029c-.028.141-.052.277-.068.414v.01l-.017.131-.1.012A1.684,1.684,0,0,0,12302.6,22520.129Zm-50.792-5.064c-.17,0-.34-.006-.521-.023a10.44,10.44,0,0,1-5.506-2.281,16.169,16.169,0,0,1-6.146-9.383,9.148,9.148,0,0,1-.022-4.146,5.3,5.3,0,0,1,5.081-4.135h.2a8.164,8.164,0,0,1,3.683.9,15.938,15.938,0,0,1,8.588,11.154,9.008,9.008,0,0,1,.17,1.6v.09a8.316,8.316,0,0,1-.04.846c-.011.158-.028.322-.039.5l-.012.057c-.028.113-.057.232-.091.361a9.469,9.469,0,0,1-.328,1.1,5.378,5.378,0,0,1-5,3.359Zm-9.642-15.551a5.316,5.316,0,0,0-.164.646l-.1.465v.045c.012.119.012.238.012.357a8,8,0,0,0,.1,1.273,13.3,13.3,0,0,0,6.447,9.166,6.792,6.792,0,0,0,2.923,1.02c.1.018.192.029.271.035a2.832,2.832,0,0,0,2.063-.664,2.79,2.79,0,0,0,.985-1.926l.012-.045a6.091,6.091,0,0,0-.022-2.125,13.382,13.382,0,0,0-6.425-9.068,7.193,7.193,0,0,0-2.979-1.061,2.973,2.973,0,0,0-.414-.029A2.881,2.881,0,0,0,12242.163,22499.514Zm67.453,10.5v-.012l-.131-.787-.113-.441c-.006-.029-.017-.057-.022-.092l-.153-.436-.237-.516-.131-.205-.085-.107a1.22,1.22,0,0,0-.2-.209l-.113-.09a1.729,1.729,0,0,0-.255-.16l-.017,0-.142-.074h-.022l-.165-.074-.118-.045a4.348,4.348,0,0,0-.465-.164l-.176-.045-.192-.053h-.012l-.526-.113h-.012c-.085-.01-.158-.027-.232-.039l-.142.018,0-.057-.04-.018.034-.068.079.012.073.012.346-.051.566-.113.5-.152c.119-.047.227-.086.317-.119l.43-.223.21-.141.063-.051a1.252,1.252,0,0,0,.2-.209l.142-.182.113-.193.034-.068.2-.48.034-.092a1.83,1.83,0,0,0,.063-.191l.034-.113c.022-.074.045-.148.063-.221l0-.018.04-.164-.006-.023.006-.012.034-.17c.022-.113.045-.221.063-.322v-.018l.051-.289v-.01h.1l.142.787a.542.542,0,0,0,.022.1l.091.352.2.605.21.441.182.268.033.039a1.605,1.605,0,0,0,.2.2l.113.092a2.4,2.4,0,0,0,.255.158l.012.006.328.146.113.047c.137.051.283.1.471.158l.107.027c.091.023.182.051.272.074h0l.533.107h0c.125.023.25.045.369.063l-.012.1h-.079l-.595.1-.374.084c-.034.006-.085.023-.136.035l-.363.113c-.1.033-.209.078-.317.123l-.187.08-.249.131-.21.146-.062.051a1.193,1.193,0,0,0-.2.211l-.142.186-.107.188c-.022.039-.039.074-.057.107l-.113.25-.1.283c-.022.068-.046.129-.068.2l-.028.113c-.022.068-.045.143-.062.221l0,.018-.018.08-.017.084v.012l-.04.193c-.017.09-.034.18-.051.26l-.012.063c-.011.084-.022.158-.033.227l-.012.068Z"
										transform="translate(-12233.498 -22494.596)"
										fill="url(#linear-gradient-3)"
										stroke="rgba(0,0,0,0)"
										strokeMiterlimit="10"
										strokeWidth="1"
									/>
								</Svg>
							</FansView>
							<FansGap height={14.9} />
							<FansText fontFamily="inter-semibold" fontSize={17}>
								Lifetime passive income
							</FansText>
							<FansGap height={11} />
							<FansView style={tw.style("max-w-[320px]")}>
								<FansText
									style={tw.style(
										"text-fans-grey-70 dark:text-fans-grey-b1",
									)}
									fontSize={16}
									textAlign="center"
								>
									Create a lifelong passive income stream with
									a 10% share from this referral
								</FansText>
							</FansView>
						</FansView>
						{/* ~ Lifetime passive income */}

						<FansGap height={51.2} />

						{/* Instant payouts ~ */}
						<FansView alignItems="center">
							<FansView width={108.02} height={62.83}>
								<Svg viewBox="0 0 109.023 63.857">
									<Defs>
										<LinearGradient
											id="linear-gradient-4"
											x1="0.354"
											y1="0.798"
											x2="0.849"
											y2="-0.122"
											gradientUnits="objectBoundingBox"
										>
											<Stop
												offset="0"
												stopColor="#4dcc36"
											/>
											<Stop
												offset="1"
												stopColor="#89f276"
											/>
										</LinearGradient>
									</Defs>
									<Path
										d="M12286.112,22355.141c-11.379-1.172-19.8-6.889-25.215-16.928a29.641,29.641,0,0,1-3.333-17.369,31.406,31.406,0,0,1,59.939-9.775,6.855,6.855,0,0,1,.28.7,1.45,1.45,0,0,1-2.62,1.2c-.174-.285-.28-.605-.426-.9-4.253-8.826-11.149-14.33-20.76-16.2a28.365,28.365,0,0,0-30.175,14.375,28.475,28.475,0,0,0,37.479,39.23,9.56,9.56,0,0,1,.909-.422,1.4,1.4,0,0,1,1.733.617,1.417,1.417,0,0,1-.342,1.875,2.377,2.377,0,0,1-.5.3,30.22,30.22,0,0,1-14,3.439C12288.093,22355.287,12287.1,22355.238,12286.112,22355.141Zm17.662-18.969a19.124,19.124,0,0,1,38.248-.039v.01a19.124,19.124,0,0,1-38.248.029Zm2.94-.006a16.2,16.2,0,0,0,16.2,16.2h.027a16.2,16.2,0,1,0-16.226-16.2Zm-51.092,11.732a1.471,1.471,0,0,1-1.133-1.465,1.425,1.425,0,0,1,1.234-1.369,4.262,4.262,0,0,1,1-.012,1.438,1.438,0,0,1,1.336,1.441,1.469,1.469,0,0,1-1.358,1.438c-.14.006-.274.006-.415,0v.021A4.4,4.4,0,0,1,12255.623,22347.9Zm-10.728.039h-2.334c-1.386,0-2.777.027-4.163-.006a1.439,1.439,0,0,1-1.341-2.094,1.374,1.374,0,0,1,1.268-.8c.5-.016,1-.01,1.5-.01h6.5a5.358,5.358,0,0,1,.662.021,1.442,1.442,0,0,1-.011,2.867c-.3.021-.594.027-.892.027C12245.688,22347.947,12245.29,22347.938,12244.9,22347.938Zm43.59-5.812a1.632,1.632,0,0,1-1.038-.893,1.755,1.755,0,0,1-.151-.584c-.022-.309-.017-.617-.012-.988v-1.984a1.435,1.435,0,0,0-1-1.5c-.674-.309-1.173-.562-1.627-.826a11.394,11.394,0,0,1-2.654-2.322,1.671,1.671,0,0,1-.27-.393,1.7,1.7,0,0,1,.78-2.268,1.672,1.672,0,0,1,1.964.371,10.2,10.2,0,0,0,1.9,1.705,5.478,5.478,0,0,0,2.064.8h.006a3.246,3.246,0,0,0,.617.029,3.844,3.844,0,0,0,1.049-7.52,4.994,4.994,0,0,0-1.408-.2,7.48,7.48,0,0,1-4.247-1.582,7.314,7.314,0,0,1-2.665-4.7,6.683,6.683,0,0,1,.039-2.143,8.091,8.091,0,0,1,.539-1.773,7.132,7.132,0,0,1,2.451-2.963,7.584,7.584,0,0,1,1.577-.842,1.525,1.525,0,0,0,.824-.914,1.835,1.835,0,0,0,.067-.65v-.908c.006-.646.006-1.285,0-1.926a1.75,1.75,0,0,1,1.15-1.52,1.7,1.7,0,0,1,2.06.887,1.455,1.455,0,0,1,.162.633c-.006.668-.006,1.33-.006,2v.881a1.448,1.448,0,0,0,1.078,1.57,9.4,9.4,0,0,1,3.411,2.289,1.5,1.5,0,0,1,.387,1.477,1.589,1.589,0,0,1-1.312,1.3,1.537,1.537,0,0,1-1.386-.354l-.23-.2a7.913,7.913,0,0,0-1.5-1.078,4.046,4.046,0,0,0-3.994-.072,3.772,3.772,0,0,0-1.812,2.238,3.725,3.725,0,0,0,.808,3.676,3.62,3.62,0,0,0,2.771,1.3,7.935,7.935,0,0,1,1.784.2,6.835,6.835,0,0,1,2.031.836,7.2,7.2,0,0,1,2.632,2.748,7.006,7.006,0,0,1,.757,2.133,8.223,8.223,0,0,1,.112,1.705,6.16,6.16,0,0,1-.286,1.627,7.248,7.248,0,0,1-4.235,4.709,1.54,1.54,0,0,0-1.016,1.537v2.742a1.644,1.644,0,0,1-.993,1.633,1.429,1.429,0,0,1-.673.168A1.474,1.474,0,0,1,12288.485,22342.125Zm33.423-1.588a4.444,4.444,0,0,1-3.45-3.664c-.337-2.049.556-3.58,2.984-5.051v-2.047c0-1.617.006-3.232,0-4.848a1.6,1.6,0,0,1,.449-1.213,1.529,1.529,0,0,1,.544-.336,1.452,1.452,0,0,1,1.841.9,3.085,3.085,0,0,1,.106.9q.009,2.877.006,5.762v.949a4.778,4.778,0,0,1,2.8,2.816h2.66c1.116,0,2.227-.023,3.344.006a1.506,1.506,0,0,1,.359.039,1.42,1.42,0,0,1,1.06,1.705,1.4,1.4,0,0,1-1.441,1.145c-.971.027-1.947.012-2.924.012h-3.029c-.911,1.932-2.293,3.02-4.234,3.02A6.062,6.062,0,0,1,12321.908,22340.537Zm.938-5.947a1.571,1.571,0,1,0,.09,3.141l.039-.006a1.569,1.569,0,0,0-.077-3.137A.45.45,0,0,0,12322.846,22334.59Zm-73.321-2.5h-6.082a4.161,4.161,0,0,1-.746-.045,1.442,1.442,0,0,1,.051-2.832,4.589,4.589,0,0,1,.752-.023h6.665c.19,0,.388-.012.584.006a1.441,1.441,0,0,1,.027,2.873c-.224.021-.448.025-.674.025C12249.909,22332.1,12249.716,22332.092,12249.524,22332.092Zm-.09-14.729a1.368,1.368,0,0,1-1.262-1.408,1.4,1.4,0,0,1,1.318-1.453c.331-.027.667,0,1,0s.674-.023,1,0a1.476,1.476,0,0,1,1.363,1.426,1.4,1.4,0,0,1-1.341,1.436c-.345.025-.691.039-1.038.039S12249.78,22317.389,12249.435,22317.363Zm-13.942.029h-.106a1.418,1.418,0,0,1-1.386-1.453,1.243,1.243,0,0,1,0-.135,1.393,1.393,0,0,1,1.487-1.3c1.257-.021,2.5-.01,3.754,0s2.5-.023,3.753,0a1.444,1.444,0,0,1,.247,2.867,6.547,6.547,0,0,1-.83.023h-6.34c-.128,0-.258,0-.388,0C12235.623,22317.4,12235.558,22317.4,12235.492,22317.393Zm15.777-14.711h-.006a1.388,1.388,0,0,1-1.335-1.426v-.023a1.425,1.425,0,0,1,1.419-1.424c.881-.033,1.773-.006,2.66-.006s1.778-.039,2.665.012a1.426,1.426,0,0,1,1.245,2.041,1.285,1.285,0,0,1-1.155.826c-1.007.012-2.012.021-3.016.021Q12252.508,22302.7,12251.27,22302.682Z"
										transform="translate(-12233.499 -22291.93)"
										fill="url(#linear-gradient-4)"
										stroke="rgba(0,0,0,0)"
										strokeMiterlimit="10"
										strokeWidth="1"
									/>
								</Svg>
							</FansView>
							<FansGap height={16.6} />
							<FansText fontFamily="inter-semibold" fontSize={17}>
								Instant payouts
							</FansText>
							<FansGap height={11} />
							<FansView style={tw.style("max-w-[315px]")}>
								<FansText
									style={tw.style(
										"text-fans-grey-70 dark:text-fans-grey-b1",
									)}
									fontSize={16}
									textAlign="center"
								>
									Get paid instantly through your{" "}
									<FansView
										touchableOpacityProps={{
											onPress: handlePressPayout,
										}}
									>
										<FansText
											color="green-4d"
											textDecorationLine="underline"
											onPress={() => {
												openLink("refer-payout");
											}}
										>
											Payout Dashboard
										</FansText>
									</FansView>
									. Your earnings, in your pocket, right away
								</FansText>
							</FansView>
						</FansView>
						{/* ~ Instant payouts */}

						<FansGap height={49} />

						{/* Insightful analytics ~ */}
						<FansView alignItems="center">
							<FansView width={78.72} height={62.04}>
								<Svg viewBox="0 0 78.724 62.042">
									<Defs>
										<LinearGradient
											id="linear-gradient-5"
											x1="0.25"
											y1="1.012"
											x2="0.913"
											y2="-0.345"
											gradientUnits="objectBoundingBox"
										>
											<Stop
												offset="0"
												stopColor="#4dcc36"
											/>
											<Stop
												offset="1"
												stopColor="#89f276"
											/>
										</LinearGradient>
									</Defs>
									<G transform="translate(-1495.935 -258.515)">
										<Path
											d="M1573.084,317.751c-.806,0-1.594,0-2.384,0l-2.22,0v-6.5c0-5.373-.006-10.929.019-16.393a1.612,1.612,0,0,0-1.746-1.806c-2.24.034-4.5.029-6.7.023q-1.248,0-2.495,0c-1.243,0-1.73.481-1.74,1.715v21.9c0,.206-.007.415-.013.625l-.012.42h-4.6l0-.98q0-3.508,0-7.017c0-1.051-.512-1.688-1.365-1.7h-.037a1.27,1.27,0,0,0-.914.349,1.863,1.863,0,0,0-.472,1.367v7.954h-7.034V287.261h7.034v7.8a4.818,4.818,0,0,0,.021.678,1.385,1.385,0,0,0,2.744.008,3.939,3.939,0,0,0,.023-.59q0-1.284-.005-2.56c-.007-2.1-.014-4.265.023-6.4a1.773,1.773,0,0,0,0-.356,1.607,1.607,0,0,0-1.765-1.431c-3.275.059-6.181.059-8.89,0l-.111,0a2,2,0,0,0-1.449.446,2.171,2.171,0,0,0-.486,1.617c.029,7.672.026,15.472.023,23.016l0,8.213h-4.618v-4.431q.01-4.359,0-8.714a1.557,1.557,0,0,0,0-.4,1.4,1.4,0,0,0-.543-.938,1.435,1.435,0,0,0-1.048-.28c-3.2,0-6.346,0-9.509-.005a1.543,1.543,0,0,0-1.249.533,1.747,1.747,0,0,0-.318,1.2V317.7h-4.618l0-5.811c0-4.782-.006-9.726.019-14.59a1.612,1.612,0,0,0-1.772-1.782c-1.975.041-3.968.032-5.894.025q-1.188,0-2.375-.006l-.363,0c-.237,0-.476,0-.713,0a1.43,1.43,0,0,0-.315,0,1.414,1.414,0,0,0-1.247,1.569v20.582h-5.237l0-57.269a5.772,5.772,0,0,0-.013-.605,1.391,1.391,0,0,0-1.285-1.3c-.034,0-.068,0-.1,0a1.389,1.389,0,0,0-1.381,1.288c-.017.2-.014.4-.011.6l0,.232c.018,19.165.01,38.6-.02,57.767,0,1.587.555,2.15,2.124,2.15q37.256-.018,74.514-.018l.153,0c.107,0,.213,0,.321,0l.114.009a1.49,1.49,0,0,0,1.031-.389,1.43,1.43,0,0,0,.456-1.006c0-.042,0-.091-.006-.138A1.431,1.431,0,0,0,1573.084,317.751Zm-59.285-.045h-7V298.385h7Zm17.3-.018h-7V305.761l7,0Zm34.562.007h-7v-21.8h7Z"
											fill="url(#linear-gradient-5)"
										/>
										<Path
											d="M1504.977,274.635q2.215,2.217,4.425,4.425c3.451,3.448,7.019,7.013,10.508,10.534a2.131,2.131,0,0,0,1.436.806h0a2.205,2.205,0,0,0,1.466-.813q11.034-11.064,22.077-22.1c.161-.157.323-.308.562-.532l.329-.308.1.16a5.332,5.332,0,0,0,.505.7q4.808,4.816,9.639,9.649l.143.145c.113.114.227.229.347.338.039.041.072.072.1.1a1.382,1.382,0,0,0,1.949-.117c.128-.114.234-.221.34-.328l.11-.11q3.955-3.949,7.9-7.913a5.321,5.321,0,0,0,.507-.732l.1-.171.138.139c.263.262.511.505.747.734.49.475.911.885,1.312,1.336a1.465,1.465,0,0,0,2.615-.7l.014-.06c.681-2.705,1.386-5.5,2.211-8.217a1.483,1.483,0,0,0-1.9-1.935c-.607.209-1.234.363-1.841.512-.283.069-.566.139-.847.213-.576.155-1.151.314-1.724.473-1.262.349-2.567.71-3.864,1.009a1.5,1.5,0,0,0-1.021.586,1.477,1.477,0,0,0,.3,2.062,14.154,14.154,0,0,1,1.122,1.093c.124.13.248.261.373.389a3.447,3.447,0,0,1,.3.36l.075.1-.09.09-8,8.016-.142-.122a2.429,2.429,0,0,1-.2-.171l-3.438-3.435q-3.428-3.439-6.871-6.87a1.529,1.529,0,0,0-.3-.307,1.44,1.44,0,0,0-2.02.291c-.114.113-.21.211-.307.308l-.144.146q-10.935,10.936-21.872,21.868c-.156.157-.317.312-.526.512l-.384.367-.1-.149a6.813,6.813,0,0,0-.54-.706q-6.8-6.807-13.627-13.625a5.867,5.867,0,0,0-.6-.573,1.353,1.353,0,0,0-1.827.138,1.34,1.34,0,0,0-.122,1.776A5.045,5.045,0,0,0,1504.977,274.635Zm66.3-11.7-1.056,3.956-2.879-2.877Z"
											fill="url(#linear-gradient-5)"
										/>
										<Path
											d="M1549.805,301.1h-.005a1.389,1.389,0,0,0,0,2.777h.005a1.406,1.406,0,0,0,1.384-1.355l.15-.039h-.15A1.39,1.39,0,0,0,1549.805,301.1Z"
											fill="url(#linear-gradient-5)"
										/>
									</G>
								</Svg>
							</FansView>
							<FansGap height={19.3} />
							<FansText fontFamily="inter-semibold" fontSize={17}>
								Insightful analytics
							</FansText>
							<FansGap height={11} />
							<FansView style={tw.style("max-w-[314px]")}>
								<FansText
									style={tw.style(
										"text-fans-grey-70 dark:text-fans-grey-b1",
									)}
									fontSize={16}
									textAlign="center"
								>
									Harness the power of data. Dive into your
									personalized analytics
								</FansText>
							</FansView>
						</FansView>
						{/* ~ Insightful analytics */}
					</FansView>
				)}
				<FansView
					style={tw.style(
						"mt-[40px] bg-fans-white shadow-lg rounded-[15px]",
						"w-full max-w-[673px] overflow-hidden",
					)}
				>
					<LinearGradientView
						colors={["#5F17D3", "#A854F5"]}
						start={{ x: 0.3, y: 0.9 }}
						end={{ x: 1.3, y: -0.1 }}
						style={{
							flex: 1,
							paddingHorizontal: 17,
							paddingVertical: 22,
						}}
					>
						{/* Your referral link ~ */}
						<FansView alignItems="center">
							<FansText
								color="white"
								fontFamily="inter-semibold"
								fontSize={23}
							>
								Your referral links
							</FansText>
							<FansGap height={12} />
							<FansView maxWidth={255}>
								<FansText
									color="white"
									fontSize={16}
									textAlign="center"
								>
									Start referring creators today, and see your
									networth soar
								</FansText>
							</FansView>
							<FansGap height={20} />
							{links.map((item, index) => {
								return (
									<>
										<FansView
											height={42}
											alignItems="center"
											alignSelf="stretch"
											borderRadius="full"
											flexDirection="row"
											padding={4}
											style={tw.style(
												"bg-fans-white dark:bg-fans-black-1d",
												"border border-fans-grey dark:border-fans-grey-43",
											)}
										>
											<FansGap width={12} />
											<FansText
												fontFamily="inter-semibold"
												fontSize={16}
											>
												{getLinkCode(index)}
											</FansText>
											<FansView
												width={34}
												height={34}
												touchableOpacityProps={
													copiedIndex === index
														? undefined
														: {
																onPress: () => {
																	handlePressCopy(
																		index,
																	);
																},
														  }
												}
												alignItems="center"
												justifyContent="center"
											>
												{copiedIndex === index ? (
													<FansSvg
														width={14.71}
														height={18.73}
														svg={Check1Svg}
														color1="purple-5f"
													/>
												) : (
													<FansSvg
														width={14.71}
														height={18.73}
														svg={Copy1Svg}
														color1="purple-5f"
													/>
												)}
											</FansView>
											<FansGap grow />
											<FansView
												style={tw.style(
													"w-[34px] h-[34px] rounded-full bg-fans-grey-f0 p-2 items-center justify-center",
													"dark:bg-fans-grey-43",
												)}
												touchableOpacityProps={{
													onPress: () => {
														handleEditLink(index);
													},
												}}
											>
												<FypSvg
													svg={EditSvg}
													width={18}
													height={18}
													color="fans-black dark:fans-white"
												/>
											</FansView>
											<FansGap width={7.2} />
											<FansView
												style={tw.style(
													"w-[34px] h-[34px] rounded-full bg-fans-grey-f0 p-2 items-center justify-center",
													"dark:bg-fans-grey-43",
												)}
												touchableOpacityProps={{
													onPress: () => {
														handleViewAnalytics(
															index,
														);
													},
												}}
											>
												<FypSvg
													svg={ReferCreatorsAnalytics}
													width={18}
													height={18}
													color="fans-black dark:fans-white"
												/>
											</FansView>
										</FansView>
										<FansGap height={10} />
									</>
								);
							})}
							<FansButton3
								style={{ width: "100%" }}
								title="+ Create new link"
								onPress={handleCreateNewLink}
							/>
						</FansView>
						{/* ~ Your referral link */}
					</LinearGradientView>
				</FansView>

				<FansGap height={20} />
			</FansView>
			<CreateNewLinkDialog
				onClose={() => {}}
				onSubmit={handleOpenLinkCreatedModal}
			/>
			{selectedReferral && (
				<EditLinkDialog
					referral={selectedReferral}
					onDeleteLink={() => {
						setRefreshKey(refreshKey + 1);
					}}
				/>
			)}
			{selectedReferral && (
				<ViewAnalyticsDialog referral={selectedReferral} />
			)}
			<ReferralLinkCreatedModal
				code={newLinkCode}
				visible={isLinkCreatedModalOpened}
				onClose={handleCloseLinkCreatedModal}
				onSubmit={() => {}}
			/>

			<FypModal
				visible={becomeCreatorModalVisible}
				onDismiss={onCloseBecomeCreatorModal}
				width={{ xs: "full", lg: 600 }}
			>
				<FansView padding={{ t: 38, x: 18, b: 15 }} position="relative">
					<FypText
						fontSize={23}
						fontWeight={700}
						lineHeight={31}
						textAlign="center"
						margin={{ b: 15 }}
					>
						Must become a creator to access our referral program
					</FypText>

					<RoundButton onPress={onCloseBecomeCreatorModal}>
						Continue
					</RoundButton>
				</FansView>
			</FypModal>
		</FansScreen3>
	);
};

const ReferCreatorsEarnScreen = () => {
	return SettingsNavigationLayout(<SettingsReferCreatorsNativeStack />);
};

export default ReferCreatorsEarnScreen;
