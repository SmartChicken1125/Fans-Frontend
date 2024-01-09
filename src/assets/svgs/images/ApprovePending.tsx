import React from "react";
import {
	Svg,
	G,
	Defs,
	Path,
	LinearGradient,
	Stop,
	SvgProps,
} from "react-native-svg";

interface FansSvgProps extends SvgProps {
	size?: number;
}

const ApprovePendingImage = ({ ...props }: FansSvgProps) => (
	<Svg width={props.size} height={props.size} viewBox="0 0 48.496 48.312">
		<Defs>
			<LinearGradient
				id="linear-gradient"
				x1="-0.187"
				y1="1.017"
				x2="1.143"
				y2="-0.036"
				gradientUnits="objectBoundingBox"
			>
				<Stop offset="0.054" stopColor="#161fe4" />
				<Stop offset="0.625" stopColor="#a854f5" />
				<Stop offset="0.915" stopColor="#d885ff" />
			</LinearGradient>
			<linearGradient
				id="linear-gradient-2"
				x1="-3.381"
				y1="2.001"
				x2="3.238"
				y2="-0.559"
				xlinkHref="#linear-gradient"
			/>
			<linearGradient
				id="linear-gradient-3"
				x1="-1.492"
				y1="1.483"
				x2="1.725"
				y2="-0.086"
				xlinkHref="#linear-gradient"
			/>
		</Defs>
		<G
			id="Group_55165"
			data-name="Group 55165"
			transform="translate(-1421.964 26.568)"
		>
			<G
				id="Group_55164"
				data-name="Group 55164"
				transform="translate(1421.964 -26.568)"
			>
				<Path
					id="Path_48299"
					data-name="Path 48299"
					d="M1461.985-21.116c.044-.557.088-1.021.119-1.488.052-.846.082-1.695.143-2.541a1.441,1.441,0,0,1,1.455-1.423,1.415,1.415,0,0,1,1.393,1.546c-.094,2.284-.227,4.567-.348,6.851-.014.283-.042.565-.058.846-.064,1.16-.581,1.646-1.761,1.608-1.2-.04-2.4-.107-3.6-.171-1.413-.076-2.824-.165-4.236-.241a1.418,1.418,0,0,1-1.291-.844,1.3,1.3,0,0,1,.153-1.4,1.482,1.482,0,0,1,1.365-.591q1.942.109,3.884.211c.326.018.651.04.977.058l.157-.193a2.337,2.337,0,0,1-.438-.215,21.29,21.29,0,0,0-10.491-4.4,21.279,21.279,0,0,0-17.2,5.138,20.517,20.517,0,0,0-7.03,12.411,21.242,21.242,0,0,0,10.487,21.981,21.4,21.4,0,0,0,9.952,2.836,10.274,10.274,0,0,1,1.057.076,1.393,1.393,0,0,1,.149,2.736,2.979,2.979,0,0,1-.768.068,24.231,24.231,0,0,1-23.434-18.867c-2.012-9.054.624-16.829,7.405-23.129a23.236,23.236,0,0,1,12.708-6.024,24.42,24.42,0,0,1,18.443,4.563C1461.425-21.538,1461.664-21.355,1461.985-21.116Z"
					transform="translate(-1421.964 26.568)"
					fill="url(#linear-gradient)"
				/>
				<Path
					id="Path_48300"
					data-name="Path 48300"
					d="M1433.438-13.448c0-1.884,0-3.769.006-5.653a2.887,2.887,0,0,1,.1-.834,1.349,1.349,0,0,1,1.465-.963,1.346,1.346,0,0,1,1.272,1.12,5.15,5.15,0,0,1,.058.915c0,3.415.01,6.832-.008,10.248a1.243,1.243,0,0,0,.509,1.073q2.288,1.888,4.529,3.835a2.214,2.214,0,0,1,.662.959,1.242,1.242,0,0,1-.527,1.427,1.35,1.35,0,0,1-1.592.066,10.629,10.629,0,0,1-1.1-.88c-1.5-1.26-2.973-2.543-4.489-3.777a2.259,2.259,0,0,1-.9-1.952C1433.465-9.726,1433.438-11.587,1433.438-13.448Z"
					transform="translate(-1410.388 32.292)"
					fill="url(#linear-gradient-2)"
				/>
			</G>
			<Path
				id="Path_48301"
				data-name="Path 48301"
				d="M1437.316,12.189a1.493,1.493,0,0,1,.884-1.93h0a1.508,1.508,0,0,1,1.95.884h0a1.515,1.515,0,0,1-.885,1.93h0a1.276,1.276,0,0,1-.525.1h0A1.521,1.521,0,0,1,1437.316,12.189Zm7.878-4.181a1.483,1.483,0,0,1,.022-2.07h0l.1-.1h0a1.5,1.5,0,0,1,2.131.082h0a1.518,1.518,0,0,1-.06,2.131h0V8.026h0l-.06.062h0a1.475,1.475,0,0,1-1.025.4h0A1.518,1.518,0,0,1,1445.194,8.008Zm5.711-6.937a1.517,1.517,0,0,1-.766-1.988h0a1.5,1.5,0,0,1,2.01-.744h0a1.494,1.494,0,0,1,.746,1.99h0a1.488,1.488,0,0,1-1.367.884h0A1.319,1.319,0,0,1,1450.9,1.071ZM1453.5-7.45a1.522,1.522,0,0,1-1.465-1.568h0a1.489,1.489,0,0,1,1.546-1.447h0a1.5,1.5,0,0,1,1.469,1.548h0a1.51,1.51,0,0,1-1.508,1.467h-.042Zm-2.812-9.769a1.487,1.487,0,0,1,.883-1.93h0a1.509,1.509,0,0,1,1.952.884h0a1.521,1.521,0,0,1-.884,1.93h0a1.782,1.782,0,0,1-.543.1h0A1.51,1.51,0,0,1,1450.684-17.219Z"
				transform="translate(15.415 7.392)"
				fill="url(#linear-gradient-3)"
			/>
		</G>
	</Svg>
);

export default ApprovePendingImage;
