import { Trash2Svg, ChevronDown5Svg } from "@assets/svgs/common";
import RoundButton from "@components/common/RoundButton";
import { FypDropdown, FypSvg, FypText } from "@components/common/base";
import { FansView, FansDivider, FansIconButton } from "@components/controls";
import { timezones } from "@constants/timezones";
import {
	generateTimeFrames,
	getIntervalEndTime,
	getIntervalLength,
} from "@helper/HoursGenerator";
import {
	createVideoCallInterval,
	deleteVideoCallInterval,
	updateVideoCallSettings,
	updateVideoCallInterval,
} from "@helper/endpoints/videoCalls/apis";
import tw from "@lib/tailwind";
import { RoundButtonType } from "@usertypes/commonEnums";
import {
	ISelectData,
	ITimeframeInterval,
	IHoursAndMinutes,
	IVideoCallSetting,
} from "@usertypes/types";
import React, { FC, useState, Fragment, useEffect } from "react";
import { TimePickerModal } from "react-native-paper-dates";
import Toast from "react-native-toast-message";

const minutesBefore = ["5", "10", "15", "30", "45", "60"];

const initialDays = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

const defaultEditTimeValue = {
	intervalId: "",
	fieldName: "",
	value: "",
	hours: 0,
	minutes: 0,
};

interface IEditIntervalTime {
	intervalId: string;
	fieldName: string;
	value: string;
	hours?: number;
	minutes?: number;
}

interface IExtendInterval extends ITimeframeInterval {
	isNew?: boolean;
}

interface TimeButtonProps {
	value: string;
	onPress: () => void;
}

const TimeButton: FC<TimeButtonProps> = (props) => {
	const { value, onPress } = props;
	return (
		<FansView
			height={42}
			borderRadius={42}
			padding={{ x: 20 }}
			flexDirection="row"
			alignItems="center"
			style={[
				tw.style("border border-fans-grey-70 dark:border-fans-grey-b1"),
			]}
			pressableProps={{
				onPress: onPress,
			}}
		>
			<FansView flex="1">
				<FypText
					fontSize={18}
					lineHeight={26}
					numberOfLines={1}
					style={tw.style("text-fans-black dark:text-fans-white")}
				>
					{value === "" ? `Select Time` : value}
				</FypText>
			</FansView>
			<FypSvg
				width={13}
				height={13}
				svg={ChevronDown5Svg}
				color="fans-grey-70"
			/>
		</FansView>
	);
};

interface IntervalTimeframeProps {
	day: number;
	timeframes: IExtendInterval[];
	onSubmitCallback: () => void;
	setTimeframes: (timeframes: IExtendInterval[]) => void;
	handleOpenTimePicker: (data: IEditIntervalTime) => void;
}

