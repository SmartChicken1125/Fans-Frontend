import React from "react";
import { G, Path, Svg, SvgProps } from "react-native-svg";

interface FansSvgProps extends SvgProps {
	color?: string;
	colorFans?: string;
	fill?: string;
	size?: number;
}

export default function StoryEditDownArrowSvg({ ...props }: FansSvgProps) {
	return (
		<Svg
			width={props.width ?? props.size}
			height={props.height ?? props.size}
			{...props}
			viewBox="0 0 9.97 5.834"
		>
			<G
				id="组件_115_6"
				data-name="组件 115 – 6"
				transform="translate(0.847 0.849)"
			>
				<Path
					id="路径_45773"
					data-name="路径 45773"
					d="M9293.482,3389.547l-4.138,4.137-4.137-4.137"
					transform="translate(-9285.208 -3389.547)"
					fill="none"
					stroke={props.color ?? "#000"}
					stroke-linecap="round"
					stroke-width="1.2"
				/>
			</G>
		</Svg>
	);
}
