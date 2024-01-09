import tw from "@lib/tailwind";
import { IFypLinearGradientView } from "@usertypes/components";
import {
	getAlignItemsStyle,
	getAlignSelfStyle,
	getBackgroundColorStyle,
	getBorderColorStyle,
	getBorderRadiusStyle,
	getBorderStyle,
	getDisplayStyle,
	getFlexDirectionStyle,
	getGapStyle,
	getHeightStyle,
	getJustifyContentStyle,
	getMarginStyle,
	getMaxWidthStyle,
	getPaddingStyle,
	getPlacementStyle,
	getWidthStyle,
} from "@usertypes/styles";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";

export const FypLinearGradientView: IFypLinearGradientView = (props) => {
	const {
		size,
		width = size,
		height = size,
		maxWidth,
		style,
		scrollViewProps,
		touchableOpacityProps,
		children,
		alignItems,
		alignSelf,
		aspectRatio,
		border,
		borderColor,
		bottom,
		display,
		flex,
		flexBasis,
		flexDirection,
		flexWrap,
		gap,
		justifyContent,
		margin,
		opacity,
		overflow,
		padding,
		placement,
		position,
		right,
		top,

		background,
		backgroundColor,
		borderRadius,
		center,
		grow,
		colors,
		start = [0, 1],
		end = [1, 0],
		...props_
	} = props;

	const styles = [];
	width != undefined && styles.push(getWidthStyle(width));
	height != undefined && styles.push(getHeightStyle(height));
	maxWidth != undefined && styles.push(getMaxWidthStyle(maxWidth));
	alignItems && styles.push(getAlignItemsStyle(alignItems));
	alignSelf && styles.push(getAlignSelfStyle(alignSelf));
	aspectRatio && styles.push(`aspect-${aspectRatio}`);
	background && styles.push(`bg-${background}`);
	backgroundColor && styles.push(getBackgroundColorStyle(backgroundColor));
	borderColor && styles.push(border ? getBorderStyle(border) : "border");
	borderColor && styles.push(getBorderColorStyle(borderColor));
	borderRadius && styles.push(getBorderRadiusStyle(borderRadius));
	bottom != undefined && styles.push(`bottom-[${bottom}px]`);
	center && styles.push("justify-center items-center");
	display && styles.push(getDisplayStyle(display));
	flex && styles.push(`flex-${flex}`);
	flexBasis && styles.push(`basis-${flexBasis}`);
	flexDirection && styles.push(getFlexDirectionStyle(flexDirection));
	flexWrap && styles.push(`flex-${flexWrap}`);
	gap && styles.push(getGapStyle(gap));
	grow && styles.push("grow");
	justifyContent && styles.push(getJustifyContentStyle(justifyContent));
	margin && styles.push(getMarginStyle(margin));
	opacity && styles.push(`opacity-${opacity}`);
	overflow && styles.push(`overflow-${overflow}`);
	padding && styles.push(getPaddingStyle(padding));
	placement && styles.push(getPlacementStyle(placement));
	position && styles.push(position);

	return (
		<LinearGradient
			colors={colors}
			start={start}
			end={end}
			style={[tw.style(styles), style]}
			children={children}
			{...props_}
		/>
	);
};
