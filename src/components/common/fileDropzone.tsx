import { PlusSvg, DocumentEditSvg } from "@assets/svgs/common";
import { FansText, FansView, FansIconButton } from "@components/controls";
import tw from "@lib/tailwind";
import { MediaType } from "@usertypes/commonEnums";
import React, { FC } from "react";
import { Pressable, Image } from "react-native";
import RoundButton from "./RoundButton";

interface Props {
	onPress: () => void;
	fileCounts: number;
	textButtonMode?: boolean;
	mediaType?: MediaType;
	buttonText?: string;
}

const FileDropzone: FC<Props> = (props) => {
	const {
		onPress,
		fileCounts,
		textButtonMode,
		mediaType = MediaType.Image,
		buttonText = "Drop image here",
	} = props;

	return (
		<Pressable
			style={tw.style(
				"py-[30px] border-dashed border rounded-[8px]",
				"border-fans-grey-de dark:border-fans-grey-50",
			)}
			onPress={onPress}
		>
			{fileCounts == 0 ? (
				<FansView
					flexDirection="row"
					justifyContent="center"
					margin={{ b: 14 }}
					padding={{ t: 10 }}
				>
					<FansView
						style={tw.style(
							mediaType !== MediaType.Form && "hidden",
						)}
					>
						<DocumentEditSvg size={68} />
					</FansView>
					<FansView
						style={tw.style(
							mediaType !== MediaType.Image && "hidden",
						)}
					>
						<Image
							source={require("@assets/images/common/photos.png")}
							style={{
								width: 77.44,
								height: 71,
							}}
							resizeMode="cover"
						/>
					</FansView>
				</FansView>
			) : (
				<FansIconButton
					backgroundColor="bg-fans-purple-f6"
					size={48}
					style={tw.style("m-auto my-0 mb-2")}
					onPress={onPress}
				>
					<PlusSvg width={23} height={23} color="#a854f5" />
				</FansIconButton>
			)}
			{textButtonMode ? (
				<FansText
					fontSize={17}
					lineHeight={21}
					textAlign="center"
					style={tw.style("text-fans-black dark:text-fans-white")}
				>
					{`${buttonText} or`}
					<FansText color="purple-a8"> Browse</FansText>
				</FansText>
			) : (
				<FansView style={tw.style("mx-auto mt-5 md:flex")}>
					<RoundButton onPress={onPress}>
						Pick from computer
					</RoundButton>
				</FansView>
			)}
		</Pressable>
	);
};

export default FileDropzone;
