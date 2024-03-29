import React from "react";
import { Svg, G, Path, SvgProps } from "react-native-svg";

interface FansSvgProps extends SvgProps {
	color?: string;
	fill?: string;
	size?: number;
}

export default function MusicSvg({ ...props }: FansSvgProps) {
	return (
		<Svg
			width={props.width ?? props.size}
			height={props.height ?? props.size}
			{...props}
			viewBox="0 0 13.183 14.861"
		>
			<Path
				d="M375.043,1155.649c-.022.083-.047.165-.066.248a2.676,2.676,0,1,1-2.711-3.239c.542-.012,1.085,0,1.64,0v-3.94l-6.688,1.056V1150q0,3.266,0,6.531a2.676,2.676,0,1,1-3.283-2.56,5.872,5.872,0,0,1,1.04-.077c.367-.012.733,0,1.121,0v-.234c0-2.227.017-4.454-.009-6.68a1.589,1.589,0,0,1,1.452-1.7c1.893-.274,3.78-.59,5.669-.889a1.489,1.489,0,0,1,1.809,1.18.165.165,0,0,0,.027.047Zm-7.823-7.014,6.7-1.058c0-.6,0-1.164,0-1.731a.358.358,0,0,0-.461-.353l-4.413.693c-.492.077-.986.152-1.477.235-.216.036-.341.15-.343.333C367.216,1147.371,367.22,1147.988,367.22,1148.635Zm-1.155,6.38c-.523,0-1.058-.012-1.591,0a1.54,1.54,0,0,0-.135,3.067,1.5,1.5,0,0,0,1.713-1.252A15.987,15.987,0,0,0,366.065,1155.015Zm7.824-1.235c-.523,0-1.053-.009-1.581,0a1.54,1.54,0,0,0-.153,3.067,1.5,1.5,0,0,0,1.72-1.241A15.526,15.526,0,0,0,373.889,1153.779Z"
				transform="translate(-361.86 -1144.363)"
				fill={props.color ?? "#a854f5"}
			/>
		</Svg>
	);
}
