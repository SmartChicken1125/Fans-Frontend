import { DndTriggerSvg, TrashSvg, CropSvg } from "@assets/svgs/common";
import { FypSvg } from "@components/common/base";
import { FansIconButton } from "@components/controls";
import { cdnURL } from "@helper/Utils";
import tw from "@lib/tailwind";
import React, { FC } from "react";
import { View, Image } from "react-native";

interface Props {
	onClickResize: () => void;
	onClickTrash: () => void;
	uri: string;
}

const CoverImage: FC<Props> = (props) => {
	const { onClickResize, onClickTrash, uri } = props;

	return (
		<View
			style={tw.style(
				"w-full h-[210px] rounded-[7px] relative md:h-[230px]",
			)}
		>
			<Image
				source={{
					uri: cdnURL(uri),
				}}
				style={tw.style("w-full h-full rounded-[7px]")}
				resizeMode="cover"
			/>
			<FansIconButton
				backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
				style={tw.style("m-0 absolute top-[10px] left-[10px] hidden")}
			>
				<FypSvg
					svg={DndTriggerSvg}
					width={10}
					height={16.2}
					color="fans-black dark:fans-white"
				/>
			</FansIconButton>

			{/* <IconButton
				icon={() => (
					<CropSvg width={15.87} height={15.87} color="#000" />
				)}
				style={tw.style(
					"m-0 absolute w-[34px] h-[34px] top-[10px] right-[52px]",
				)}
				containerColor="#f0f0f0"
				onPress={onClickResize}
			/> */}
			<FansIconButton
				backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
				style={tw.style("absolute top-[10px] right-[10px]")}
				onPress={onClickTrash}
			>
				<FypSvg
					svg={TrashSvg}
					width={12}
					height={15}
					color="fans-red"
				/>
			</FansIconButton>
		</View>
	);
};

export default CoverImage;
