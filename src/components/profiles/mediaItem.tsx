import { MusicSvg, Pin2Svg, PlaySvg } from "@assets/svgs/common";
import { FypNullableView, FypSvg } from "@components/common/base";
import { FansView } from "@components/controls";
import { cdnURL } from "@helper/Utils";
import tw from "@lib/tailwind";
import { MediaType, ResizeMode } from "@usertypes/commonEnums";
import { IMedia, IThemeMode } from "@usertypes/types";
import { Video } from "expo-av";
import { Image as ExpoImage } from "expo-image";
import React, { FC } from "react";
import { Image } from "react-native";

interface Props {
	size: number;
	onPress: () => void;
	data: IMedia;
	theme?: IThemeMode;
}

const MediaItem: FC<Props> = (props) => {
	const { size, onPress, data } = props;

	return (
		<FansView
			border={1}
			position="relative"
			width={size}
			height={size}
			pressableProps={{
				onPress: onPress,
			}}
			style={tw.style("border-fans-white dark:border-fans-black")}
		>
			{data.type === MediaType.Image && (
				<>
					{data.blurhash ? (
						<ExpoImage
							source={data.blurhash}
							style={tw.style("w-full h-full")}
							contentFit="cover"
						/>
					) : (
						<Image
							source={{
								uri: cdnURL(data.url),
							}}
							style={tw.style("w-full h-full")}
							resizeMode="cover"
						/>
					)}
				</>
			)}
			{data.type === MediaType.Video ? (
				<>
					{data.blurhash ? (
						<ExpoImage
							source={data.blurhash}
							style={tw.style("w-full h-full")}
							contentFit="cover"
						/>
					) : (
						<Video
							source={{
								uri: cdnURL(data.url) ?? "",
							}}
							style={tw.style("w-full h-full")}
							resizeMode={ResizeMode.CONTAIN}
						/>
					)}
				</>
			) : null}
			{data.type === MediaType.Audio ? (
				<FansView
					width="full"
					height="full"
					flexDirection="row"
					alignItems="center"
					justifyContent="center"
				>
					<MusicSvg size={58} color="#a854f5" />
				</FansView>
			) : null}

			<FypNullableView visible={data.type === MediaType.Video}>
				<FansView
					position="absolute"
					top={(size - 27) / 2}
					left={(size - 27) / 2}
				>
					<FypSvg
						width={27}
						height={27}
						color="fans-white dark:fans-black"
						svg={PlaySvg}
					/>
				</FansView>
			</FypNullableView>
			<FypNullableView visible={data.isPinned}>
				<FansView position="absolute" top={8} right={8}>
					<Pin2Svg color="#fff" size={16} />
				</FansView>
			</FypNullableView>
		</FansView>
	);
};

export default MediaItem;
