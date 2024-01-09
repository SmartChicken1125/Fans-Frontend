import React, { FC } from "react";
import { Path, Svg, SvgProps } from "react-native-svg";

interface FansSvgProps extends SvgProps {
	color?: string;
	fill?: string;
	size?: number;
}

const PushNotificationSvg: FC<FansSvgProps> = (props) => {
	const { color, size, ..._props } = props;
	return (
		<Svg
			width={props.width ?? props.size}
			height={props.height ?? props.size}
			viewBox="0 0 17.79 24.467"
			{..._props}
		>
			<Path
				d="M-22.44,318.793c-1.252,0-2.448.011-3.642-.007a3.907,3.907,0,0,1-1.076-.15.924.924,0,0,1-.623-1.356,3.127,3.127,0,0,1,.526-.829q4.637-5.292,9.3-10.564a3.635,3.635,0,0,1,.976-.758.774.774,0,0,1,1.188.439,4.3,4.3,0,0,1,.233,1.371c.021,2.693.011,5.386.011,8.079v.657h3.432c.157,0,.314-.007.469.005.579.044,1.2.083,1.463.7a1.416,1.416,0,0,1-.447,1.515q-3.326,3.808-6.67,7.6c-.871.992-1.734,1.992-2.625,2.967a4.455,4.455,0,0,1-.987.834.826.826,0,0,1-1.324-.495,4.216,4.216,0,0,1-.194-1.275c-.016-2.711-.009-5.421-.009-8.131Z"
				transform="translate(27.888 -305)"
				fill={color}
			/>
		</Svg>
	);
};

export default PushNotificationSvg;
