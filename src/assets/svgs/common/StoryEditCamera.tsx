import React from "react";
import { Circle, G, Path, Svg, SvgProps } from "react-native-svg";

interface FansSvgProps extends SvgProps {
	color?: string;
	colorFans?: string;
	fill?: string;
	size?: number;
}

export default function StoryEditCameraSvg({ ...props }: FansSvgProps) {
	return (
		<Svg
			width={props.width ?? props.size}
			height={props.height ?? props.size}
			{...props}
			viewBox="0 0 34 34"
		>
			<G
				id="组_49731"
				data-name="组 49731"
				transform="translate(0.038 0.071)"
			>
				<Circle
					id="椭圆_1563"
					data-name="椭圆 1563"
					cx="17"
					cy="17"
					r="17"
					transform="translate(-0.038 -0.071)"
					fill="#f0f0f0"
				/>
				<G
					id="组_50405"
					data-name="组 50405"
					transform="translate(-150.85 -153.513)"
				>
					<Path
						id="路径_46140"
						data-name="路径 46140"
						d="M167.8,178.161q-2.914,0-5.828,0a2.644,2.644,0,0,1-2.561-1.807,2.9,2.9,0,0,1-.147-.9q-.017-3.807,0-7.615a2.669,2.669,0,0,1,2.7-2.7c.295,0,.59,0,.885,0a.712.712,0,0,0,.746-.52,6.219,6.219,0,0,1,.4-.933,1.881,1.881,0,0,1,1.68-.947q2.146-.02,4.292,0a1.985,1.985,0,0,1,1.9,1.4c.064.178.12.359.186.536a.68.68,0,0,0,.662.466c.456.01.916-.014,1.367.038a2.615,2.615,0,0,1,2.279,2.477c.031,1.5.013,3.006.009,4.509a.657.657,0,0,1-.677.658.666.666,0,0,1-.655-.7q0-2.112,0-4.225a1.3,1.3,0,0,0-.752-1.272,1.868,1.868,0,0,0-.643-.143c-.293-.023-.589,0-.884-.006a2.021,2.021,0,0,1-1.989-1.417c-.06-.173-.114-.349-.177-.521a.678.678,0,0,0-.663-.466q-2.087,0-4.175,0a.692.692,0,0,0-.712.495,6.718,6.718,0,0,1-.374.907,1.944,1.944,0,0,1-1.736,1c-.3.008-.6,0-.9,0a1.346,1.346,0,0,0-1.42,1.428q0,.944,0,1.887,0,2.813,0,5.627a1.323,1.323,0,0,0,.991,1.357,1.607,1.607,0,0,0,.429.053q5.794,0,11.59,0a1.341,1.341,0,0,0,1.419-1.328.669.669,0,1,1,1.335.06,2.675,2.675,0,0,1-2.7,2.6c-1.725.006-3.451,0-5.177,0Z"
						transform="translate(0)"
					/>
					<Path
						id="路径_46141"
						data-name="路径 46141"
						d="M170.636,178.3a4.175,4.175,0,1,1,4.194-4.156A4.188,4.188,0,0,1,170.636,178.3Zm.033-7.014a2.839,2.839,0,1,0,2.825,2.849A2.849,2.849,0,0,0,170.669,171.288Z"
						transform="translate(-2.812 -2.814)"
					/>
				</G>
			</G>
		</Svg>
	);
}
