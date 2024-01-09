import { FypText } from "@components/common/base";
import tw from "@lib/tailwind";
import React, { FC } from "react";
import { View } from "react-native";
import { Svg, Circle } from "react-native-svg";

interface Props {
	percent: number;
	fans: number;
	levels: string;
	color: string;
}

const OverviewFansLevel: FC<Props> = (props) => {
	const { percent, fans, levels, color } = props;

	const strokeWidth = 2;
	const size = 48;
	const radius = (size - strokeWidth) / 2;
	const circum = radius * 2 * Math.PI;
	const svgProgress = 100 - percent;

	return (
		<View
			style={tw.style(
				"flex-row items-center rounded-[58px] px-2 py-[5px] justify-between",
				"bg-fans-grey dark:bg-fans-grey-43",
			)}
		>
			<View
				style={tw.style(
					"relative w-12 h-12 flex-row items-center justify-center",
				)}
			>
				<View
					style={tw.style(
						"w-[46px] h-[46px] rounded-full flex-row items-center justify-center",
						"bg-fans-white dark:bg-fans-black-1d",
					)}
				>
					<FypText
						fontSize={16}
						lineHeight={21}
						fontWeight={600}
						style={tw.style("text-fans-black dark:text-fans-white")}
					>
						{percent}
					</FypText>
					<FypText
						fontSize={11}
						lineHeight={15}
						style={tw.style("text-fans-black dark:text-fans-white")}
					>
						%
					</FypText>
				</View>
				<Svg
					width={size}
					height={size}
					style={tw.style("absolute top-0 left-0")}
				>
					<Circle
						stroke={color}
						fill="none"
						cx={size / 2}
						cy={size / 2}
						r={radius}
						strokeDasharray={`${circum} ${circum}`}
						strokeDashoffset={
							radius * Math.PI * 2 * (svgProgress / 100)
						}
						strokeLinecap="round"
						transform={`rotate(-90, ${size / 2}, ${size / 2})`}
						strokeWidth={strokeWidth}
					/>
				</Svg>
			</View>

			<View style={tw.style("flex-row items-center")}>
				<FypText
					fontSize={21}
					lineHeight={28}
					fontWeight={600}
					margin={{ r: 12 }}
					style={{
						color: color,
					}}
				>
					{fans}
				</FypText>
				<FypText
					fontSize={16}
					lineHeight={21}
					fontWeight={700}
					style={tw.style("text-fans-black dark:text-fans-white")}
				>
					Fans
				</FypText>
			</View>

			<View style={tw.style("flex-row items-center")}>
				<FypText
					fontSize={16}
					lineHeight={21}
					fontWeight={500}
					margin={{ r: 14 }}
					style={tw.style("text-fans-black dark:text-fans-white")}
				>
					Levels
				</FypText>
				<FypText
					fontSize={16}
					lineHeight={21}
					fontWeight={700}
					style={tw.style(
						"w-16 text-fans-black dark:text-fans-white",
					)}
				>
					{levels}
				</FypText>
			</View>
		</View>
	);
};

export default OverviewFansLevel;
