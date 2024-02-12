import React from "react";
import { Svg, SvgProps, TSpan, Text } from "react-native-svg";

interface FansSvgProps extends SvgProps {
	color?: string;
	colorFans?: string;
	fill?: string;
	size?: number;
}

export default function StoryboardEditAtSvg({ ...props }: FansSvgProps) {
	return (
		<Svg
			width={props.width ?? props.size}
			height={props.height ?? props.size}
			{...props}
			viewBox="0 0 36 48"
		>
			<Text
				id="_"
				data-name="@"
				transform="translate(18 39)"
				fill={props.color ?? "#fff"}
				font-size="36"
				font-family="SegoeUI, Segoe UI"
			>
				<TSpan x="-17.191" y="0">
					@
				</TSpan>
			</Text>
		</Svg>
	);
}
