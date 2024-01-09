import { FypText } from "@components/common/base";
import tw from "@lib/tailwind";
import React from "react";

type Props = {
	title: string;
};

export default function FormLabel({ title = "" }: Props) {
	return (
		<FypText
			fontSize={17}
			lineHeight={22}
			fontWeight={600}
			margin={{ b: 14 }}
			style={tw.style("text-fans-black dark:text-fans-white")}
		>
			{title}
		</FypText>
	);
}
