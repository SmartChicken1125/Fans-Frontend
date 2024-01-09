import { CloseSvg, ImageSvg } from "@assets/svgs/common";
import { FypNullableView, FypSvg } from "@components/common/base";
import { FansText, FansIconButton } from "@components/controls";
import { cdnURL } from "@helper/Utils";
import tw from "@lib/tailwind";
import { RoundButtonType } from "@usertypes/commonEnums";
import { IPickerMedia } from "@usertypes/types";
import React, { FC, useState } from "react";
import { View, Image } from "react-native";
import RoundButton from "../../common/RoundButton";

interface Props {
	onChangeImage: () => void;
	data: IPickerMedia;
	label: string;
	style?: string;
	sizeRate?: number;
	imgHeight?: number;
	onCancel: () => void;
}

const PreviewImageField: FC<Props> = (props) => {
	const {
		onChangeImage,
		data,
		label,
		style,
		sizeRate = 1,
		imgHeight,
		onCancel,
	} = props;

	const [width, setWidth] = useState(100);

	return (
		<View
			style={tw.style(style)}
			onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
		>
			<FansText
				fontSize={17}
				lineHeight={22}
				style={tw.style(
					"mb-6 ml-[18px] font-semibold md:ml-0",
					"text-fans-black dark:text-fans-white",
				)}
			>
				{label}
			</FansText>
			<View
				style={tw.style(
					"relative",
					data.uri
						? `h-[${imgHeight ?? width * sizeRate}px]`
						: "h-[42px]",
				)}
			>
				<FypNullableView visible={!!data.uri}>
					<Image
						source={{
							uri: cdnURL(data.uri),
						}}
						style={tw.style("w-full h-full")}
						resizeMode="cover"
					/>
					<FansIconButton
						size={30}
						backgroundColor="bg-fans-black/50 dark:bg-fans-white/50"
						style={tw.style("absolute top-1 right-1")}
						onPress={onCancel}
					>
						<FypSvg
							width={12}
							height={12}
							color="fans-white dark:fans-black-1d"
							svg={CloseSvg}
						/>
					</FansIconButton>
				</FypNullableView>

				<View
					style={tw.style(
						"absolute left-[18px] right-[18px] border border-fans-purple rounded-[42px]",
						data.uri ? "bottom-4" : "bottom-0 md:left-0 md:right-0",
					)}
				>
					<RoundButton
						variant={
							data.uri
								? RoundButtonType.PRIMARY
								: RoundButtonType.CONTAINED_WHITE
						}
						icon={() => (
							<ImageSvg
								width={13.73}
								height={13.73}
								color="#a854f5"
							/>
						)}
						onPress={onChangeImage}
					>
						{data.uri ? "Change image" : "Upload Image"}
					</RoundButton>
				</View>
			</View>
		</View>
	);
};

export default PreviewImageField;
