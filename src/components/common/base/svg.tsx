import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { IFypSvg } from "@usertypes/components";
import { getSvgSize } from "@usertypes/styles";
import React, { useMemo } from "react";

export const FypSvg: IFypSvg = (props) => {
	const { width, height, svg: Svg, color, themeColor, ...props_ } = props;

	const colorStyle = useMemo(() => {
		if (color) {
			const colors = color.split(" ");
			const darkColor =
				colors.find((el) => el.includes("dark:"))?.split("dark:")[1] ??
				colors[0];
			const lightColor =
				colors.find((el) => !el.includes("dark:")) ?? colors[0];
			if (tw.prefixMatch("dark")) {
				return tw.color(darkColor);
			} else {
				return tw.color(lightColor);
			}
		} else {
			return "currentColor";
		}
	}, [color, tw.prefixMatch("dark")]);

	return (
		<FansView
			width={getSvgSize(width)}
			height={getSvgSize(height)}
			alignItems="center"
			justifyContent="center"
			{...props_}
		>
			{Svg && (
				<Svg
					width={getSvgSize(width)}
					height={getSvgSize(height)}
					color={colorStyle}
				/>
			)}
		</FansView>
	);
};
