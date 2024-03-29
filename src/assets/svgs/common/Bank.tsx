import React from "react";
import { Svg, Path, SvgProps, G } from "react-native-svg";

interface FansSvgProps extends SvgProps {
	size?: number;
}

export default function BankSvg({ ...props }: FansSvgProps) {
	return (
		<Svg
			width={props.width ?? props.size}
			height={props.height ?? props.size}
			viewBox="0 0 25.502 25.472"
			{...props}
		>
			<Path
				d="M573.294,474.129V465.2c-.269,0-.528,0-.785,0a1.789,1.789,0,0,1-1.881-1.87c0-.381-.006-.763,0-1.144a1.755,1.755,0,0,1,.969-1.611q5.48-2.956,10.962-5.909a1.09,1.09,0,0,1,1.131,0q5.453,2.949,10.914,5.883a1.81,1.81,0,0,1,1.019,1.722c0,.381,0,.763,0,1.143a1.786,1.786,0,0,1-1.8,1.787c-.278,0-.557,0-.859,0v8.926c.3,0,.6,0,.9,0a1.765,1.765,0,0,1,1.666,1.252,2.129,2.129,0,0,1,.084.576c.011.558.006,1.116,0,1.673a1.785,1.785,0,0,1-1.87,1.853q-7.211,0-14.422,0-3.431,0-6.862,0a1.768,1.768,0,0,1-1.744-1.223,2.033,2.033,0,0,1-.094-.574c-.012-.586-.01-1.171,0-1.757a1.782,1.782,0,0,1,1.807-1.8C572.714,474.126,572.992,474.129,573.294,474.129Zm-.879-10.732h21.41v-1.234c-.068-.038-.124-.071-.182-.1q-5.163-2.782-10.322-5.566a.4.4,0,0,0-.433.03q-3.764,2.031-7.53,4.055-1.375.74-2.748,1.48c-.118.063-.21.118-.2.288C572.427,462.689,572.415,463.034,572.415,463.4Zm.014,14.283h21.387v-1.752H572.428Zm2.685-12.465v8.9h2.642v-8.9Zm7.1,8.9v-8.9h-2.642v8.9Zm4.463,0v-8.9h-2.642v8.9Zm4.465,0v-8.89H588.5v8.89Z"
				transform="translate(-570.375 -454.263)"
				fill={props.color ?? "#fff"}
				stroke="#a854f5"
				strokeWidth="0.5"
			/>
		</Svg>
	);
}

export function Bank2Svg({ ...props }: FansSvgProps) {
	return (
		<Svg
			width={props.width ?? props.size}
			height={props.height ?? props.size}
			viewBox="0 0 21.728 23.717"
			{...props}
		>
			<G
				id="Group_60347"
				data-name="Group 60347"
				transform="translate(-612.548 -450)"
			>
				<Path
					id="Path_50424"
					data-name="Path 50424"
					d="M623.421,457.714q-4.636,0-9.273,0a1.629,1.629,0,0,1-1.033-.3,1.422,1.422,0,0,1,.068-2.312,4.265,4.265,0,0,1,.373-.208q4.345-2.289,8.69-4.579a2.319,2.319,0,0,1,2.3-.018q4.416,2.326,8.835,4.648a1.473,1.473,0,0,1,.891,1.27,1.425,1.425,0,0,1-1.366,1.493c-.1.007-.2,0-.295,0Z"
					transform="translate(-0.002)"
					fill={props.color ?? "#fff"}
				/>
				<Path
					id="Path_50425"
					data-name="Path 50425"
					d="M623.411,482.048q-4.5,0-9,0a1.842,1.842,0,0,1-1.2-.366,1.716,1.716,0,0,1,.992-3.064c.1-.007.2,0,.294,0q8.91,0,17.821,0a3.509,3.509,0,0,1,.48.026,1.709,1.709,0,0,1-.189,3.4c-.1,0-.2,0-.295,0Z"
					transform="translate(0 -8.333)"
					fill={props.color ?? "#fff"}
				/>
				<Path
					id="Path_50426"
					data-name="Path 50426"
					d="M619.193,468.114c0,.795.016,1.59,0,2.384a1.669,1.669,0,0,1-1.393,1.577,1.711,1.711,0,0,1-2.026-1.7c-.014-.589,0-1.179,0-1.768,0-.911-.006-1.822,0-2.733A1.711,1.711,0,0,1,617,464.174a1.694,1.694,0,0,1,2.194,1.554c.024.795,0,1.59,0,2.385Z"
					transform="translate(-0.936 -4.106)"
					fill={props.color ?? "#fff"}
				/>
				<Path
					id="Path_50427"
					data-name="Path 50427"
					d="M628.873,468.131c0,.795.017,1.59,0,2.384a1.67,1.67,0,0,1-1.383,1.559,1.713,1.713,0,0,1-2.036-1.694c-.013-.446,0-.893,0-1.34,0-1.054-.006-2.108,0-3.162a1.714,1.714,0,0,1,1.244-1.71,1.694,1.694,0,0,1,2.177,1.55c.026.8,0,1.608,0,2.411Z"
					transform="translate(-3.755 -4.106)"
					fill={props.color ?? "#fff"}
				/>
				<Path
					id="Path_50428"
					data-name="Path 50428"
					d="M638.554,468.1c0,.8.017,1.609-.005,2.412a1.67,1.67,0,0,1-1.381,1.56,1.714,1.714,0,0,1-2.038-1.693c-.012-.42,0-.84,0-1.259,0-1.081-.005-2.162,0-3.243a1.714,1.714,0,0,1,1.243-1.71,1.694,1.694,0,0,1,2.178,1.549c.025.794,0,1.59,0,2.384Z"
					transform="translate(-6.575 -4.106)"
					fill={props.color ?? "#fff"}
				/>
			</G>
		</Svg>
	);
}
