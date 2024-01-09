import RoundButton from "@components/common/RoundButton";
import { FansText, FansView } from "@components/controls";
import tw from "@lib/tailwind";
import React, { FC } from "react";
import { View, Image } from "react-native";

interface Props {
	hide?: boolean;
	text: string;
	icon: "post" | "media" | "playlist";
	onSubscribe?: () => void;
}

const SubscribeAlert: FC<Props> = (props) => {
	const { text, icon, onSubscribe, hide = false } = props;

	return (
		<FansView
			style={tw.style(
				"flex-row items-center rounded-[15px] py-6 pl-4 pr-3 mb-4",
				"bg-fans-purple-f6 dark:bg-fans-purple-47",
				hide && "hidden",
			)}
		>
			<Image
				source={require("@assets/images/profile/subscribe-post.png")}
				style={[
					tw.style(icon !== "post" && "hidden"),
					{
						width: 74.7,
						height: 80.2,
					},
				]}
				resizeMode="cover"
			/>
			<Image
				source={require("@assets/images/profile/subscribe-media.png")}
				style={[
					tw.style(icon !== "media" && "hidden"),
					{
						width: 74.53,
						height: 74,
					},
				]}
				resizeMode="cover"
			/>
			<Image
				source={require("@assets/images/profile/subscribe-playlist.png")}
				style={[
					tw.style(icon !== "playlist" && "hidden"),
					{
						width: 71.8,
						height: 82.2,
					},
				]}
				resizeMode="cover"
			/>
			<FansView style={tw.style("ml-4 flex-1")}>
				<FansText
					fontSize={19}
					lineHeight={21}
					style={tw.style(
						"font-semibold mb-1.5 text-fans-black dark:text-fans-white",
					)}
				>
					Subscribe to unlock
				</FansText>
				<FansText
					fontSize={16}
					lineHeight={21}
					style={tw.style(
						"mb-4 text-fans-black dark:text-fans-white",
					)}
				>
					{text}
				</FansText>
				<View style={tw.style("max-w-[192px]")}>
					<RoundButton onPress={onSubscribe}>Subscribe</RoundButton>
				</View>
			</FansView>
		</FansView>
	);
};

export default SubscribeAlert;
