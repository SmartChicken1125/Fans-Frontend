import { ChatSvg } from "@assets/svgs/common";
import { FaqImage } from "@assets/svgs/images";
import RoundButton from "@components/common/RoundButton";
import { FypVideo, FypText } from "@components/common/base";
import {
	FansDivider,
	FansGap,
	FansImage2,
	FansText,
	FansView,
} from "@components/controls";
import { useAppContext } from "@context/useAppContext";
import tw from "@lib/tailwind";
import { FaqItem } from "@screens/profile/edit/badgeSystemScreen";
import { ResizeMode } from "@usertypes/commonEnums";
import { SettingsNativeStackScreenProps } from "@usertypes/navigations";
import { useBlankLink } from "@utils/useBlankLink";
import React from "react";
import { ScrollView } from "react-native";

const VideoCallSetupTOS = (
	props: SettingsNativeStackScreenProps<"VideoCallSetupTOS">,
) => {
	const { navigation } = props;
	const [openLink] = useBlankLink();
	const { dispatch } = useAppContext();
	const handlePressChat = () => {
		openLink("https://support.fyp.fans/");
	};

	return (
		<ScrollView>
			<FansView style={tw.style("bg-fans-white dark:bg-fans-black-1d")}>
				<FansView
					style={tw.style(
						"bg-fans-purple-f6 dark:bg-fans-purple-47 pb-[116px] md:pb-0",
					)}
				>
					<FansView
						style={tw.style(
							!tw.prefixMatch("lg")
								? "ml-[17px] mr-[18px] mt-[20px] mb-[16.6px]"
								: "ml-[16.6px] mr-[16.6px] mt-[34.4px] mb-[24px]",
						)}
					>
						<FansView alignItems="center">
							<FansImage2
								width={58.75}
								height={68.35}
								source={require("@assets/images/refer-creators-tip.png")}
							/>
							<FansGap height={11.2} />
							<FypText
								fontWeight={600}
								textAlign="center"
								fontSize={23}
							>
								Enable Video Calls: Connect More, Earn More!
							</FypText>
							<FansGap height={15} />
							<FansText
								fontFamily="inter-regular"
								fontSize={16}
								style={tw.style("text-center")}
							>
								As a creator, you have complete control over
								your availability, the interactions you’re
								comfortable with, and the pricing per call
								duration.
							</FansText>
							<FansGap height={12} />
							<FansText
								fontFamily="inter-regular"
								fontSize={16}
								style={tw.style("text-center")}
							>
								With the flexibility to accept calls when you’re
								free, this platform enables a more intimate
								connection with your fans, allowing you to
								maximize your earnings while sharing memorable
								moments.
							</FansText>
							<FansGap height={35.7} />
						</FansView>
						<RoundButton
							onPress={() =>
								navigation.navigate("VideoCallSetup")
							}
						>
							Set up video calls
						</RoundButton>
					</FansView>
				</FansView>
				<FansView
					style={tw.style(
						"px-[18px] md:px-0 md:max-w-[670px] mx-auto pb-10",
						"mt-[-116px] md:mt-0",
					)}
				>
					<FansView
						height={{ xs: 234, md: 436 }}
						style={tw.style("md:mt-10")}
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
					<FansDivider
						style={tw.style("mt-10 md:mt-[75px] mb-[34px]")}
					/>
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
						<FaqItem
							question="How can I configure my availability and set my pricing for
					the video calls?"
						>
							Head to your creator dashboard and find the Video
							Calls section to input your usual availability and
							set your pricing per call duration. This feature is
							designed to give you total control, and fans will be
							charged only when you confirm their call requests.
						</FaqItem>
						<FaqItem question="Can I choose the type of interactions	I’m comfortable with during the calls?">
							Absolutely! Your comfort is our priority. Detail
							your preferred interaction types and any limitations
							within your profile settings. Clear communication is
							encouraged to maintain a mutual understanding and
							respect during every interaction.
						</FaqItem>
						<FaqItem question="When are fans charged for scheduling the video calls?">
							Fans will provide their payment details when sending
							a request for a video call, but the charge is
							applied only after you accept the scheduled call. No
							charges are incurred by fans for declined or
							unresponded requests.
						</FaqItem>
						<FaqItem question="Is it possible to cancel an accepted video call?">
							Yes, should any unforeseen events occur, you can
							cancel an accepted call. We advise doing this as
							promptly as possible to maintain trust with your
							fans. Any payments made by fans for cancelled calls
							are fully refunded.
						</FaqItem>
						<FaqItem question="What fee’s are taken?">
							We charge a 25% fee for each video call. You also
							pay processing fee’s for which payment method the
							fan uses, rates can be seen here.
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

export default VideoCallSetupTOS;
