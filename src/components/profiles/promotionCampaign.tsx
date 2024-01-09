import { CalendarSvg, EditSvg, TrashSvg } from "@assets/svgs/common";
import { FypText, FypSvg } from "@components/common/base";
import { FansIconButton } from "@components/controls";
import tw from "@lib/tailwind";
import { PromotionType } from "@usertypes/commonEnums";
import { ICampaign } from "@usertypes/types";
import React, { FC } from "react";
import { View } from "react-native";

interface Props {
	data: ICampaign;
	onClickEdit: () => void;
	onClickDelete: () => void;
}

const PromotionCampaign: FC<Props> = (props) => {
	const { data, onClickDelete, onClickEdit } = props;

	return (
		<View
			style={tw.style(
				"flex-row items-center border rounded-[25px] h-[42px] pl-3 pr-1",
				"border-fans-grey dark:border-fans-grey-43",
			)}
		>
			<FypText
				fontSize={18}
				lineHeight={24}
				margin={{ l: 16 }}
				style={tw.style("text-fans-black dark:text-fans-white")}
			>
				{data.type === PromotionType.Discount
					? `${data.discount}% OFF`
					: "Free Trial"}
			</FypText>

			<View style={tw.style("ml-auto flex-row items-center")}>
				{data.endDate ? (
					<View
						style={tw.style(
							"flex-row items-center py-[2px] pr-4 pl-[10px] rounded-[25px]",
							"bg-fans-purple-f6 dark:bg-fans-grey-47",
						)}
					>
						<CalendarSvg
							width={10.92}
							height={12.23}
							color="#a854f5"
						/>
						<FypText
							fontSize={16}
							lineHeight={21}
							margin={{ l: 4 }}
							style={tw.style("text-fans-purple")}
						>
							{new Date(data.endDate).toJSON().split("T")[0]}
						</FypText>
					</View>
				) : null}

				<FansIconButton
					backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
					size={34}
					style={tw.style("ml-2")}
					onPress={onClickEdit}
				>
					<FypSvg
						svg={EditSvg}
						width={12.94}
						height={13.5}
						color="fans-black dark:fans-white"
					/>
				</FansIconButton>
				<FansIconButton
					backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
					size={34}
					style={tw.style("ml-2")}
					onPress={onClickDelete}
				>
					<TrashSvg width={11.87} height={14.76} color="#eb2121" />
				</FansIconButton>
			</View>
		</View>
	);
};

export default PromotionCampaign;
