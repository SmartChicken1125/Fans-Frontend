import { IFansSvg } from "@usertypes/components";
import React from "react";
import { Svg, G, Path } from "react-native-svg";

const InstallSvg: IFansSvg = (props) => {
	const { color, size } = props;
	return (
		<Svg width={size} height={size} viewBox="0 0 8.737 13.005">
			<G transform="translate(-333.55 -96.898)">
				<Path
					d="M337.388,105.806v-.15q0-4.007,0-8.013a1.038,1.038,0,0,1,.02-.248.529.529,0,0,1,1.04.1c0,.058,0,.117,0,.175q0,4,0,8v.165c.055-.052.091-.084.124-.117q1.322-1.322,2.642-2.644a.584.584,0,0,1,.448-.209.507.507,0,0,1,.46.292.512.512,0,0,1-.039.544.763.763,0,0,1-.1.112q-1.834,1.835-3.668,3.668a.535.535,0,0,1-.744.055c-.023-.019-.043-.039-.064-.06q-1.83-1.83-3.66-3.659a.562.562,0,0,1-.19-.516.53.53,0,0,1,.843-.331,1.449,1.449,0,0,1,.137.127l2.625,2.625.095.093Z"
					transform="translate(-0.002)"
					fill={color}
					stroke={color}
					strokeWidth="0.2"
				/>
				<Path
					d="M337.91,121.893q-1.831,0-3.661,0a.57.57,0,0,1-.46-.181.507.507,0,0,1-.1-.536.5.5,0,0,1,.411-.34,1.12,1.12,0,0,1,.186-.013q3.636,0,7.271,0a.952.952,0,0,1,.259.031.522.522,0,0,1,.366.546.531.531,0,0,1-.486.488c-.05,0-.1,0-.15,0Z"
					transform="translate(0 -12.091)"
					fill={color}
					stroke={color}
					strokeWidth="0.2"
				/>
			</G>
		</Svg>
	);
};

export default InstallSvg;
