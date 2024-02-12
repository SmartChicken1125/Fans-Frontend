import {
	ChevronUp1Svg,
	ChevronDownSvg,
	EditSvg,
	ImageSvg,
	TrashSvg,
} from "@assets/svgs/common";
import { FypText, FypSvg, FypSwitch } from "@components/common/base";
import { FansIconButton, FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { ICategory } from "@usertypes/types";
import { truncateText } from "@utils/stringHelper";
import React, { FC } from "react";

interface Props {
	data: ICategory;
	onClickEdit: () => void;
	onClickDelete: () => void;
	onToggle: (val: boolean) => void;
	onClickUp: () => void;
	onClickDown: () => void;
}

const Category: FC<Props> = (props) => {
	const {
		data,
		onClickDelete,
		onClickEdit,
		onToggle,
		onClickUp,
		onClickDown,
	} = props;

	return (
		<FansView flexDirection="row" alignItems="center" height={52}>
			<FypText
				fontSize={18}
				lineHeight={24}
				style={tw.style("text-fans-black dark:text-fans-white")}
			>
				{truncateText(data.name, 15)}
			</FypText>

			<FansView
				flexDirection="row"
				alignItems="center"
				height={25}
				borderRadius={25}
				padding={{ x: 9 }}
				margin={{ l: 14 }}
			>
				<FypSvg
					svg={ImageSvg}
					width={12}
					height={12}
					color="fans-purple"
				/>
				<FypText
					fontSize={16}
					lineHeight={21}
					margin={{ l: 4 }}
					numberOfLines={1}
					style={tw.style("text-fans-purple")}
				>
					{data.postCount}
				</FypText>
			</FansView>

			<FansView
				flexDirection="row"
				alignItems="center"
				gap={7}
				style={tw.style("ml-auto")}
			>
				<FansIconButton
					size={34}
					onPress={onClickUp}
					backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
				>
					<FypSvg
						svg={ChevronUp1Svg}
						width={15}
						height={15}
						color="fans-black dark:fans-white"
					/>
				</FansIconButton>
				<FansIconButton
					size={34}
					onPress={onClickDown}
					backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
				>
					<FypSvg
						svg={ChevronDownSvg}
						width={15}
						height={15}
						color="fans-black dark:fans-white"
					/>
				</FansIconButton>
				<FansIconButton
					size={34}
					onPress={onClickEdit}
					backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
				>
					<FypSvg
						svg={EditSvg}
						width={15}
						height={16}
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
						width={12}
						height={15}
						color="fans-red"
					/>
				</FansIconButton>

				<FypSwitch
					value={data.isActive}
					onValueChange={(val) => onToggle(val)}
				/>
			</FansView>
		</FansView>
	);
};

export default Category;
