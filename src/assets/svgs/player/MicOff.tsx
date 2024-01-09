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

export default function MicOff({ ...props }: FansSvgProps) {
	return (
		<Svg
			width={props.width ?? props.size}
			height={props.height ?? props.size}
			{...props}
			viewBox="0 0 30.276 37.165"
		>
			<G data-name="Group 52129" fill={props.color ?? "currentColor"}>
				<G id="XMLID_00000033347833947309112620000017655875442805971844_">
					<Path d="M23.3 16.6c.1 2.4-1 4.7-2.8 6.3-1.8 1.7-4.3 2.4-6.7 2-3-.4-5.6-2.6-6.5-5.5-.3-.8-.4-1.7-.4-2.6V8.2c0-3.6 2.3-6.7 5.7-7.8 4.3-1.4 8.9 1 10.3 5.4.2.8.4 1.7.4 2.5v8.3z" />
					<Path d="M30.3 16.7v.2c0 1.2-.2 2.5-.5 3.7-.7 2.5-2 4.9-3.8 6.7-1.8 1.9-4.1 3.2-6.6 4-.7.2-1.5.3-2.3.5-.2 0-.4.1-.6.1v2.7H22.4c.6.1 1.1.7 1 1.3 0 .6-.5 1.1-1.1 1.2H8.2c-.7 0-1.3-.5-1.3-1.2 0-.6.4-1.1 1-1.3H13.8v-2.7c-.3 0-.5-.1-.8-.1-3.7-.5-7.1-2.4-9.5-5.3-1.7-2-2.8-4.3-3.3-6.9-.1-.9-.2-1.8-.2-2.7-.1-.7.5-1.3 1.2-1.4.7-.1 1.3.5 1.4 1.2v.1c0 1.1.2 2.3.5 3.4 1.9 6.7 8.8 10.6 15.5 8.7 5.4-1.5 9.1-6.4 9.2-12 0-.7.5-1.3 1.2-1.4.6 0 1.2.5 1.3 1.2z" />
				</G>
				<Path
					d="M2.8 34.2L26.1 1.3"
					fill={props.color ?? "currentColor"}
					stroke={props.color ?? "currentColor"}
					strokeWidth={3}
					strokeMiterlimit={10}
				/>
			</G>
		</Svg>
	);
}
