import { DndTriggerSvg, EditSvg, TrashSvg } from "@assets/svgs/common";
import { FypText, FypSvg } from "@components/common/base";
import { FansIconButton, FansDivider } from "@components/controls";
import { cdnURL } from "@helper/Utils";
import tw from "@lib/tailwind";
import { IHighlight } from "@usertypes/types";
import React, { FC } from "react";
import { View, Image } from "react-native";

interface Props {
	onClickEdit: () => void;
	onClickTrash: () => void;
	data: IHighlight;
}

const EditHighlightCell: FC<Props> = (props) => {
	const { onClickEdit, onClickTrash, data } = props;

	return (
		<View>
			<View style={tw.style("py-[15px] flex-row items-center")}>
				<View>
					<FypSvg
						svg={DndTriggerSvg}
						width={9.8}
						height={16.14}
						color="fans-black dark:fans-white"
					/>
				</View>
				<View
					style={tw.style(
						"w-[78px] h-[78px] rounded-full ml-8 mr-4",
						data.cover ? "" : "border border-fans-grey",
					)}
				>
					{data.cover ? (
						<Image
							source={{ uri: cdnURL(data.cover) }}
							style={tw.style("w-[78px] h-[78px] rounded-full ")}
						/>
					) : null}
				</View>

				<View style={tw.style("mr-auto")}>
					<FypText
						fontSize={19}
						lineHeight={26}
						fontWeight={700}
						style={tw.style("text-fans-black dark:text-fans-white")}
					>
						{data.title}
					</FypText>
					<FypText
						fontSize={16}
						lineHeight={21}
						margin={{ t: -1 }}
						style={tw.style(
							"text-fans-dark-grey dark:text-fans-grey-b1",
						)}
					>
						{`${data.stories.length} stories`}
					</FypText>
				</View>

				<View style={tw.style("flex-row gap-x-2")}>
					<FansIconButton
						onPress={onClickEdit}
						size={34}
						backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
					>
						<FypSvg
							svg={EditSvg}
							width={16}
							height={16.5}
							color="fans-black dark:fans-white"
						/>
					</FansIconButton>
					<FansIconButton
						onPress={onClickTrash}
						size={34}
						backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
					>
						<FypSvg
							svg={TrashSvg}
							width={13.87}
							height={16.76}
							color="fans-red"
						/>
					</FansIconButton>
				</View>
			</View>

			<FansDivider style={tw.style("h-[1px]")} />
		</View>
	);
};

export default EditHighlightCell;
