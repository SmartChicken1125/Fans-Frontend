import { IFansSvg } from "@usertypes/components";
import React from "react";
import { Defs, LinearGradient, Path, Stop, Svg } from "react-native-svg";

const StarImage: IFansSvg = () => {
	return (
		<Svg viewBox="0 0 11.904 11.404">
			<Defs>
				<LinearGradient
					id="linear-gradient"
					x1="-0.164"
					y1="1.19"
					x2="1.443"
					gradientUnits="objectBoundingBox"
				>
					<Stop offset="0" stopColor="#1d21e5" />
					<Stop offset="0.537" stopColor="#a854f5" />
					<Stop offset="1" stopColor="#d885ff" />
				</LinearGradient>
			</Defs>
			<Path
				id="Path_49669"
				data-name="Path 49669"
				d="M444.573,301a.857.857,0,0,1,.791.517l.816,1.654c.14.284.284.567.419.854a.461.461,0,0,0,.383.279q1.39.2,2.78.4a.857.857,0,0,1,.485,1.482c-.662.648-1.323,1.3-1.99,1.937a.52.52,0,0,0-.168.51c.162.91.316,1.822.472,2.734a.857.857,0,0,1-1.248.926q-1.24-.648-2.475-1.3a.508.508,0,0,0-.525,0c-.809.432-1.623.855-2.433,1.283a.874.874,0,0,1-.866.014.848.848,0,0,1-.425-.9c.156-.916.311-1.831.474-2.745a.529.529,0,0,0-.17-.52q-1-.957-1.982-1.929a.852.852,0,0,1,0-1.275,1.143,1.143,0,0,1,.642-.236c.878-.125,1.755-.253,2.632-.378a.458.458,0,0,0,.368-.281c.407-.834.821-1.665,1.23-2.5A.861.861,0,0,1,444.573,301Z"
				transform="translate(-438.625 -301)"
				fill="url(#linear-gradient)"
			/>
		</Svg>
	);
};

export default StarImage;
