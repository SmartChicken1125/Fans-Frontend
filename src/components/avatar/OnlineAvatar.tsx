import { cdnURL } from "@helper/Utils";
import tw from "@lib/tailwind";
import React, { memo } from "react";
import { Image, View } from "react-native";
const defaultAvatar = require("@assets/images/default-avatar.png");

interface AvatarProps {
	image?: string;
	size?: string;
	online?: boolean;
}

const OnlineAvatar = memo(
	({ image, size = "30px", online = false }: AvatarProps) => {
		return (
			<View
				style={tw.style(
					`w-[${size}] h-[${size}] relative flex items-center justify-center`,
				)}
			>
				<Image
					source={image ? { uri: cdnURL(image) } : defaultAvatar}
					alt="User"
					resizeMode="cover"
					style={tw.style("w-full h-full rounded-full")}
				/>
				{online && (
					<View
						style={tw.style([
							"w-3 h-3 border-[2px] border-white bg-fans-green rounded-full absolute bottom-0 right-0",
						])}
					/>
				)}
			</View>
		);
	},
);

export default OnlineAvatar;
