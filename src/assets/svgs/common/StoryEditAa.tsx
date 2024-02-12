import React from "react";
import { Svg, SvgProps, TSpan, Text } from "react-native-svg";

interface FansSvgProps extends SvgProps {
	color?: string;
	colorFans?: string;
	fill?: string;
	size?: number;
}

export default function StoryboardEditAaSvg({ ...props }: FansSvgProps) {
	return (
		<Svg
			width={props.width ?? props.size}
			height={props.height ?? props.size}
			{...props}
			viewBox="0 0 42 48"
		>
			<Text
				id="Aa"
				transform="translate(21 39)"
				fill={props.color ?? "#fff"}
				font-size="36"
				font-family="SegoeUI, Segoe UI"
			>
				<TSpan x="-20.769" y="0">
					Aa
				</TSpan>
			</Text>
		</Svg>
	);
}
