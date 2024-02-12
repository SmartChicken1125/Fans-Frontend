import React from "react";
import { G, Path, Svg, SvgProps } from "react-native-svg";

interface FansSvgProps extends SvgProps {
	color?: string;
	colorFans?: string;
	fill?: string;
	size?: number;
}

export default function StoryboardEditCloseSvg({ ...props }: FansSvgProps) {
	return (
		<Svg
			width={props.width ?? props.size}
			height={props.height ?? props.size}
			{...props}
			viewBox="0 0 60 60"
		>
			<Path
				id="路径_46222"
				data-name="路径 46222"
				d="M30,0A30,30,0,1,1,0,30,30,30,0,0,1,30,0Z"
				fill="rgba(255,255,255,0.1)"
			/>
			<G
				id="组_59259"
				data-name="组 59259"
				transform="translate(20.863 20.863)"
			>
				<G
					id="组_50369"
					data-name="组 50369"
					transform="translate(0 0)"
				>
					<G
						id="组_49587"
						data-name="组 49587"
						transform="translate(0)"
					>
						<Path
							id="路径_45562"
							data-name="路径 45562"
							d="M0,0,18.272,18.27"
							transform="translate(0.002)"
							fill="none"
							stroke="#fff"
							stroke-linecap="round"
							stroke-width="3"
						/>
						<Path
							id="路径_45563"
							data-name="路径 45563"
							d="M0,0,18.271,18.27"
							transform="translate(0 18.271) rotate(-90)"
							fill="none"
							stroke="#fff"
							stroke-linecap="round"
							stroke-width="3"
						/>
					</G>
				</G>
			</G>
		</Svg>
	);
}
