import { IFypSvgProps } from "@usertypes/components";
import React from "react";
import { Svg, Path } from "react-native-svg";

const PolygonSvg = (props: IFypSvgProps) => {
	const { color, height, size, width, ...props_ } = props;
	return (
		<Svg
			width={width ?? size}
			height={height ?? size}
			viewBox="0 0 24 13"
			{...props_}
		>
			<Path d="M12,0,24,13H0Z" fill={color} />
		</Svg>
	);
};

export default PolygonSvg;
