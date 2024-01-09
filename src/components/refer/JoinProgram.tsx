import {
	ChevronDownSvg,
	ChevronUp2Svg,
	OutlinedPlaySvg,
	PhonewithCashSvg,
	QuestionMarkInCircleSvg,
} from "@assets/svgs/common";
import RoundButton from "@components/common/RoundButton";
import { FypLink } from "@components/common/base";
import { FansDivider, FansText, FansView } from "@components/controls";
import { useAppContext } from "@context/useAppContext";
import { postFansReferralJoinProgram } from "@helper/endpoints/referral/apis";
import { FansReferralJoinProgramReqBody } from "@helper/endpoints/referral/schemas";
import tw from "@lib/tailwind";
import Slider from "@react-native-community/slider";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RoundButtonType, SubscriptionTypes } from "@usertypes/commonEnums";
import { Colors } from "@usertypes/enums";
import { CreatorProfileNavigationStacks } from "@usertypes/navigations";
import { IProfile } from "@usertypes/types";
import { useBlankLink } from "@utils/useBlankLink";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { Popable } from "react-native-popable";
import Toast from "react-native-toast-message";

const JoinProgramCard = (props: {
	profile: IProfile;
	navigation: NativeStackNavigationProp<
		CreatorProfileNavigationStacks,
		"Creator",
		undefined
	>;
}) => {
	const [isExpanded, setExpanded] = useState(false);
	const steps = [1, 50, 100, 150, 200, 250];
	const { profile } = props;
	const { state } = useAppContext();

	const [joined, setJoined] = useState(
		profile.fanReferrals?.find(
			(el) => el.userId == state.user.userInfo.id,
		) ?? false,
	);

	const onPress = () => {
		setExpanded(!isExpanded);
	};
	const [openLink] = useBlankLink();
	const [inProgress, setInProgress] = useState(false);

	const onJoin = async () => {
		if (joined) {
			props.navigation.navigate("ReferAndEarn", { profile: profile });
		} else {
			setInProgress(true);

			const postbody: FansReferralJoinProgramReqBody = {
				profileId: profile.id,
			};
			const resp = await postFansReferralJoinProgram(postbody);

			if (resp.ok) {
				props.navigation.navigate("ReferAndEarn", { profile: profile });
			} else {
				Toast.show({
					type: "error",
					text1: resp.data.message,
				});
			}
			setInProgress(false);
		}
	};

	const getSubscriptionPrice = () => {
		if (profile.subscriptionType === SubscriptionTypes.Tier) {
			const tiers = profile.tiers;
			if (tiers != null) {
				return Number(tiers[0]?.price ?? 0);
			} else {
				return 0;
			}
		} else {
			const subscriptions = profile.subscriptions;
			if (subscriptions != null) {
				return Number(subscriptions[0]?.price ?? 0);
			} else {
				return 0;
			}
		}
	};

	const [earnings, setEarnings] = useState(getSubscriptionPrice() * 0.2);
	const [numberOfReferrals, setNumberOfReferrals] = useState(1);
	useEffect(() => {
		setEarnings(getSubscriptionPrice() * numberOfReferrals * 3);
	}, [profile, numberOfReferrals]);

	return (
		<View
			style={tw.style(
				"mx-[18px] border rounded-[15px] border-fans-grey px-3 py-4",
			)}
		>
			<View
				style={tw.style(
					"flex flex-row gap-4 justify-center items-center my-2",
				)}
			>
				<View>
					<PhonewithCashSvg width={70} />
				</View>
				<View style={tw.style("flex-1 gap-2")}>
					<FansText fontSize={19}>Refer and earn</FansText>
					<FansText fontSize={17}>
						Make {profile.fanReferralShare}% lifetime revenue share.{" "}
						<FypLink
							color="green-4d"
							onPress={() => {
								openLink(
									"https://www.blog.fyp.fans/tag/creator-referral/",
								);
							}}
						>
							Learn more
						</FypLink>
					</FansText>
					<View style={tw.style("mt-2")}>
						<RoundButton
							variant={
								!joined
									? RoundButtonType.SECONDARY
									: RoundButtonType.OUTLINE_SECONDARY
							}
							customStyles="max-w-[190px]"
							onPress={onJoin}
						>
							{!joined ? (
								<FansText
									fontSize={18}
									style={tw.style("font-semibold text-white")}
								>
									Join Program
								</FansText>
							) : (
								<View
									style={tw.style(
										"flex flex-row items-center gap-2",
									)}
								>
									<FansText
										fontSize={18}
										style={tw.style(
											"font-semibold text-fans-green-4d",
										)}
									>
										Manage
									</FansText>
								</View>
							)}
						</RoundButton>
					</View>
				</View>
			</View>
			<FansDivider style={tw.style("my-4")} />

			{joined && profile.marketingContentLink && (
				<View style={tw.style("flex gap-3 mb-8")}>
					<FansText fontSize={17}>Marketing content</FansText>
					<FansText color="grey-70" fontSize={16}>
						Use these resources as content to post on social media
						platforms
					</FansText>
					<View style={tw.style("mt-2")}>
						<RoundButton
							variant={RoundButtonType.OUTLINE_SECONDARY}
						>
							<View
								style={tw.style(
									"flex flex-row items-center gap-2",
								)}
							>
								<OutlinedPlaySvg
									width={12}
									color={Colors.Green}
								/>
								<FansText
									fontSize={18}
									style={tw.style(
										"font-semibold text-fans-green-4d",
									)}
								>
									View resources
								</FansText>
							</View>
						</RoundButton>
					</View>
				</View>
			)}

			<View>
				<View
					style={tw.style(
						"flex flex-row justify-between items-center",
					)}
				>
					<View style={tw.style("flex flex-row gap-[20px]")}>
						<FansText>Earnings Calculator</FansText>
						<Popable
							backgroundColor="#F6EDFF"
							content={
								<View
									style={tw.style(
										"bg-fans-purple-light rounded-full px-2 py-4",
									)}
								>
									<FansText
										color="purple-a8"
										fontSize={16}
										style={tw.style("text-center")}
									>
										Use this calculator to estimate your
										potential earnings in this referral
										program. This is an estimate with no
										promises, revenue varies.{" "}
										<FansText
											style={tw.style(
												"underline text-fans-purple-a8",
											)}
											onPress={() => {
												openLink(
													"https://www.blog.fyp.fans/tag/creator-referral/",
												);
											}}
										>
											Learn more
										</FansText>
									</FansText>
								</View>
							}
							position="top"
							style={tw.style("w-[330px]")}
						>
							<QuestionMarkInCircleSvg width={15} />
						</Popable>
					</View>

					<TouchableOpacity onPress={onPress}>
						<FansView width={12.28} height={6.14}>
							{isExpanded ? (
								<ChevronUp2Svg color={Colors.Grey} />
							) : (
								<ChevronDownSvg color={Colors.Grey} />
							)}
						</FansView>
					</TouchableOpacity>
				</View>
				{isExpanded && (
					<View style={tw.style("mt-4")}>
						<View style={tw.style("flex items-center gap-1 mb-3")}>
							<FansText color="green-4d" fontSize={35}>
								${earnings.toLocaleString()}
							</FansText>
							<FansText color="green-4d" fontSize={14}>
								MONTHLY $$$
							</FansText>
						</View>
						<View>
							<FansText color="grey-70" fontSize={16}>
								Referrals
							</FansText>
							<View style={tw.style("mt-2")}>
								<Slider
									maximumValue={250}
									minimumValue={1}
									minimumTrackTintColor="#4DCC36"
									maximumTrackTintColor="#f0f0f0"
									thumbTintColor="#4DCC36"
									step={1}
									value={numberOfReferrals}
									onValueChange={(value) => {
										setNumberOfReferrals(value);
									}}
								/>
								<View
									style={tw.style(
										"flex flex-row justify-between mx-2 mt-1",
									)}
								>
									{steps &&
										steps.map((step, index) => (
											<FansText
												key={index}
												color="grey-70"
												fontSize={15}
											>
												{step}
											</FansText>
										))}
								</View>
							</View>
						</View>
					</View>
				)}
			</View>

			<ActivityIndicator
				animating={true}
				color="#a854f5"
				style={tw.style(
					"absolute top-1/2 left-1/2",
					!inProgress && "hidden",
				)}
			/>
		</View>
	);
};

export default JoinProgramCard;
