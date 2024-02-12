import React from "react";
import { G, Path, Svg, SvgProps } from "react-native-svg";

interface FansSvgProps extends SvgProps {
	color?: string;
	colorFans?: string;
	fill?: string;
	size?: number;
}

export default function StoryEditBackSvg({ ...props }: FansSvgProps) {
	return (
		<Svg
			width={props.width ?? props.size}
			height={props.height ?? props.size}
			{...props}
			viewBox="0 0 60 60"
		>
			<G
				id="组_59268"
				data-name="组 59268"
				transform="translate(-625 -104)"
			>
				<G
					id="组_52185"
					data-name="组 52185"
					transform="translate(625 104)"
				>
					<Path
						id="路径_46222"
						data-name="路径 46222"
						d="M30,0A30,30,0,1,1,0,30,30,30,0,0,1,30,0Z"
						fill="rgba(255,255,255,0.1)"
					/>
					<Path
						id="路径_47969"
						data-name="路径 47969"
						d="M22.829,0,11.411,11.413,0,0"
						transform="translate(34.094 19.672) rotate(90)"
						fill="none"
						stroke="#fff"
						stroke-linecap="round"
						stroke-width="3"
					/>
				</G>
			</G>
		</Svg>
	);
}
