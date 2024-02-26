import { ChatSvg, VideoCall2Svg } from "@assets/svgs/common";
import { FaqImage } from "@assets/svgs/images";
import RoundButton from "@components/common/RoundButton";
import {
	FypText,
	FypVideo,
	FypLinearGradientView,
	FypButton2,
	FypSvg,
} from "@components/common/base";
import { FansGap, FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FaqItem } from "@screens/profile/edit/badgeSystemScreen";
import { ResizeMode } from "@usertypes/commonEnums";
import { SettingsCameoSetupNativeStackParams } from "@usertypes/navigations";
import { useBlankLink } from "@utils/useBlankLink";
import { useNavigation } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";

const SetUpFaqScreen = () => {
	const navigation =
		useNavigation<
			NativeStackNavigationProp<SettingsCameoSetupNativeStackParams>
		>();

	const [openLink] = useBlankLink();
	const handlePressChat = () => {
		openLink("https://support.fyp.fans/");
	};

	return (
		<ScrollView>
			<FansView style={tw.style("bg-fans-white dark:bg-fans-black-1d")}>
				<FypLinearGradientView
					colors={["#D27EFE", "#A854F5", "#651CD6"]}
					start={[0, 1]}
					end={[1, 0]}
					style={tw.style("pb-[116px] md:pb-0")}
				>
					<FansView
						style={tw.style(
							!tw.prefixMatch("lg")
								? "ml-[17px] mr-[18px] mt-[20px] mb-[16.6px]"
								: "ml-[16.6px] mr-[16.6px] mt-[34.4px] mb-[24px]",
						)}
					>
						<FansView alignItems="center">
							<FypSvg
								svg={VideoCall2Svg}
								width={82}
								height={99}
								color="fans-white"
							/>
							<FansGap height={11.2} />
							<FypText
								fontWeight={600}
								textAlign="center"
								fontSize={23}
								style={tw.style("text-fans-white")}
							>
								Enable custom videos: Connect More, Earn More!
							</FypText>
							<FansGap height={15} />
							<FypText
								fontSize={16}
								lineHeight={28}
								textAlign="center"
								style={tw.style("text-fans-white")}
							>
								Enabling custom videos lets your fans purchase
								requested videos at prices that you set.{`\n`}
								You have complete control over when you want to
								accept orders, how long you have to fulfill
								them, and more when setting up this feature.
								Change or disable custom videos at anytime after
								enabling them
							</FypText>
							<FansGap height={35.7} />
						</FansView>
						<FansView
							style={tw.style("max-w-[268px] mx-auto w-full")}
						>
							<FypButton2
								style={tw.style("bg-fans-white")}
								textStyle={tw.style("text-fans-black")}
								pressableProps={{
									onPress: () => navigation.navigate("Setup"),
								}}
							>
								Set up custom videos
							</FypButton2>
						</FansView>
					</FansView>
				</FypLinearGradientView>
				<FansView
					style={tw.style(
						"px-[18px] md:px-0 md:max-w-[670px] mx-auto pb-10",
						"mt-[-116px] md:mt-0",
					)}
				>
					<FansView
						height={{ xs: 234, md: 436 }}
						style={tw.style("md:mt-10 mb-[34px]")}
					>
						<FypVideo
							id="set-up-video-call-video"
							source={{
								uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
							}}
							style={[
								tw.style(
									"w-full h-full rounded-[7px] md:rounded-[15px]",
								),
							]}
							resizeMode={ResizeMode.CONTAIN}
						/>
					</FansView>
					<FansView alignItems="center" margin={{ b: 16 }}>
						<FaqImage size={108} />
					</FansView>
					<FypText
						fontWeight={600}
						fontSize={23}
						textAlign="center"
						margin={{ b: 35 }}
					>
						Frequently Asked Questions
					</FypText>
					<FansView gap={35} margin={{ b: 40 }}>
						<FaqItem question="How do fans purchases custom videos?">
							When you enable custom videos you will input details
							like description, prices, fulfillment time, and
							more. Your fan will see options to purchase these
							videos and fill out their requirements.
						</FaqItem>
						<FaqItem question="How long do you have to fulfill?">
							Choose how quickly you'll create your custom videos.
							You have your chosen time plus 3 extra days. Set
							'vacation' times to stop orders and limit how many
							you'll do at once.
						</FaqItem>
						<FaqItem question="How do you payout your money?">
							After making a video, get paid through the same
							method as your other earnings. Cash out anytime to
							your bank from your payout page.
						</FaqItem>
						<FaqItem question="What platform fees does FYP.Fans take from custom videos?">
							FYP.Fans takes a 15% fee for each video. You keep
							the rest.
						</FaqItem>
						<FaqItem question="What happens if a fan's request is outside my allowed content?">
							If a request doesn't fit your rules, feel free to
							say no. For each custom video you device to accept
							or decline it before the fan is charged. Make sure
							your rules are clear on your custom video page.
						</FaqItem>
						<FaqItem question="What if I'm unable to fulfill a video request in the agreed timeframe?">
							Can't make the deadline? Tell the fan ASAP. You can
							cancel orders anytime through your custom video
							dashboard.
						</FaqItem>
					</FansView>
					<FansView
						borderRadius={15}
						padding={{ x: 18, t: 21, b: 28 }}
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
							Still need help?
						</FypText>
						<RoundButton onPress={handlePressChat}>
							<ChatSvg
								size={14.33}
								color="#fff"
								style={tw.style("mr-[10px]")}
							/>
							Chat to us
						</RoundButton>
					</FansView>
				</FansView>
			</FansView>
		</ScrollView>
	);
};

export default SetUpFaqScreen;
