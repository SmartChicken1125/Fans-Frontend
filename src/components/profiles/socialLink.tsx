import { FypText } from "@components/common/base";
import getSocialIconComponent from "@components/socialIcons";
import tw from "@lib/tailwind";
import { ComponentSizeTypes } from "@usertypes/commonEnums";
import { ISocialLink } from "@usertypes/types";
import React, { FC } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

interface Props extends TouchableOpacityProps {
	data: ISocialLink;
}

const SocialLink: FC<Props> = (props) => {
	const { data, ...others } = props;

	return (
		<TouchableOpacity
			style={tw.style(
				"flex-row items-center py-[5px] pl-[6px] pr-5 rounded-[34px]",
				`border-fans-grey-f0 dark:border-fans-grey-43`,
				"border dark:border-0",
				"bg-fans-white dark:bg-fans-black-2e",
				// tw.prefixMatch("dark") ? "border-0" : "border",
				// tw.prefixMatch("dark") ? "bg-fans-black-2e" : "bg-fans-white",
			)}
			{...others}
		>
			{getSocialIconComponent({
				iconName: data.provider,
				size: ComponentSizeTypes.xs,
			})}
			<FypText
				fontSize={16}
				lineHeight={21}
				margin={{ l: 10 }}
				style={tw.style("text-fans-grey-70 dark:text-fans-grey-b1")}
			>
				{data.provider}
			</FypText>
		</TouchableOpacity>
	);
};

export default SocialLink;
