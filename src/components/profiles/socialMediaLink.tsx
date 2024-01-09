import { EditSvg, TrashSvg } from "@assets/svgs/common";
import { FypText, FypSvg } from "@components/common/base";
import { FansIconButton, FansDivider } from "@components/controls";
import getSocialIconComponent from "@components/socialIcons";
import tw from "@lib/tailwind";
import { ComponentSizeTypes } from "@usertypes/commonEnums";
import { ISocialLink } from "@usertypes/types";
import React, { FC } from "react";
import { View } from "react-native";

interface Props {
	data: ISocialLink;
	onClickEdit: () => void;
	onClickDelete: () => void;
}

const SocialMediaLink: FC<Props> = (props) => {
	const { data, onClickEdit, onClickDelete } = props;

	return (
		<View>
			<View style={tw.style("pl-[5.5px] flex-row items-center")}>
				<View style={tw.style("w-[42px] h-[42px]")}>
					{getSocialIconComponent({
						iconName: data.provider,
						size: ComponentSizeTypes.md,
					})}
				</View>

				<FypText
					fontSize={18}
					lineHeight={24}
					numberOfLines={1}
					style={tw.style(
						"text-fans-black dark:text-fans-white ml-3",
					)}
				>
					{data.url}
				</FypText>

				<View style={tw.style("ml-auto flex-row gap-x-[7px]")}>
					<FansIconButton
						size={34}
						backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
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
						size={34}
						backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
						onPress={onClickDelete}
					>
						<TrashSvg
							width={11.87}
							height={14.76}
							color="#eb2121"
						/>
					</FansIconButton>
				</View>
			</View>

			<FansDivider style={tw.style("my-2 h-[1px]")} />
		</View>
	);
};

export default SocialMediaLink;
