import { ColorPickerSvg } from "@assets/svgs/common";
import { FypText, FypSvg } from "@components/common/base";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import React, { FC } from "react";

interface Props {
	background: string;
	title: string;
}

const BackgroundColor: FC<Props> = (props) => {
	const { background, title } = props;
	return (
		<FansView flex="1">
			<FansView
				background={background}
				margin={{ b: 8 }}
				borderRadius={7}
				alignItems="center"
				justifyContent="center"
				height={82}
			>
				<FansView
					width={46}
					height={46}
					borderRadius={46}
					background="fans-white"
					alignItems="center"
					justifyContent="center"
				>
					<FypSvg width={22} height={22} svg={ColorPickerSvg} />
				</FansView>
			</FansView>
			<FypText
				fontSize={16}
				fontWeight={500}
				lineHeight={21}
				textAlign="center"
				style={tw.style("text-fans-black dark:text-fans-white")}
			>
				{title}
			</FypText>
		</FansView>
	);
};

export default BackgroundColor;
