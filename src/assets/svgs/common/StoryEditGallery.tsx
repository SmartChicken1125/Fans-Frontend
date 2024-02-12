import React from "react";
import { Circle, G, Path, Rect, Svg, SvgProps } from "react-native-svg";

interface FansSvgProps extends SvgProps {
	color?: string;
	colorFans?: string;
	fill?: string;
	size?: number;
}

export default function StoryEditGallerySvg({ ...props }: FansSvgProps) {
	return (
		<Svg
			width={props.width ?? props.size}
			height={props.height ?? props.size}
			{...props}
			viewBox="0 0 34 34"
		>
			<G
				id="组_55181"
				data-name="组 55181"
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
					id="组_55182"
					data-name="组 55182"
					transform="translate(528.527 -293.637) rotate(90)"
				>
					<G
						id="组_55182-2"
						data-name="组 55182"
						transform="translate(303 504)"
					>
						<Rect
							id="矩形_19941"
							data-name="矩形 19941"
							width="11.462"
							height="11.462"
							rx="2.5"
							transform="translate(0 3.67)"
							fill="none"
							stroke="#000"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.4"
						/>
						<Path
							id="路径_48306"
							data-name="路径 48306"
							d="M613.868,136.868v-8.308A3.571,3.571,0,0,0,610.308,125H602"
							transform="translate(-598.736 -125)"
							fill="none"
							stroke="#000"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.4"
						/>
					</G>
				</G>
			</G>
		</Svg>
	);
}
