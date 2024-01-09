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

export default function Tip({ ...props }: FansSvgProps) {
	return (
		<Svg
			width={props.width ?? props.size}
			height={props.height ?? props.size}
			{...props}
			viewBox={`0 0 ${props.size} ${props.size}`}
		>
			<G data-name="Group 54554">
				<Path
					data-name="Path 46247"
					d="M8.322 6.805c-1.16-.248-1.431-.527-1.431-1.024v-.015c0-.474.437-.851 1.122-.851a2.2 2.2 0 011.363.459.277.277 0 00.173.053.286.286 0 00.286-.286.307.307 0 00-.128-.241 2.639 2.639 0 00-1.49-.514V3.329a.247.247 0 10-.494 0v1.075a1.489 1.489 0 00-1.427 1.418v.015c0 .866.557 1.258 1.77 1.521 1.107.234 1.371.512 1.371 1v.015c0 .52-.467.9-1.175.9a2.4 2.4 0 01-1.664-.625.265.265 0 00-.181-.068.288.288 0 00-.286.294.268.268 0 00.113.226 3.105 3.105 0 001.48.668v1.11a.247.247 0 10.494 0v-1.07h.021c1.047 0 1.8-.587 1.8-1.491v-.015c-.001-.812-.543-1.241-1.717-1.497z"
					fill="#fff"
					stroke="#fff"
					strokeWidth={0.5}
					transform="translate(-.491 .509)"
				/>
				<G data-name="Group 51190">
					<Path
						data-name="Path 46243"
						d="M7.045.004h.939c.038.008.075.019.113.024.343.05.69.082 1.028.153a7.523 7.523 0 015.871 6.608 7.233 7.233 0 01-.829 4.21 7.341 7.341 0 01-6.5 4.025 7.053 7.053 0 01-4.281-1.233A7.389 7.389 0 01.12 8.827c-.051-.278-.079-.56-.117-.84v-.94c.009-.043.019-.085.026-.127.05-.343.084-.689.154-1.028A7.515 7.515 0 016.209.119c.275-.048.561-.081.836-.115zm-5.994 7.5a6.463 6.463 0 106.477-6.452 6.467 6.467 0 00-6.477 6.452z"
						fill="#fff"
						stroke="#fff"
						strokeWidth={0.2}
						transform="translate(-.491 .509) translate(.591 -.409)"
					/>
				</G>
			</G>
		</Svg>
	);
}
