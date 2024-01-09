import React from "react";
import { Svg, G, Path, SvgProps } from "react-native-svg";

interface FansSvgProps extends SvgProps {
	size?: number;
}

const TransformSvg = ({ ...props }: FansSvgProps) => {
	const { color = "currentColor", height, size, width, ...props_ } = props;

	return (
		<Svg
			width={width ?? size}
			height={height ?? size}
			viewBox="0 0 18.097 18.101"
			{...props_}
		>
			<G transform="translate(0.8 0.8)">
				<G transform="translate(0.098 0.004)">
					<G>
						<G transform="translate(11.465)">
							<Path
								d="M-56.7,561.08h2.468a2.475,2.475,0,0,1,2.467,2.468v2.467"
								transform="translate(56.699 -561.08)"
								fill="none"
								stroke={color}
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="1.6"
							/>
						</G>
						<G transform="translate(0 11.465)">
							<Path
								d="M-64.275,578.526h-2.467a2.475,2.475,0,0,1-2.468-2.467v-2.468"
								transform="translate(69.21 -573.591)"
								fill="none"
								stroke={color}
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="1.6"
							/>
						</G>
					</G>
				</G>
				<G transform="translate(0 0)">
					<G>
						<G>
							<Path
								d="M-69.317,566.044v-2.485a2.49,2.49,0,0,1,2.482-2.483h2.482"
								transform="translate(69.317 -561.076)"
								fill="none"
								stroke={color}
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="1.6"
							/>
						</G>
						<G transform="translate(11.533 11.537)">
							<Path
								d="M-51.768,573.665v2.483a2.489,2.489,0,0,1-2.482,2.482h-2.482"
								transform="translate(56.732 -573.665)"
								fill="none"
								stroke={color}
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="1.6"
							/>
						</G>
					</G>
				</G>
			</G>
		</Svg>
	);
};

export default TransformSvg;
