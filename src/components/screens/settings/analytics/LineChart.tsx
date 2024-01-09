import { FansText, FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { ITimeline } from "@usertypes/types";
import {
	Chart,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import React from "react";
import { Line } from "react-chartjs-2";

Chart.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
);

const options = {
	responsive: true,
	plugins: {
		legend: {
			display: false,
		},
	},
};

interface Props {
	timeline: ITimeline[];
	duration: string;
	period: string;
	setDuration: (duration: string) => void;
	labelTheme?: "green" | "black";
}

const LineChart = (props: Props) => {
	const {
		timeline,
		setDuration,
		duration,
		period,
		labelTheme = "green",
	} = props;

	return (
		<FansView gap={26.2}>
			<Line
				options={options}
				data={{
					labels: timeline.map((item) => {
						const date = new Date(item.date);
						if (duration === "Today") {
							return `${date.getHours()}:00`;
						} else if (["1W", "1M", "3M"].includes(duration)) {
							return `${date.toLocaleDateString("en-US", {
								month: "short",
								day: "2-digit",
							})}`;
						} else if (["6M", "1Y"].includes(duration)) {
							return `${date.toLocaleDateString("en-US", {
								month: "short",
							})}`;
						} else {
							if (period === "hour") {
								return `${date.getHours()}:00`;
							} else if (period === "day") {
								return `${date.toLocaleDateString("en-US", {
									month: "short",
									day: "2-digit",
								})}`;
							} else if (["week", "month"].includes(period)) {
								return `${date.toLocaleDateString("en-US", {
									month: "short",
								})}`;
							} else {
								return `${date.toLocaleDateString("en-US", {
									year: "numeric",
								})}`;
							}
						}
					}),
					datasets: [
						{
							data: timeline.map((item) => item.earnings),
							tension: 0.8,
							borderColor: "#4DCC36",
						},
					],
				}}
			/>
			<FansView
				height={34}
				alignItems="center"
				borderRadius="full"
				flexDirection="row"
				justifyContent="around"
				style={tw.style(
					"border",
					labelTheme === "green"
						? "border-fans-green-4d"
						: "border-fans-grey-f0",
				)}
			>
				{["Today", "1W", "1M", "3M", "6M", "1Y", "All"].map(
					(item, index) => {
						const isActive = item === duration;

						const handlePressDuration = () => setDuration(item);

						return (
							<FansView
								key={index}
								height={20}
								touchableOpacityProps={{
									onPress: handlePressDuration,
								}}
								borderRadius="full"
								justifyContent="center"
								padding={{
									x: 10,
								}}
								style={tw.style(
									isActive
										? `${
												labelTheme === "green"
													? "bg-fans-green-4d"
													: "bg-fans-black"
										  }`
										: "",
								)}
							>
								<FansText
									fontFamily="inter-semibold"
									fontSize={14}
									textTransform="uppercase"
									style={tw.style(
										isActive
											? "text-fans-white"
											: `${
													labelTheme === "green"
														? "text-fans-green-4d"
														: "text-fans-grey-70 dark:text-fans-grey-b1"
											  }`,
									)}
								>
									{item}
								</FansText>
							</FansView>
						);
					},
				)}
			</FansView>
		</FansView>
	);
};

export default LineChart;
