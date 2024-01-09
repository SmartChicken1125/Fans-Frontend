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

export default function MicOn({ ...props }: FansSvgProps) {
	return (
		<Svg
			width={props.width ?? props.size}
			height={props.height ?? props.size}
			{...props}
			viewBox="0 0 30.276 37.165"
		>
			<G data-name="Group 52129" fill={props.color ?? "currentColor"}>
				<Path
					data-name="Path 46845"
					d="M103.315 569.635v5.878a8.011 8.011 0 01-2.773 6.263 7.766 7.766 0 01-6.711 1.956 7.991 7.991 0 01-6.494-5.517 7.486 7.486 0 01-.421-2.56c0-4.029-.019-4.587 0-8.615a8.063 8.063 0 015.708-7.788 8.213 8.213 0 0110.678 7.894c.016 1.986.013.502.013 2.489z"
					transform="translate(-79.988 -558.87)"
				/>
				<Path
					data-name="Path 46846"
					d="M99.045 584.815v2.742h5.313a3.113 3.113 0 01.576.042 1.25 1.25 0 011.021 1.312 1.28 1.28 0 01-1.133 1.186c-.055 0-.112.008-.162.008H90.876a1.264 1.264 0 01-.349-2.49 2.907 2.907 0 01.615-.055h5.328v-2.75c-.267-.037-.539-.07-.809-.112a14.988 14.988 0 01-9.5-5.291 14.664 14.664 0 01-3.26-6.868 22.429 22.429 0 01-.272-2.713 1.27 1.27 0 112.534-.18v.079a14.257 14.257 0 00.485 3.4 12.587 12.587 0 0024.7-3.289 1.276 1.276 0 112.547-.176 1.188 1.188 0 010 .2 16.233 16.233 0 01-.506 3.721 15.061 15.061 0 01-3.82 6.717 14.884 14.884 0 01-6.633 3.967c-.738.214-1.508.314-2.265.461-.204.034-.41.061-.626.089z"
					transform="translate(-82.631 -552.941)"
				/>
			</G>
		</Svg>
	);
}
