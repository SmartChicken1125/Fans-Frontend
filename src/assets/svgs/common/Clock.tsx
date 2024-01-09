import { IFansSvg } from "@usertypes/components";
import React from "react";
import { Svg, G, Path, SvgProps } from "react-native-svg";

interface FansSvgProps extends SvgProps {
	color?: string;
	colorFans?: string;
	fill?: string;
	size?: number;
}

const ClockSvg = (props: FansSvgProps) => {
	const { color, height, size, width, ...props_ } = props;

	return (
		<Svg
			width={width ?? size}
			height={height ?? size}
			viewBox="42.979 898.568 12.858 12.858"
			{...props_}
		>
			<G>
				<Path
					d="M49.458 902.34v3.04l-1.845 1.807"
					strokeLinejoin="round"
					strokeLinecap="round"
					strokeWidth="1.5"
					stroke={color ?? "currentColor"}
					fill="transparent"
				/>
				<Path
					d="M49 911.064a6.08 6.08 0 1 1 .099.006z"
					strokeLinejoin="round"
					strokeLinecap="round"
					strokeWidth="1.5"
					stroke={color ?? "currentColor"}
					fill="transparent"
				/>
			</G>
		</Svg>
	);
};

export const Clock1Svg: IFansSvg = (props) => {
	const { color = "currentColor" } = props;

	return (
		<Svg viewBox="0 0 18.377 18.377">
			<G transform="translate(-607.749 -372.249)" fill={color}>
				<Path
					d="M614.573,385.079a.75.75,0,0,1-.525-1.286l2.184-2.139V378a.75.75,0,0,1,1.5,0v3.97a.75.75,0,0,1-.225.536l-2.409,2.359A.748.748,0,0,1,614.573,385.079Z"
					transform="translate(-0.045 -0.037)"
				/>
				<Path
					d="M7.94-.75A8.69,8.69,0,1,1-.75,7.94,8.7,8.7,0,0,1,7.94-.75Zm0,15.881A7.19,7.19,0,1,0,.75,7.94,7.2,7.2,0,0,0,7.94,15.131Z"
					transform="matrix(0.059, -0.998, 0.998, 0.059, 608.542, 388.895)"
				/>
			</G>
		</Svg>
	);
};

export const Clock2Svg = (props: FansSvgProps) => {
	const { color, height, size, width, ...props_ } = props;
	return (
		<Svg
			width={width ?? size}
			height={height ?? size}
			viewBox="0 0 19.341 19.264"
			{...props_}
		>
			<G
				id="Group_54785"
				data-name="Group 54785"
				transform="translate(-1153.604 -48.45)"
			>
				<G
					id="Group_54782"
					data-name="Group 54782"
					transform="translate(1153.759 48.6)"
				>
					<Path
						id="Path_47979"
						data-name="Path 47979"
						d="M1169.469,50.74c.017-.219.036-.4.047-.583.02-.333.032-.666.056-1a.566.566,0,0,1,.571-.559.556.556,0,0,1,.548.607c-.038.9-.09,1.793-.137,2.689-.005.111-.017.222-.023.333-.025.455-.228.646-.691.63s-.943-.042-1.414-.067c-.555-.03-1.108-.065-1.662-.095a.557.557,0,0,1-.507-.331.51.51,0,0,1,.06-.551.584.584,0,0,1,.536-.232l1.524.084.384.022.062-.075a.942.942,0,0,1-.171-.085,8.568,8.568,0,0,0-10.869.29,8.054,8.054,0,0,0-2.759,4.872,8.414,8.414,0,0,0,8.023,9.741,4.028,4.028,0,0,1,.415.03.547.547,0,0,1,.058,1.074,1.162,1.162,0,0,1-.3.028,9.512,9.512,0,0,1-9.2-7.407,9.523,9.523,0,0,1,7.9-11.443,9.584,9.584,0,0,1,7.239,1.791C1169.249,50.574,1169.343,50.646,1169.469,50.74Z"
						transform="translate(-1153.759 -48.6)"
						fill={color}
						stroke={color}
						strokeWidth="0.3"
					/>
					<Path
						id="Path_47980"
						data-name="Path 47980"
						d="M1165.226,57.193c0-.74,0-1.48,0-2.22a1.146,1.146,0,0,1,.039-.327.558.558,0,0,1,1.075.062,1.988,1.988,0,0,1,.023.358c0,1.341,0,2.682,0,4.023a.488.488,0,0,0,.2.421q.9.741,1.778,1.505a.877.877,0,0,1,.26.376.489.489,0,0,1-.207.56.531.531,0,0,1-.625.027,4.161,4.161,0,0,1-.432-.346c-.587-.495-1.166-1-1.762-1.483a.886.886,0,0,1-.352-.766C1165.236,58.654,1165.226,57.922,1165.226,57.193Z"
						transform="translate(-1156.177 -49.795)"
						fill={color}
						stroke={color}
						strokeWidth="0.3"
					/>
				</G>
				<Path
					id="Path_47981"
					data-name="Path 47981"
					d="M1169.055,68.259a.587.587,0,0,1,.347-.757h0a.592.592,0,0,1,.765.347h0a.6.6,0,0,1-.347.757h0a.5.5,0,0,1-.205.039h0A.6.6,0,0,1,1169.055,68.259Zm3.093-1.641a.581.581,0,0,1,.008-.813h0l.04-.039h0a.589.589,0,0,1,.836.032h0a.6.6,0,0,1-.024.836h0v-.008h0l-.024.024h0a.579.579,0,0,1-.4.158h0A.593.593,0,0,1,1172.148,66.617Zm2.241-2.722a.6.6,0,0,1-.3-.781h0a.591.591,0,0,1,.789-.292h0a.586.586,0,0,1,.292.781h0a.583.583,0,0,1-.536.347h0A.53.53,0,0,1,1174.389,63.9Zm1.017-3.346a.6.6,0,0,1-.575-.615h0a.584.584,0,0,1,.607-.568h0a.591.591,0,0,1,.577.608h0a.593.593,0,0,1-.592.576h-.017Zm-1.1-3.835a.584.584,0,0,1,.346-.757h0a.593.593,0,0,1,.766.347h0a.6.6,0,0,1-.347.757h0a.678.678,0,0,1-.213.039h0A.593.593,0,0,1,1174.3,56.715Z"
					transform="translate(-3.219 -1.544)"
					fill={color}
					stroke={color}
					strokeWidth="0.3"
				/>
			</G>
		</Svg>
	);
};

export default ClockSvg;
