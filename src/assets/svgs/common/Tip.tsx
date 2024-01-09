import React from "react";
import { Svg, Path, SvgProps } from "react-native-svg";

type Props = {
	size?: number;
} & SvgProps;

export default function TipSvg({ ...props }: Props) {
	return (
		<Svg
			width={props.width ?? props.size}
			height={props.height ?? props.size}
			{...props}
			viewBox="0 0 12.143 24.978"
		>
			<Path
				d="M611.737,762.625c-3.6-.772-4.445-1.637-4.445-3.182V759.4c0-1.474,1.357-2.644,3.486-2.644a6.848,6.848,0,0,1,4.235,1.427.861.861,0,0,0,.538.163.888.888,0,0,0,.889-.888.952.952,0,0,0-.4-.749,8.2,8.2,0,0,0-4.629-1.6v-3.292a.768.768,0,1,0-1.536,0v3.338c-2.613.344-4.434,2.1-4.434,4.4v.047c0,2.69,1.731,3.907,5.5,4.726,3.44.726,4.259,1.592,4.259,3.112v.048c0,1.614-1.451,2.784-3.65,2.784a7.445,7.445,0,0,1-5.17-1.942.822.822,0,0,0-.563-.211.894.894,0,0,0-.888.913.834.834,0,0,0,.35.7,9.647,9.647,0,0,0,4.6,2.074v3.448a.768.768,0,0,0,1.536,0v-3.326c.023,0,.044,0,.066,0,3.253,0,5.592-1.825,5.592-4.633v-.047C617.071,764.755,615.386,763.421,611.737,762.625Z"
				transform="translate(-604.928 -751.05)"
				fill={props.color ?? "#fff"}
			/>
		</Svg>
	);
}
