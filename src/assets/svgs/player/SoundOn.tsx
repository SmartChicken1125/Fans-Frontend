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

export default function SoundOn({ ...props }: FansSvgProps) {
	return (
		<Svg
			width={props.width ?? props.size}
			height={props.height ?? props.size}
			{...props}
			viewBox="0 0 39.728 28.759"
		>
			<G data-name="Group 52231" fill={props.color ?? "currentColor"}>
				<Path
					data-name="Path 46871"
					d="M97.831 613.375l-.013-7.336-.006-3.621c-.042-.71-.074-1.344-.12-1.977a10.1 10.1 0 00-.411-2.3 3.964 3.964 0 00-4.522-2.81 5.457 5.457 0 00-1.522.553 15.818 15.818 0 00-2.67 1.783q-2.541 2.039-5.054 4.111a7.371 7.371 0 01-4.9 1.746 10.058 10.058 0 00-1.464.073 4.531 4.531 0 00-3.859 4.056 29.745 29.745 0 000 3.928 4.553 4.553 0 003.467 4.032 8.028 8.028 0 002.014.149 7.173 7.173 0 012.416.4 6.552 6.552 0 011.891 1.008l2 1.618L88 621.153c.011.01.015.023.026.032.171.146.351.281.531.417a18.03 18.03 0 002.671 1.785 5.061 5.061 0 002.111.634 3.994 3.994 0 003.876-2.681 8.667 8.667 0 00.477-2.446c.073-1.176.11-2.354.162-3.532h-.016z"
					transform="translate(-73.22 -595.266)"
				/>
				<Path
					data-name="Path 46872"
					d="M94.924 596.544a1.43 1.43 0 10-1.739 2.271 13.084 13.084 0 01.364 20.136 1.431 1.431 0 101.83 2.2 15.943 15.943 0 00-.455-24.608z"
					transform="translate(-61.232 -594.66)"
				/>
				<Path
					data-name="Path 46873"
					d="M91.759 599.325a1.43 1.43 0 10-1.265 2.566 6.083 6.083 0 01.392 10.476 1.43 1.43 0 101.476 2.451 8.941 8.941 0 00-.6-15.493z"
					transform="translate(-63.042 -592.851)"
				/>
			</G>
		</Svg>
	);
}
