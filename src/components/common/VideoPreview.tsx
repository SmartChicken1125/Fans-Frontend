import { ChatSvg, PlaySvg } from "@assets/svgs/common";
import { FansImage2, FansView, FansIconButton } from "@components/controls";
import tw from "@lib/tailwind";
import React from "react";
import {
	View,
	Image,
	useWindowDimensions,
	TouchableOpacity,
} from "react-native";

const VideoPreview = () => {
	const { height, width } = useWindowDimensions();

	return (
		<FansView backgroundColor="white" alignItems="center">
			<FansImage2
				width={{ xs: width - 36, lg: 670 }}
				height={{
					xs: (width - 36) * 0.65,
					lg: 436,
				}}
				source={require("@assets/images/refer-creators-tip.png")}
				viewStyle={{ borderRadius: 7 }}
			/>
			<FansIconButton
				size={84}
				backgroundColor="bg-fans-white/50"
				style={{
					position: "absolute",
					left: "50%",
					top: "50%",
					transform: "translate(-50%, -50%)",
				}}
			>
				<PlaySvg
					width={30.5}
					height={33.6}
					color="#fff"
					style={{ marginLeft: 5 }}
				/>
			</FansIconButton>
		</FansView>
	);
};

export default VideoPreview;
