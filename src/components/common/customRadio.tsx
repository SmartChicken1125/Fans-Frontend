import { FypText } from "@components/common/base";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import React, { FC } from "react";

interface Props {
	label: string;
	onPress: () => void;
	checked: boolean;
	svg?: React.ReactNode;
	labelStyles?: string;
	bgColor?: string;
}

const CustomRadio: FC<Props> = (props) => {
	const {
		label,
		onPress,
		checked,
		svg,
		labelStyles,
		bgColor = "bg-fans-purple",
	} = props;

	return (
		<FansView
			pressableProps={{ onPress: onPress }}
			flexDirection="row"
			alignItems="center"
		>
			<FansView
				width={25}
				height={25}
				alignItems="center"
				justifyContent="center"
				borderRadius={25}
				style={tw.style(
					"border border-fans-dark-grey dark:border-fans-grey-b1",
				)}
			>
				{checked ? (
					<FansView
						width={15}
						height={15}
						borderRadius={15}
						style={tw.style(bgColor)}
					></FansView>
				) : null}
			</FansView>
			{svg ? (
				<FansView style={tw.style("ml-[18px]")}>{svg}</FansView>
			) : null}
			<FypText
				fontSize={18}
				lineHeight={24}
				style={tw.style(
					"ml-[18px] text-fans-black dark:text-fans-white",
					labelStyles,
				)}
			>
				{label}
			</FypText>
		</FansView>
	);
};

export default CustomRadio;
