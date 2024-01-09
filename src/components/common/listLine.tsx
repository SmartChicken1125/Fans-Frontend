import { ListMarkSvg } from "@assets/svgs/common";
import { FypText } from "@components/common/base";
import tw from "@lib/tailwind";
import React, { FC } from "react";
import { View } from "react-native";

interface Props {
	text: string;
	size?: "lg";
}

const ListLine: FC<Props> = (props) => {
	const { text, size } = props;

	return (
		<View style={tw.style("flex-row items-start")}>
			<View style={tw.style({ "mt-1": size === "lg" })}>
				<ListMarkSvg
					width={size === "lg" ? 13 : 12}
					height={size === "lg" ? 13 : 12}
				/>
			</View>
			<FypText
				style={tw.style(
					"text-[13px] leading-[17px] ml-2",
					"text-fans-black dark:text-fans-white",
					size === "lg" ? "text-base leading-[21px] ml-[10px]" : "",
				)}
			>
				{text}
			</FypText>
		</View>
	);
};

export default ListLine;
