import { IFypSvgProps } from "@usertypes/components";
import React from "react";
import { Svg, Path } from "react-native-svg";

const MinusSvg = (props: IFypSvgProps) => {
	const { color, height, size, width, ...props_ } = props;

	return (
		<Svg
			width={width ?? size}
			height={height ?? size}
			viewBox="0 0 24.479 1.7"
			{...props_}
		>
			<Path
				id="Path_46322"
				data-name="Path 46322"
				d="M15163.433-3340.285h22.779"
				transform="translate(-15162.583 3341.135)"
				fill="none"
				stroke={color}
				strokeLinecap="round"
				strokeWidth="1.7"
			/>
		</Svg>
	);
};

export default MinusSvg;
