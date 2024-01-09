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

export default function CameraOn({ ...props }: FansSvgProps) {
	return (
		<Svg
			width={props.width ?? props.size}
			height={props.height ?? props.size}
			{...props}
			viewBox="0 0 36.803 24.766"
		>
			<G data-name="Group 52234" fill={props.color ?? "currentColor"}>
				<Path
					data-name="Path 46885"
					d="M36.779 562.177a12.427 12.427 0 00-1.684-.011H19.972a4.611 4.611 0 01-.537-.027 4.652 4.652 0 00-5.1 3.91 13.043 13.043 0 00-.023 1.76v13.381a3.865 3.865 0 01-.026.494 4.651 4.651 0 003.927 5.119 12.474 12.474 0 001.686.021H35.14a3.885 3.885 0 01.413.016 4.9 4.9 0 00.722.034 4.664 4.664 0 004.514-4.808c-.006-.455-.028-.908-.028-1.361v-6.2h.029v-7.678a4.617 4.617 0 00-4.011-4.65z"
					transform="translate(-14.253 -562.11)"
				/>
				<Path
					data-name="Path 46886"
					d="M39.031 564.563a1.324 1.324 0 00-1.867-.131c-1.234.971-2.451 1.964-3.679 2.94a.749.749 0 00-.294.641q.007 5.244 0 10.486a.779.779 0 00.32.67c.654.506 1.294 1.032 1.933 1.548.591.471 1.17.961 1.778 1.412a1.308 1.308 0 002.064-.662 2.479 2.479 0 00.058-.655v-7.554l.01-5.905v-1.9a1.333 1.333 0 00-.323-.89z"
					transform="translate(-2.552 -560.875)"
				/>
			</G>
		</Svg>
	);
}
