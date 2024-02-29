import { IFypSvgProps } from "@usertypes/components";
import React from "react";
import { Svg, Path } from "react-native-svg";

const ReplaceSvg = (props: IFypSvgProps) => {
	const { color, height, size, width, ...props_ } = props;

	return (
		<Svg
			width={width ?? size}
			height={height ?? size}
			viewBox="0 0 21.806 21.821"
			{...props_}
		>
			<Path
				id="Path_50343"
				data-name="Path 50343"
				d="M801.768,519.609c-.1-.129-.181-.231-.265-.328a8.1,8.1,0,0,0-6.746-2.944,8.278,8.278,0,1,0,7.6,12.353c.037-.065.073-.132.112-.2a1.158,1.158,0,1,1,2.018,1.135,10.144,10.144,0,0,1-1.463,2.075,10.38,10.38,0,0,1-6.45,3.4,10.6,10.6,0,1,1,6.654-17.371l.185.217c.009-.082.019-.131.019-.179,0-.531,0-1.813,0-2.344a1.159,1.159,0,1,1,2.317.005c0,1.38,0,3.51,0,4.891a1.531,1.531,0,0,1-1.535,1.611c-1.414.025-3.58.017-4.994,0a1.157,1.157,0,0,1-.287-2.278,1.5,1.5,0,0,1,.348-.034c.5,0,1.744,0,2.241,0C801.594,519.622,801.66,519.615,801.768,519.609Z"
				transform="translate(-784.252 -513.688)"
				stroke="#fff"
				strokeWidth="0.6"
				fill={color}
			/>
		</Svg>
	);
};

export default ReplaceSvg;
