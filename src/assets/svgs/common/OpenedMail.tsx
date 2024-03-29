import React from "react";
import { Svg, G, Path, SvgProps } from "react-native-svg";

interface FansSvgProps extends SvgProps {
	color?: string;
	fill?: string;
	size?: number;
}

const OpenedMailSvg = ({ ...props }: FansSvgProps) => {
	const { color, height, size, width, ...props_ } = props;
	return (
		<Svg
			width={width ?? size}
			height={height ?? size}
			viewBox="0 0 16.677 15.842"
			{...props_}
		>
			<G transform="translate(-229.15 99.642)">
				<G transform="translate(232.05 -93.48)">
					<Path
						d="M248.25-65.63a1.45,1.45,0,0,1-.918-.315L243-69.488a.527.527,0,0,1-.074-.742.527.527,0,0,1,.742-.074L248-66.762a.441.441,0,0,0,.5,0l4.329-3.542a.527.527,0,0,1,.742.074.528.528,0,0,1-.074.742l-4.329,3.542A1.45,1.45,0,0,1,248.25-65.63Z"
						transform="translate(-242.8 70.434)"
						stroke={color ?? "currentColor"}
						fill={color ?? "currentColor"}
						strokeWidth="0.3"
					/>
					<Path
						d="M248.225-65.659H248.2a1.466,1.466,0,0,1-.91-.318l-4.329-3.542a.535.535,0,0,1-.194-.363.533.533,0,0,1,.119-.394.532.532,0,0,1,.363-.195.535.535,0,0,1,.394.119l4.329,3.542a.432.432,0,0,0,.486,0l4.328-3.542a.539.539,0,0,1,.757.076.534.534,0,0,1,.119.394.535.535,0,0,1-.194.363l-4.329,3.542A1.467,1.467,0,0,1,248.225-65.659Zm-.015-.021h.015a1.446,1.446,0,0,0,.9-.313l4.329-3.542a.513.513,0,0,0,.187-.349.514.514,0,0,0-.114-.379.518.518,0,0,0-.728-.072l-4.329,3.542a.455.455,0,0,1-.511,0l-4.33-3.542a.518.518,0,0,0-.728.072.514.514,0,0,0-.114.379.513.513,0,0,0,.187.349l4.329,3.542a1.445,1.445,0,0,0,.9.313h.014Z"
						transform="translate(-242.76 70.473)"
						fill={color ?? "currentColor"}
						stroke={color ?? "currentColor"}
						strokeWidth="0.3"
					/>
				</G>
				<Path
					d="M243.084-83.9H231.892a2.646,2.646,0,0,1-2.642-2.642v-6.943a2.248,2.248,0,0,1,.964-1.755l6.269-3.982a1.987,1.987,0,0,1,2.011,0l6.269,3.982a2.248,2.248,0,0,1,.964,1.755v6.943A2.646,2.646,0,0,1,243.084-83.9Zm-5.6-14.454a.765.765,0,0,0-.394.095h0l-6.269,3.982a1.134,1.134,0,0,0-.435.792v6.943a1.5,1.5,0,0,0,1.5,1.5h11.192a1.5,1.5,0,0,0,1.5-1.5v-6.943a1.134,1.134,0,0,0-.435-.792l-6.269-3.982A.765.765,0,0,0,237.488-98.354Zm-.7-.386h0Z"
					fill={color ?? "currentColor"}
					stroke={color ?? "currentColor"}
					strokeWidth="0.3"
				/>
			</G>
		</Svg>
	);
};

export default OpenedMailSvg;
