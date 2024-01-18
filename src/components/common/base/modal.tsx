import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { IFypModal } from "@usertypes/components";
import { IWidthStyle } from "@usertypes/styles";
import React from "react";
import { Modal, ScrollView } from "react-native";

export const FypModal: IFypModal = (props) => {
	const { visible, children, onDismiss, width, maxWidth } = props;

	const getPaddingStyle = (style: IWidthStyle, prefix?: string): string => {
		if (typeof style === "number") {
			return `${prefix}px-[18px] ${prefix}py-[30px]`;
		}
		if (typeof style === "string") {
			if (style === "screen") {
				return `${prefix}px-0 ${prefix}py-0`;
			}
			return `${prefix}px-[18px] ${prefix}py-[30px]`;
		}
		if (typeof style === "object") {
			const { xs, sm, md, lg, xl, xxl } = style;
			return [
				xs && getPaddingStyle(xs, ""),
				sm && getPaddingStyle(sm, "sm:"),
				md && getPaddingStyle(md, "md:"),
				lg && getPaddingStyle(lg, "lg:"),
				xl && getPaddingStyle(xl, "xl:"),
				xxl && getPaddingStyle(xxl, "xxl:"),
			].join(" ");
		}
		return "";
	};

	const styles = [];
	width != undefined && styles.push(getPaddingStyle(width));

	const borderRadiusStyle = [];
	const getBorderRadiusStyle = (
		style: IWidthStyle,
		prefix?: string,
	): string => {
		if (typeof style === "number") {
			return `${prefix}rounded-[15px] ${prefix}h-auto`;
		}
		if (typeof style === "string") {
			if (style === "screen") {
				return `${prefix}rounded-0 ${prefix}h-full`;
			}
			return `${prefix}rounded-[15px] ${prefix}h-auto`;
		}
		if (typeof style === "object") {
			const { xs, sm, md, lg, xl, xxl } = style;
			return [
				xs && getBorderRadiusStyle(xs, ""),
				sm && getBorderRadiusStyle(sm, "sm:"),
				md && getBorderRadiusStyle(md, "md:"),
				lg && getBorderRadiusStyle(lg, "lg:"),
				xl && getBorderRadiusStyle(xl, "xl:"),
				xxl && getBorderRadiusStyle(xxl, "xxl:"),
			].join(" ");
		}
		return "";
	};
	width != undefined && borderRadiusStyle.push(getBorderRadiusStyle(width));

	return (
		<Modal transparent visible={visible}>
			<FansView
				width="screen"
				height="screen"
				touchableOpacityProps={{ activeOpacity: 1, onPress: onDismiss }}
				alignItems="center"
				backgroundColor={{ color: "black", opacity: 31 }}
				justifyContent="center"
				// padding={{
				// 	x: width !== "screen" ? 18 : 0,
				// 	y: width !== "screen" ? 30 : 0,
				// }}
				style={tw.style(styles)}
			>
				<FansView
					width={width}
					touchableOpacityProps={{ activeOpacity: 1 }}
					// borderRadius={15}
					style={tw.style(
						"max-h-full",
						"bg-fans-white dark:bg-fans-black-1d",
						maxWidth ? `max-w-[${maxWidth}px]` : "",
						borderRadiusStyle,
					)}
				>
					<ScrollView>{children}</ScrollView>
				</FansView>
			</FansView>
		</Modal>
	);
};
