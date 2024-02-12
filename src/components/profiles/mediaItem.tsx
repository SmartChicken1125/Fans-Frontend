import { MusicSvg, Pin2Svg, PlaySvg, CheckSvg } from "@assets/svgs/common";
import { FypNullableView, FypSvg, FypText } from "@components/common/base";
import { FansView } from "@components/controls";
import { decodeToDataURL } from "@helper/BlurHash";
import { cdnURL, urlOrBlurHash } from "@helper/Utils";
import tw from "@lib/tailwind";
import { MediaType, ResizeMode } from "@usertypes/commonEnums";
import { IMedia } from "@usertypes/types";
import moment from "moment";
import React, { FC } from "react";
import { Image } from "react-native";

interface Props {
	size: number;
	onPress: () => void;
	data: IMedia;
	showDate?: boolean;
	selectable?: boolean;
	selected?: boolean;
}

const MediaItem: FC<Props> = (props) => {
	const { size, onPress, data, showDate, selectable, selected } = props;

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
				<Image
					source={{
						uri: urlOrBlurHash(cdnURL(data.url), data.blurhash),
					}}
					style={tw.style("w-full h-full", {
						pointerEvents: "none",
					})}
					resizeMode="cover"
				/>
			)}
			{data.type === MediaType.Video && (
				<Image
					source={{
						uri: urlOrBlurHash(
							cdnURL(data.thumbnail),
							data.blurhash,
						),
					}}
					style={tw.style("w-full h-full bg-fans-black", {
						pointerEvents: "none",
					})}
					resizeMode="cover"
				/>
			)}
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
					style={{ filter: "drop-shadow(0 5px 7px rgba(0,0,0,0.5))" }}
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
			<FypNullableView visible={showDate ?? false}>
				<FansView
					position="absolute"
					width={{ xs: 62, md: 90 }}
					height={{ xs: 15, md: 20 }}
					borderRadius={20}
					style={tw.style(
						"bg-fans-black/50 top-3 left-3 md:top-5 md:left-5",
					)}
					alignItems="center"
					justifyContent="center"
				>
					<FypText
						fontSize={{ xs: 8, md: 14 }}
						fontWeight={600}
						lineHeight={{ xs: 11, md: 19 }}
						style={tw.style("text-fans-white")}
					>
						{moment(data.updatedAt).format("MM/DD/YYYY")}
					</FypText>
				</FansView>
			</FypNullableView>
			<FypNullableView visible={selectable ?? false}>
				<FansView
					position="absolute"
					width={{ xs: 20, md: 26 }}
					height={{ xs: 20, md: 26 }}
					borderRadius={26}
					alignItems="center"
					justifyContent="center"
					style={tw.style(
						"top-3 right-3 md:top-5 md:right-5",
						selected
							? "bg-fans-purple"
							: "border border-fans-white bg-fans-black/50",
					)}
				>
					<FypNullableView visible={selected ?? false}>
						<FypSvg
							svg={CheckSvg}
							width={11}
							height={8}
							color="fans-white"
						/>
					</FypNullableView>
				</FansView>
			</FypNullableView>
		</FansView>
	);
};

export default MediaItem;
