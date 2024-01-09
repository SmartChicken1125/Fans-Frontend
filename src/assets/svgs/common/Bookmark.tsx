import { IFypSvgProps } from "@usertypes/components";
import React from "react";
import { Svg, Path, SvgProps } from "react-native-svg";

interface FansSvgProps extends SvgProps {
	color?: string;
	fill?: string;
	size?: number;
}

const BookmarkSvg = ({ ...props }: FansSvgProps) => (
	<Svg
		width={props.width ?? props.size}
		height={props.height ?? props.size}
		viewBox="0 0 16.061 20.04"
		{...props}
	>
		<Path
			id="Path_45791"
			data-name="Path 45791"
			d="M287.078,710.7c0,2.626,0,4.341,0,6.967a1.39,1.39,0,0,1-1.484,1.45,1.427,1.427,0,0,1-.965-.459q-1.974-1.98-3.954-3.955a.9.9,0,0,0-1.451,0q-1.984,1.983-3.969,3.966a1.413,1.413,0,0,1-2.017.048,1.359,1.359,0,0,1-.416-1.019c0-.582,0-1.164,0-1.747,0-4.67,0-8.429,0-13.1a1.738,1.738,0,0,1,1.18-1.749,2.035,2.035,0,0,1,.618-.1q5.333-.008,10.666,0a1.748,1.748,0,0,1,1.794,1.763c.008.408,0,.818,0,1.226Q287.078,707.345,287.078,710.7Z"
			transform="translate(-271.918 -700.1)"
			fill="none"
			stroke={props.color ?? "#000"}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.8"
		/>
	</Svg>
);

export const FilledBookmarkSvg = (props: IFypSvgProps) => {
	const { color, height, size, width, ...props_ } = props;

	return (
		<Svg
			width={width ?? size}
			height={height ?? size}
			viewBox="0 0 20.159 25.241"
			{...props_}
		>
			<Path
				d="M291.074,713.418c0,3.362,0,5.558,0,8.92a1.78,1.78,0,0,1-1.9,1.856,1.827,1.827,0,0,1-1.236-.587q-2.527-2.535-5.063-5.064a1.156,1.156,0,0,0-1.858,0q-2.54,2.539-5.082,5.078a1.809,1.809,0,0,1-2.583.061,1.741,1.741,0,0,1-.533-1.3c0-.745,0-1.491,0-2.236,0-5.979,0-10.791,0-16.77a2.226,2.226,0,0,1,1.511-2.239,2.6,2.6,0,0,1,.791-.13q6.828-.01,13.655,0a2.237,2.237,0,0,1,2.3,2.257c.01.523,0,1.047,0,1.57Q291.075,709.123,291.074,713.418Z"
				transform="translate(-271.868 -700.05)"
				stroke={color}
				fill={color}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.9"
			/>
		</Svg>
	);
};

export default BookmarkSvg;
