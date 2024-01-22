import { Trash2Svg } from "@assets/svgs/common";
import RoundButton from "@components/common/RoundButton";
import {
	FypDropdown,
	FypSvg,
	FypText,
	FypNullableView,
} from "@components/common/base";
import { FansView, FansDivider, FansIconButton } from "@components/controls";
import { defaultVideoCallTimeframeFormData } from "@constants/defaultFormData";
import { timezones } from "@constants/timezones";
import { ProfileActionType, useAppContext } from "@context/useAppContext";
import {
	generateTimeFrames,
	getIntervalEndTime,
	getIntervalLength,
} from "@helper/HoursGenerator";
import {
	getVideoCallTimeframes,
	createVideoCallInterval,
	deleteVideoCallInterval,
	updateVideoCallSettings,
	updateVideoCallInterval,
} from "@helper/endpoints/settings/apis";
import tw from "@lib/tailwind";
import { RoundButtonType } from "@usertypes/commonEnums";
import { ISelectData, ITimeframeInterval } from "@usertypes/types";
import React, { FC, useState, useEffect, Fragment } from "react";
import Toast from "react-native-toast-message";

const minutesBefore = ["1", "5", "10", "15"];

const initialDays = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

interface IntervalTimeframeProps {
	day: number;
	timeframes: ITimeframeInterval[];
	onSubmitCallback: () => void;
}

