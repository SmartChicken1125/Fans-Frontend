import { ChevronRightSvg } from "@assets/svgs/common";
import { FypText, FypSvg } from "@components/common/base";
import tw from "@lib/tailwind";
import React, { FC } from "react";
import { Pressable, PressableProps } from "react-native";

interface Props extends PressableProps {
	title: string;
}

const EditSubLink: FC<Props> = (props) => {
	const { title, ...others } = props;

	return (
		<Pressable
			style={tw.style(
				"flex-row items-center justify-between py-[15px] px-[18px]",
			)}
			{...others}
		>
			<FypText
				fontSize={17}
				lineHeight={22}
				fontWeight={600}
				style={tw.style("text-fans-black dark:text-fans-white")}
			>
				{title}
			</FypText>
			<FypSvg
				svg={ChevronRightSvg}
				width={8.14}
				height={14.3}
				color="fans-grey-70 dark:fans-grey-b1"
			/>
		</Pressable>
	);
};

export default EditSubLink;
