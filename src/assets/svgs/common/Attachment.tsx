import React from "react";
import { Svg, G, Path, SvgProps } from "react-native-svg";

interface FansSvgProps extends SvgProps {
	size?: number;
}

const AttachmentSvg = ({ ...props }: FansSvgProps) => (
	<Svg
		width={props.width ?? props.size}
		height={props.height ?? props.size}
		viewBox="0 0 23.753 22.07"
	>
		<G transform="translate(-822.508 -301.193)">
			<Path
				d="M828.134,312.086c-1,1-2,2-3,3a3.309,3.309,0,0,0,4.26,5.026,3.163,3.163,0,0,0,.476-.4c1.366-1.406,7.591-7.68,8.954-9.088.4-.417.811-.827,1.208-1.249a1.275,1.275,0,0,0,.294-1.417,1.3,1.3,0,0,0-2.105-.472c-.177.166-.345.342-.516.513-1.481,1.481-7.826,7.826-9.308,9.305a1.132,1.132,0,0,1-.266.211.635.635,0,0,1-.784-.169.657.657,0,0,1,.008-.822c.03-.036.064-.068.1-.1,1.647-1.647,8.158-8.161,9.807-9.806a2.6,2.6,0,0,1,3.92,3.4,3.036,3.036,0,0,1-.207.248c-1.731,1.792-8.329,8.445-10.06,10.238a5.064,5.064,0,0,1-1.1.879,4.6,4.6,0,0,1-6.153-6.513,4.194,4.194,0,0,1,.53-.659c2-2.01,8.861-8.886,10.878-10.878a6.458,6.458,0,0,1,9.9,8.18,6.622,6.622,0,0,1-.815,1c-1.811,1.827-8.5,8.506-10.316,10.326a.677.677,0,0,1-.458.229.614.614,0,0,1-.615-.342.64.64,0,0,1,.076-.718c.048-.057.1-.106.155-.159,1.781-1.781,8.436-8.416,10.2-10.21a4.991,4.991,0,0,0,1.38-4.936,5.155,5.155,0,0,0-8-2.945,6,6,0,0,0-.72.615c-.958.947-6.772,6.767-7.724,7.719Z"
				transform="translate(0)"
				stroke={props.color ?? "currentColor"}
				strokeWidth=".1"
				fill={props.color ?? "currentColor"}
			/>
		</G>
	</Svg>
);

export default AttachmentSvg;