const IntervalTimeframe: FC<IntervalTimeframeProps> = (props) => {
	const { day, timeframes, onSubmitCallback } = props;

	const intervals = generateTimeFrames(10);

	const filteredObjects = timeframes.filter((obj) => obj.day === day);
	const [isLoading, setIsLoading] = useState(false);
	const [showNewForm, setShowNewForm] = useState(false);
	const [formData, setFormData] = useState(defaultVideoCallTimeframeFormData);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleCreate = async () => {
		if (!showNewForm) {
			setShowNewForm(true);
		} else {
			setIsSubmitted(true);
			if (formData.startTime === "" || formData.endTime === "") {
				return;
			}
			setIsLoading(true);
			const resp = await createVideoCallInterval({
				startTime: formData.startTime,
				length: getIntervalLength(formData.startTime, formData.endTime),
				day: day,
			});
			setIsSubmitted(false);
			setIsLoading(false);
			if (resp.ok) {
				setShowNewForm(false);
				setFormData(defaultVideoCallTimeframeFormData);
				onSubmitCallback();
			} else {
				Toast.show({
					type: "error",
					text1: resp.data.message,
				});
			}
		}
	};

	const handleDelete = async (id: string) => {
		const resp = await deleteVideoCallInterval({ id }, { id });
		if (resp.ok) {
			onSubmitCallback();
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const handleUpdate = async (
		postbody: ITimeframeInterval,
		intervalId: string,
	) => {
		const resp = await updateVideoCallInterval(postbody, {
			id: intervalId,
		});
		if (resp.ok) {
			onSubmitCallback();
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
			onSubmitCallback();
		}
	};

	const handleChangeStartTime = (value: string, intervalId: string) => {
		const interval = filteredObjects.find((el) => el.id === intervalId);
		if (interval) {
			const newLength = getIntervalLength(
				value,
				getIntervalEndTime(interval.startTime, interval.length),
			);
			handleUpdate(
				{ ...interval, startTime: value, length: newLength },
				intervalId,
			);
		}
	};

	const handleChangeEndTime = (value: string, intervalId: string) => {
		const interval = filteredObjects.find((el) => el.id === intervalId);
		if (interval) {
			const newLength = getIntervalLength(interval.startTime, value);
			handleUpdate({ ...interval, length: newLength }, intervalId);
		}
	};

	useEffect(() => {
		setIsSubmitted(false);
		setFormData(defaultVideoCallTimeframeFormData);
	}, []);

	return (
		<FansView>
			<FansView>
				{filteredObjects.map((interval, index) => (
					<Fragment key={index}>
						<FansView
							flexDirection="row"
							alignItems="center"
							gap={{ xs: 17, md: 42 }}
						>
							<FansView
								flex="1"
								flexDirection="row"
								gap={{ xs: 7, md: 14 }}
							>
								<FansView flex="1">
									<FypDropdown
										data={intervals.map((el) => ({
											label: el,
											data: el,
										}))}
										value={interval.startTime.slice(0, 5)}
										search={false}
										onSelect={(val) =>
											handleChangeStartTime(
												val as string,
												interval.id,
											)
										}
									/>
								</FansView>
								<FansView flex="1">
									<FypDropdown
										data={intervals.map((el) => ({
											label: el,
											data: el,
										}))}
										value={getIntervalEndTime(
											interval.startTime,
											interval.length,
										)}
										search={false}
										onSelect={(val) =>
											handleChangeEndTime(
												val as string,
												interval.id,
											)
										}
									/>
								</FansView>
							</FansView>

							<FansIconButton
								size={34}
								backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
								onPress={() => handleDelete(interval.id)}
							>
								<FypSvg
									svg={Trash2Svg}
									width={12}
									height={15}
									color="fans-red"
								/>
							</FansIconButton>
						</FansView>
						{index !== filteredObjects.length - 1 ? (
							<FansDivider
								style={tw.style("my-[18px] md:my-4")}
							/>
						) : null}
					</Fragment>
				))}
			</FansView>

			<FypNullableView visible={showNewForm}>
				<FansDivider style={tw.style("my-[18px] md:my-4")} />
				<FansView
					flexDirection="row"
					alignItems="center"
					gap={{ xs: 17, md: 42 }}
				>
					<FansView
						flex="1"
						flexDirection="row"
						gap={{ xs: 7, md: 14 }}
					>
						<FansView flex="1">
							<FypDropdown
								data={intervals.map((el) => ({
									label: el,
									data: el,
								}))}
								value={formData.startTime}
								search={false}
								onSelect={(val) =>
									setFormData({
										...formData,
										startTime: val as string,
									})
								}
								hasError={
									isSubmitted && formData.startTime === ""
								}
							/>
						</FansView>
						<FansView flex="1">
							<FypDropdown
								data={intervals.map((el) => ({
									label: el,
									data: el,
								}))}
								value={formData.endTime}
								search={false}
								onSelect={(val) =>
									setFormData({
										...formData,
										endTime: val as string,
									})
								}
								hasError={
									isSubmitted && formData.endTime === ""
								}
							/>
						</FansView>
					</FansView>

					<FansView width={34}></FansView>
				</FansView>
			</FypNullableView>

			{intervals.length !== filteredObjects.length ? (
				<FansView margin={{ t: 10 }}>
					<RoundButton
						variant={RoundButtonType.OUTLINE_PRIMARY}
						onPress={handleCreate}
						loading={isLoading}
					>
						{showNewForm ? "Save new interval" : "Add new interval"}
					</RoundButton>
				</FansView>
			) : null}
		</FansView>
	);
};

const TimeframeForm = () => {
	const { state, dispatch } = useAppContext();

	const { timeZone, bufferBetweenCalls } = state.profile.settings.video;

	const [timeframes, setTimeframes] = useState<ITimeframeInterval[]>([]);

	const fetchTimeframes = async () => {
		const resp = await getVideoCallTimeframes();
		if (resp.ok) {
			setTimeframes(resp.data);
			dispatch.setProfile({
				type: ProfileActionType.updateSettings,
				data: {
					video: {
						...state.profile.settings.video,
						timeframes: resp.data,
					},
				},
			});
		}
	};

	const handleChangeField = async (name: string, val: string | number) => {
		const resp = await updateVideoCallSettings({ [name]: val });
		if (resp.ok) {
			dispatch.setProfile({
				type: ProfileActionType.updateSettings,
				data: {
					video: {
						...state.profile.settings.video,
						[name]: val,
					},
				},
			});
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const convertMinutesBeforeToSelectData = (
		intervals: string[],
	): ISelectData[] => {
		return intervals.map((interval) => {
			const label =
				interval === "1" ? `${interval} minute` : `${interval} minutes`;
			return {
				label,
				data: interval,
			};
		});
	};

	useEffect(() => {
		fetchTimeframes();
	}, []);
	return (
		<FansView>
			<FansView margin={{ b: 34 }}>
				<FypText
					fontFamily="inter-semibold"
					fontSize={17}
					margin={{ b: 12 }}
				>
					Time Zone
				</FypText>
				<FypDropdown
					data={timezones}
					value={timeZone}
					onSelect={(val) => handleChangeField("timeZone", val)}
				/>
			</FansView>
			<FansDivider />
			<FansView margin={{ t: 28, b: 38 }}>
				<FypText
					fontFamily="inter-semibold"
					fontSize={19}
					margin={{ b: 26 }}
				>
					Timeframes
				</FypText>
				<FansView gap={32}>
					{initialDays.map((day, index) => (
						<FansView key={day}>
							<FypText
								fontWeight={600}
								fontSize={17}
								margin={{ b: 15 }}
							>
								{day}
							</FypText>
							<IntervalTimeframe
								day={index}
								timeframes={timeframes}
								onSubmitCallback={fetchTimeframes}
							/>
						</FansView>
					))}
				</FansView>
			</FansView>
			<FansDivider />
			<FansView margin={{ t: 30 }}>
				<FypText fontWeight={600} fontSize={17} margin={{ b: 12 }}>
					Buffer between calls (optional)
				</FypText>
				<FypText
					margin={{ b: 16 }}
					style={tw.style("text-fans-grey-70 dark:text-fans-grey-b1")}
				>
					Set a predefined period before and after each video call,
					allowing for preparation and rest
				</FypText>
				<FansView>
					<FypDropdown
						data={convertMinutesBeforeToSelectData(minutesBefore)}
						value={bufferBetweenCalls.toString()}
						onSelect={(val) => {
							handleChangeField(
								"bufferBetweenCalls",
								parseInt(val as string, 10),
							);
						}}
					/>
				</FansView>
			</FansView>
		</FansView>
	);
};

export default TimeframeForm;
