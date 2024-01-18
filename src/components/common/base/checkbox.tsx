import { CheckSvg } from "@assets/svgs/common";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import React, { FC } from "react";
import { ViewStyle } from "react-native";
import { FypSvg } from "./svg";
import { FypText } from "./text";

interface Props {
	checked: boolean;
	label?: string;
	onPress: () => void;
	style?: ViewStyle;
}

const FypCheckbox: FC<Props> = (props) => {
	const { checked, onPress, style, label } = props;

	return (
		<FansView
			flexDirection="row"
			alignItems="center"
			gap={14}
			pressableProps={{ onPress: onPress }}
		>
			<FansView
				width={25}
				height={25}
				borderRadius={25}
				alignItems="center"
				justifyContent="center"
				style={[
					tw.style(
						checked
							? "bg-fans-purple"
							: "border border-fans-grey-70 dark:border-fans-grey-b1",
					),
					style,
				]}
			>
				{checked ? (
					<FypSvg
						width={14}
						height={10}
						svg={CheckSvg}
						color="fans-white"
					/>
				) : null}
			</FansView>
			{label ? (
				<FypText fontSize={15} lineHeight={20}>
					{label}
				</FypText>
			) : null}
		</FansView>
	);
};

export default FypCheckbox;
