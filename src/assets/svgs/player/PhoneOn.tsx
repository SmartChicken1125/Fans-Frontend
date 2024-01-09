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

export default function PhoneOn({ ...props }: FansSvgProps) {
	return (
		<Svg
			width={props.width ?? props.size}
			height={props.height ?? props.size}
			{...props}
			viewBox="0 0 34.7 37.2"
		>
			<G id="Group_52190">
				<G id="Group_52191">
					<Path
						fill={props.color ?? "currentColor"}
						id="Path_46857"
						d="M24.3 37.2c-2.1 0-4.2-.5-6.1-1.4-2.3-1.1-4.5-2.5-6.4-4.3-3-2.7-5.6-5.7-7.8-9-1.2-1.7-2.2-3.6-2.9-5.6-.7-1.8-1-3.6-1.1-5.5 0-2.1.5-4.2 1.5-6C2.2 4.1 3.2 2.9 4.4 2c.5-.4 1.1-.9 1.6-1.3 0-.1.1-.1.2-.2 1-.8 2.4-.6 3.3.3.5.5 1 1 1.4 1.7.8 1.2 1.6 2.4 2.3 3.8.4.7.6 1.5.6 2.3.1 1-.3 2-1.1 2.6-.8.8-1.6 1.5-2.5 2.1-.6.4-1 .9-1.1 1.6-.1.5-.1 1 0 1.4.2 1 .6 1.9 1.1 2.7 1.6 2.6 3.6 4.9 6 6.9.7.6 1.6 1.2 2.5 1.5.7.3 1.5.3 2.2 0 .4-.2.7-.4 1-.7.7-.7 1.5-1.4 2.3-2.1 1.2-1 2.9-1.2 4.2-.4.7.4 1.4.8 2.1 1.4 1.1.8 2.1 1.8 3 2.8.3.3.6.7.8 1.1.6 1 .5 2.3-.4 3.1l-.3.3c-.6.6-1.2 1.1-1.9 1.7-1.8 1.5-3.9 2.4-6.2 2.6h-1.2z"
					/>
				</G>
			</G>
		</Svg>
	);
}
