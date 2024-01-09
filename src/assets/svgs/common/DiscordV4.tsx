import { IFansSvg } from "@usertypes/components";
import React from "react";
import { Svg, Path, SvgProps } from "react-native-svg";

interface FansSvgProps extends SvgProps {
	color?: string;
	fill?: string;
	size?: number;
}

export default function DiscordSvg({ ...props }: FansSvgProps) {
	const { color = "currentColor" } = props;

	return (
		<Svg
			viewBox="0 0 26.729 20.215"
			fill={color}
			width={props.width ?? props.size}
			height={props.height ?? props.size}
			{...props}
		>
			<Path
				d="M484.655,339.7a20.783,20.783,0,0,1,4.009-.2c.643.018,1.286.105,1.927.178a.193.193,0,0,0,.242-.128c.171-.367.357-.727.527-1.095a.255.255,0,0,1,.328-.148,22.712,22.712,0,0,1,5.075,1.561.815.815,0,0,1,.367.3,23.608,23.608,0,0,1,2.862,5.791,22.413,22.413,0,0,1,.846,3.619,25.423,25.423,0,0,1,.2,4.333c-.007.375-.049.75-.091,1.124a.331.331,0,0,1-.133.2,20.567,20.567,0,0,1-3.688,2.167c-.85.374-1.727.686-2.594,1.024a.857.857,0,0,1-.245.068.237.237,0,0,1-.183-.054,15.588,15.588,0,0,1-1.378-2.23A14.848,14.848,0,0,0,495,355.1a6.051,6.051,0,0,0-.492-.379c-.053-.033-.159,0-.232.026-.72.263-1.428.563-2.16.789a14.117,14.117,0,0,1-3.178.587,16.2,16.2,0,0,1-2.767-.021,15.734,15.734,0,0,1-4.075-.957c-.344-.132-.685-.275-1.024-.421a.209.209,0,0,0-.25.028c-.133.115-.272.221-.435.353a14.432,14.432,0,0,0,2.247,1.085,1.671,1.671,0,0,1-.093.219c-.4.647-.8,1.29-1.2,1.938a.258.258,0,0,1-.354.118,22.492,22.492,0,0,1-5.918-2.882c-.17-.116-.338-.237-.509-.35a.3.3,0,0,1-.135-.246,21.646,21.646,0,0,1-.072-3.32,24.035,24.035,0,0,1,.26-2.452,18.95,18.95,0,0,1,.816-3.321,24.61,24.61,0,0,1,2.653-5.447,1.779,1.779,0,0,1,.865-.73,22.573,22.573,0,0,1,4.64-1.39c.421-.077.331-.114.524.26C484.294,338.947,484.467,339.313,484.655,339.7Zm7.242,7.029a2.074,2.074,0,0,0-1.344.658,2.894,2.894,0,0,0-.272,3.712,2.258,2.258,0,0,0,3.675.07,2.936,2.936,0,0,0,.047-3.48A2.41,2.41,0,0,0,491.9,346.727Zm-6.241,2.609a2.6,2.6,0,0,0-.616-1.757,2.279,2.279,0,0,0-3.421-.149,2.911,2.911,0,0,0-.122,3.79,2.239,2.239,0,0,0,3.367.173A2.718,2.718,0,0,0,485.656,349.335Z"
				transform="translate(-474.322 -338.28)"
			/>
		</Svg>
	);
}
