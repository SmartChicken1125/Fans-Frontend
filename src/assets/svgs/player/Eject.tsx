import React from "react";
import {
	Svg,
	Defs,
	ClipPath,
	Path,
	Pattern,
	Image,
	G,
	SvgProps,
	Circle,
} from "react-native-svg";

interface FansSvgProps extends SvgProps {
	color?: string;
	fill?: string;
	size?: number;
}

export default function Eject({ ...props }: FansSvgProps) {
	return (
		<Svg
			width={props.width ?? props.size}
			height={props.height ?? props.size}
			{...props}
			viewBox={`0 0 ${props.size} ${props.size}`}
		>
			<Path
				data-name="Path 47969"
				d="M17.168 2.121L9.642 9.643 2.121 2.121"
				fill="none"
				stroke="#fff"
				strokeLinecap="round"
				strokeWidth={3}
			/>
		</Svg>
	);
}
