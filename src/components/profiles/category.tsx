import {
	DndTriggerSvg,
	EditSvg,
	ImageSvg,
	TrashSvg,
} from "@assets/svgs/common";
import { FypText, FypSvg, FypSwitch } from "@components/common/base";
import { FansIconButton } from "@components/controls";
import tw from "@lib/tailwind";
import { ICategory } from "@usertypes/types";
import { truncateText } from "@utils/stringHelper";
import React, { FC } from "react";
import { View } from "react-native";

interface Props {
	data: ICategory;
	onClickEdit: () => void;
	onClickDelete: () => void;
	onToggle: (val: boolean) => void;
}

const Category: FC<Props> = (props) => {
	const { data, onClickDelete, onClickEdit, onToggle } = props;

	return (
		<View style={tw.style("flex-row items-center h-13")}>
			<FypSvg
				svg={DndTriggerSvg}
				width={9.8}
				height={16.14}
				color="fans-black dark:fans-white"
			/>

			<FypText
				fontSize={18}
				lineHeight={24}
				margin={{ l: 32 }}
				style={tw.style("text-fans-black dark:text-fans-white")}
			>
				{truncateText(data.name, 15)}
			</FypText>

			<View
				style={tw.style(
					"flex-row items-center h-[25px] rounded-[25px] px-[9px] ml-[14px]",
					"bg-fans-purple-f6 dark:bg-fans-purple-47",
				)}
			>
				<ImageSvg width={11.7} height={11.7} color="#a854f5" />
				<FypText
					fontSize={16}
					lineHeight={21}
					margin={{ l: 4 }}
					style={tw.style("text-fans-purple")}
				>
					{data.postCount}
				</FypText>
			</View>

			<View style={tw.style("flex-row items-center gap-x-[7px] ml-auto")}>
				<FansIconButton
					size={34}
					onPress={onClickEdit}
					backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
				>
					<FypSvg
						svg={EditSvg}
						width={14.94}
						height={15.5}
						color="fans-black dark:fans-white"
					/>
				</FansIconButton>
				<FansIconButton
					size={34}
					onPress={onClickDelete}
					backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
				>
					<FypSvg
						svg={TrashSvg}
						width={11.87}
						height={14.76}
						color="fans-red"
					/>
				</FansIconButton>

				<FypSwitch
					value={data.isActive}
					onValueChange={(val) => onToggle(val)}
				/>
			</View>
		</View>
	);
};

export default Category;
