import { IFansSvg } from "@usertypes/components";
import React from "react";
import { G, Path, Svg } from "react-native-svg";

const LiveSvg: IFansSvg = (props) => {
	const { color } = props;

	return (
		<Svg viewBox="0 0 37.978 27.127">
			<G transform="translate(-1472.057 0.513)" fill={color}>
				<Path d="M1478.662-.512a1.305,1.305,0,0,1,1.239.8,1.306,1.306,0,0,1-.239,1.5c-.5.558-1.038,1.081-1.5,1.666a14.963,14.963,0,0,0-3.227,7.744,15.246,15.246,0,0,0,3.462,11.757c.391.481.851.905,1.259,1.372a1.292,1.292,0,0,1,.2,1.5,1.346,1.346,0,0,1-1.336.787,1.463,1.463,0,0,1-.926-.46,17.567,17.567,0,0,1-5.1-9.139,17.94,17.94,0,0,1,5.114-17.059A1.374,1.374,0,0,1,1478.662-.512Z" />
				<Path d="M1510.035,13.675a17.878,17.878,0,0,1-5.558,12.457,1.349,1.349,0,0,1-1.461.405,1.286,1.286,0,0,1-.914-1.114,1.372,1.372,0,0,1,.469-1.214,15.092,15.092,0,0,0,2.7-3.463,15.225,15.225,0,0,0,1.986-8.947A15.271,15.271,0,0,0,1502.7,2.04a1.457,1.457,0,0,1-.521-1.4,1.284,1.284,0,0,1,.924-1.011,1.311,1.311,0,0,1,1.364.342,18.091,18.091,0,0,1,4.169,6.112A19.043,19.043,0,0,1,1510.035,13.675Z" />
				<Path d="M1501.885,13.4a12.434,12.434,0,0,1-3.8,8.665,1.369,1.369,0,0,1-1.421.429,1.343,1.343,0,0,1-.663-2.175c.191-.227.413-.426.612-.645a9.843,9.843,0,0,0-.268-13.511c-.089-.091-.181-.178-.268-.272a1.363,1.363,0,0,1-.016-1.908,1.316,1.316,0,0,1,1.931,0,17.487,17.487,0,0,1,1.621,1.9A12.743,12.743,0,0,1,1501.885,13.4Z" />
				<Path d="M1480.185,12.819a12.585,12.585,0,0,1,3.708-8.685,1.424,1.424,0,0,1,2.035-.1,1.422,1.422,0,0,1-.116,2.038,9.415,9.415,0,0,0-2.751,5.32,9.738,9.738,0,0,0,2.651,8.562c.1.1.2.2.295.3a1.343,1.343,0,0,1-.007,1.874,1.3,1.3,0,0,1-1.9.025,16.033,16.033,0,0,1-1.625-1.89A12.6,12.6,0,0,1,1480.185,12.819Z" />
				<Path d="M1488.33,13.034a2.713,2.713,0,1,1,2.7,2.734A2.714,2.714,0,0,1,1488.33,13.034Z" />
			</G>
		</Svg>
	);
};

export default LiveSvg;