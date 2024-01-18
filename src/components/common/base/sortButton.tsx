import { SortDescSvg, SortAscSvg } from "@assets/svgs/common";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { SortType } from "@usertypes/types";
import React, { FC } from "react";
import Animated, { PinwheelIn, PinwheelOut } from "react-native-reanimated";
import { FypSvg } from "./svg";
import { FypText } from "./text";

interface Props {
	value: SortType;
	handleToggle: (val: SortType) => void;
}

const FypSortButton: FC<Props> = (props) => {
	const { value, handleToggle } = props;
	return (
		<FansView
			flexDirection="row"
			alignItems="center"
			gap={13}
			pressableProps={{
				onPress: () =>
					handleToggle(value === "Newest" ? "Oldest" : "Newest"),
			}}
		>
			<FypSvg
				width={17}
				height={14}
				svg={value === "Oldest" ? SortAscSvg : SortDescSvg}
				color="fans-grey-70 dark:fans-grey-b1"
			/>
			<Animated.View entering={PinwheelIn} exiting={PinwheelOut}>
				<FypText
					fontWeight={500}
					fontSize={17}
					style={tw.style("text-fans-grey-70 dark:text-fans-grey-b1")}
				>
					{value === "Newest" ? "Newest first" : "Oldest first"}
				</FypText>
			</Animated.View>
		</FansView>
	);
};

export default FypSortButton;
