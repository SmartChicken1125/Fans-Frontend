import { CheckSvg, TransformSvg } from "@assets/svgs/common";
import { FypVideo, FypNullableView, FypText } from "@components/common/base";
import { FansIconButton } from "@components/controls";
import { cdnURL } from "@helper/Utils";
import tw from "@lib/tailwind";
import { ResizeMode } from "@usertypes/commonEnums";
import { clsx } from "clsx";
import React, { FC, useState } from "react";
import { Image, Pressable, View } from "react-native";

interface Props {
	colSpan: number;
	onPress: () => void;
	orderNumber?: number;
	orderAble?: boolean;
	selectAble?: boolean;
	style?: string;
	uri: string;
	isVideo?: boolean;
	sizeRate?: number;
	showTransform?: boolean;
	onPressTransform?: () => void;
}

const ImagePostChip: FC<Props> = (props) => {
	const {
		colSpan,
		onPress,
		orderNumber,
		orderAble,
		style,
		uri,
		selectAble,
		isVideo,
		sizeRate = 1,
		onPressTransform,
		showTransform,
	} = props;

	const isSelected = (orderNumber ?? 0) > 0;

	const [width, setWidth] = useState(0);

	const size = `w-1/${colSpan} h-[${width * sizeRate}px]`;

	return (
		<Pressable
			style={tw.style(
				clsx(
					"relative border border-fans-white dark:border-fans-black-1d",
					size,
					style,
				),
			)}
			onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
			onPress={onPress}
		>
			{isVideo ? (
				<FypVideo
					source={{
						uri: cdnURL(uri),
					}}
					style={tw.style("w-full h-full")}
					resizeMode={ResizeMode.CONTAIN}
					videoStyle={tw.style("mx-auto")}
				/>
			) : (
				<Image
					source={{
						uri: cdnURL(uri),
					}}
					style={tw.style("w-full h-full")}
					resizeMode="cover"
				/>
			)}
			<FypNullableView visible={!!showTransform}>
				<FansIconButton
					size={34}
					backgroundColor="bg-fans-black/50 dark:bg-fans-white/50"
					onPress={onPressTransform}
					style={tw.style("absolute bottom-2 left-2")}
				>
					<TransformSvg color="#fff" size={14} />
				</FansIconButton>
			</FypNullableView>
			<FypNullableView visible={!!orderAble || !!selectAble}>
				<View
					style={tw.style(
						clsx(
							"absolute top-2 right-2 w-5 h-5 rounded-full flex-row items-center justify-center bg-[rgba(0,0,0,0.5)] border border-white",
							{
								"bg-fans-purple border-0": isSelected,
							},
						),
					)}
				>
					{isSelected && orderAble && (
						<FypText fontSize={14} lineHeight={19} color="white">
							{orderNumber}
						</FypText>
					)}
					{isSelected && selectAble && (
						<CheckSvg width={13.4} height={10} color="#fff" />
					)}
				</View>
			</FypNullableView>
		</Pressable>
	);
};

export default ImagePostChip;