const IntervalTimeframe: FC<IntervalTimeframeProps> = (props) => {
	const {
		day,
		timeframes,
		onSubmitCallback,
		setTimeframes,
		handleOpenTimePicker,
	} = props;

	const intervals = generateTimeFrames(10);

	const filteredObjects = timeframes.filter((obj) => obj.day === day);

	const onPressTimeButton = (
		intervalId: string,
		fieldName: string,
		value: string,
	) => {
		handleOpenTimePicker({
			intervalId,
			fieldName,
			value,
			hours: value === "" ? 0 : parseInt(value.slice(0, 2)),
			minutes: value === "" ? 0 : parseInt(value.slice(3, 5)),
		});
	};

	const handleCreate = async () => {
		setTimeframes([
			...timeframes,
			{
				id: new Date().getTime().toString(),
				startTime: "",
				length: 0,
				day: day,
				isNew: true,
			},
		]);
	};

	const handleDelete = async (id: string) => {
		const interval = timeframes.find((el) => el.id === id);
		if (interval?.isNew) {
			setTimeframes(timeframes.filter((el) => el.id !== id));
		} else {
			const resp = await deleteVideoCallInterval({ id }, { id });
			if (resp.ok) {
				onSubmitCallback();
			} else {
				Toast.show({
					type: "error",
					text1: resp.data.message,
				});
			}
		}
	};

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
									<TimeButton
										value={interval.startTime.slice(0, 5)}
										onPress={() =>
											onPressTimeButton(
												interval.id,
												"startTime",
												interval.startTime,
											)
										}
									/>
								</FansView>
								<FansView flex="1">
									<TimeButton
										value={
											interval.length === 0
												? ""
												: getIntervalEndTime(
														interval.startTime,
														interval.length,
												  )
										}
										onPress={() =>
											onPressTimeButton(
												interval.id,
												"endTime",
												interval.length === 0
													? ""
													: getIntervalEndTime(
															interval.startTime,
															interval.length,
													  ),
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

			{intervals.length !== filteredObjects.length ? (
				<FansView margin={{ t: 10 }}>
					<RoundButton
						variant={RoundButtonType.OUTLINE_PRIMARY}
						onPress={handleCreate}
					>
						Add new interval
					</RoundButton>
				</FansView>
			) : null}
		</FansView>
	);
};

interface Props {
	timeframes: ITimeframeInterval[];
	videoCallSettings: IVideoCallSetting;
	fetchTimeframes: () => void;
	updateTimeframesCallback: (timeframes: ITimeframeInterval[]) => void;
	updateVideoCallSettingsCallback: (
		videoCallSettings: IVideoCallSetting,
	) => void;
}

const TimeframeForm: FC<Props> = (props) => {
	const {
		timeframes,
		updateTimeframesCallback,
		fetchTimeframes,
		videoCallSettings,
		updateVideoCallSettingsCallback,
	} = props;

	const [openTimePicker, setOpenTimerPicker] = useState(false);
	const [editTime, setEditTime] =
		useState<IEditIntervalTime>(defaultEditTimeValue);

	const handleChangeField = async (name: string, val: string | number) => {
		const resp = await updateVideoCallSettings({ [name]: val });
		if (resp.ok) {
			updateVideoCallSettingsCallback({
				...videoCallSettings,
				[name]: val,
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

	const handleOpenTimePicker = (data: IEditIntervalTime) => {
		setEditTime(data);
		setOpenTimerPicker(true);
	};

	const handleDismissTimePicker = () => {
		setEditTime(defaultEditTimeValue);
		setOpenTimerPicker(false);
	};

	const handleUpdate = async (
		postbody: ITimeframeInterval,
		intervalId: string,
	) => {
		const resp = await updateVideoCallInterval(postbody, {
			id: intervalId,
		});
		if (resp.ok) {
			fetchTimeframes();
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
			fetchTimeframes();
		}
	};

	const handleConfirmTime = async (hoursAndMinutes: IHoursAndMinutes) => {
		const interval = timeframes.find((el) => el.id === editTime.intervalId);
		if (!interval) {
			return;
		}
		if (!videoCallSettings.timezone) {
			Toast.show({
				type: "error",
				text1: "Please select timezone",
			});
			return;
		}
		const timeString = `${hoursAndMinutes.hours
			.toString()
			.padStart(2, "0")}:${hoursAndMinutes.minutes
			.toString()
			.padStart(2, "0")}`;
		setOpenTimerPicker(false);
		if (interval.isNew) {
			if (editTime.fieldName === "startTime") {
				updateTimeframesCallback(
					timeframes.map((el) =>
						el.id === editTime.intervalId
							? {
									...el,
									startTime: timeString,
							  }
							: el,
					),
				);
			} else {
				updateTimeframesCallback(
					timeframes.map((el) =>
						el.id === editTime.intervalId
							? {
									...el,
									length: getIntervalLength(
										el.startTime,
										timeString,
									),
							  }
							: el,
					),
				);
				const resp = await createVideoCallInterval({
					startTime: interval.startTime,
					length: getIntervalLength(interval.startTime, timeString),
					day: interval.day,
				});
				if (resp.ok) {
					fetchTimeframes();
				} else {
					Toast.show({
						type: "error",
						text1: resp.data.message,
					});
				}
			}
		} else {
			if (editTime.fieldName === "startTime") {
				const newLength = getIntervalLength(
					timeString,
					getIntervalEndTime(interval.startTime, interval.length),
				);
				handleUpdate(
					{ ...interval, startTime: timeString, length: newLength },
					editTime.intervalId,
				);
			} else {
				if (interval) {
					const newLength = getIntervalLength(
						interval.startTime,
						timeString,
					);
					handleUpdate(
						{ ...interval, length: newLength },
						editTime.intervalId,
					);
				}
			}
		}
		setEditTime(defaultEditTimeValue);
	};

	useEffect(() => {
		if (
			videoCallSettings.progress !== "None" &&
			!videoCallSettings.timezone
		) {
			const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			handleChangeField("timezone", timezone);
		}
	}, [videoCallSettings.timezone, videoCallSettings.progress]);

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
					search
					data={timezones.map((tz) => ({
						data: tz.tzCode,
						label: tz.name,
					}))}
					value={videoCallSettings.timezone ?? ""}
					onSelect={(val) =>
						handleChangeField("timezone", val as string)
					}
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
								setTimeframes={updateTimeframesCallback}
								handleOpenTimePicker={handleOpenTimePicker}
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
						value={videoCallSettings.bufferBetweenCalls.toString()}
						onSelect={(val) => {
							handleChangeField(
								"bufferBetweenCalls",
								parseInt(val as string, 10),
							);
						}}
					/>
				</FansView>
			</FansView>
			<TimePickerModal
				visible={openTimePicker}
				onDismiss={handleDismissTimePicker}
				onConfirm={handleConfirmTime}
				hours={editTime.hours}
				minutes={editTime.minutes}
			/>
		</FansView>
	);
};

export default TimeframeForm;
