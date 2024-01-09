import tw from "@lib/tailwind";
import { IFansDivider } from "@usertypes/components";
import React from "react";
import { View } from "react-native";
import { Divider as RNDivider } from "react-native-paper";
import { FansView } from "./View";

export const FansDivider: IFansDivider = (props) => {
	const { size = 1, color, vertical = false, ver1 } = props;

	const styles = [`bg-fans-grey-f0 dark:bg-fans-grey-43`];
	styles.push(vertical ? `w-[${size}px]` : `h-[${size}px]`);
	vertical && styles.push("h-full");
	color && styles.push(`bg-${color}`);

	if (ver1)
		return (
			<FansView
				style={[
					tw.style("h-[1px]", `bg-fans-grey-f0 dark:bg-fans-grey-43`),
					props.style,
				]}
			/>
		);

	return vertical ? (
		<View style={[tw.style(styles), props.style]} />
	) : (
		<RNDivider style={[tw.style(styles), props.style]} />
	);
};

const FansDivider1: IFansDivider = (props) => {
	const { style, ..._props } = props;
	return (
		<FansView
			style={[tw.style("bg-fans-grey dark:bg-fans-grey-43"), style]}
			{..._props}
		/>
	);
};

export const FansHorizontalDivider: IFansDivider = (props) => {
	const { width = "full", height = 1, ...props_ } = props;

	return <FansDivider1 width={width} height={height} {...props_} />;
};

export const FansVerticalDivider: IFansDivider = (props) => {
	const { width = 1, height = "full", ...props_ } = props;

	return <FansDivider1 width={width} height={height} {...props_} />;
};
