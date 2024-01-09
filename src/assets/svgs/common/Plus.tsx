import { IFypSvgProps } from "@usertypes/components";
import React from "react";
import { Svg, G, Line, Path, SvgProps } from "react-native-svg";

interface FansSvgProps extends SvgProps {
	color?: string;
	fill?: string;
	size?: number;
}

const PlusSvg = ({ ...props }: FansSvgProps) => {
	const { width, height, size, ...props_ } = props;
	return (
		<Svg
			width={width ?? size}
			height={height ?? size}
			{...props_}
			viewBox="0 0 20.049 20.049"
		>
			<G transform="translate(10.024 1.5) rotate(45)">
				<Line
					x2="12.055"
					y2="12.055"
					fill={props.color ?? "currentColor"}
					stroke={props.color ?? "currentColor"}
					strokeLinecap="round"
					strokeWidth="1.5"
				/>
				<Line
					y1="12.055"
					x2="12.055"
					fill={props.color ?? "currentColor"}
					stroke={props.color ?? "currentColor"}
					strokeLinecap="round"
					strokeWidth="1.5"
				/>
			</G>
		</Svg>
	);
};

export const FilledPlusSvg = (props: IFypSvgProps) => {
	const { color, height, size, width, ...props_ } = props;

	return (
		<Svg
			width={width ?? size}
			height={height ?? size}
			viewBox="0 0 27.466 27.466"
			{...props_}
		>
			<Path
				d="M-150.483,303.674h-12.262a7.606,7.606,0,0,0-7.6,7.6V323.54a7.606,7.606,0,0,0,7.6,7.6h12.266a7.606,7.606,0,0,0,7.6-7.6V311.27A7.6,7.6,0,0,0-150.483,303.674Zm.943,14.719h-6.086v6.086a.992.992,0,0,1-.989.989.991.991,0,0,1-.993-.989v-6.086h-6.086q-.031,0-.063,0a.991.991,0,0,1-.959-1.022.991.991,0,0,1,1.022-.959h6.086v-6.086a.99.99,0,0,1,.988-.989.992.992,0,0,1,.994.989v6.086h6.086a.99.99,0,0,1,.959.959A.991.991,0,0,1-149.54,318.393Z"
				transform="translate(170.345 -303.674)"
				fill={color}
			/>
		</Svg>
	);
};

export default PlusSvg;
