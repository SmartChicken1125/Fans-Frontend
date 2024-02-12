import React from "react";
import { G, Line, Path, Svg, SvgProps } from "react-native-svg";

interface FansSvgProps extends SvgProps {
	color?: string;
	colorFans?: string;
	fill?: string;
	size?: number;
}

export default function StoryEditNextArrowSvg({ ...props }: FansSvgProps) {
	return (
		<Svg
			width={props.width ?? props.size}
			height={props.height ?? props.size}
			{...props}
			viewBox="0 0 16.911 12.611"
		>
			<G
				id="组_55214"
				data-name="组 55214"
				transform="translate(-230.2 -102)"
			>
				<Path
					id="路径_48315"
					data-name="路径 48315"
					d="M260.131,103.131,265.3,108.3l-5.174,5.174"
					transform="translate(-18.994)"
					fill="none"
					stroke={props.color ?? "#fff"}
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="1.6"
				/>
				<Line
					id="直线_170"
					data-name="直线 170"
					x1="15.311"
					transform="translate(231 108.305)"
					fill="none"
					stroke={props.color ?? "#fff"}
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="1.6"
				/>
			</G>
		</Svg>
	);
}
