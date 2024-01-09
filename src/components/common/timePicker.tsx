import { FansText } from "@components/controls";
import tw from "@lib/tailwind";
import { IHoursAndMinutes } from "@usertypes/types";
import React, { FC, useCallback, useState } from "react";
import { Pressable, View } from "react-native";
import { TimePickerModal } from "react-native-paper-dates";

interface Props {
	value: IHoursAndMinutes;
	onChangeValue: (value: IHoursAndMinutes) => void;
	hasError?: boolean;
}

const TimePicker: FC<Props> = (props) => {
	const { value, onChangeValue, hasError } = props;
	const [open, setOpen] = useState(false);

	const onDismiss = useCallback(() => {
		setOpen(false);
	}, [setOpen]);

	const onConfirm = useCallback(
		(hoursAndMinutes: IHoursAndMinutes) => {
			setOpen(false);
			onChangeValue(hoursAndMinutes);
		},
		[open],
	);

	return (
		<View>
			<Pressable
				style={tw.style(
					"h-[42px] rounded-[42px] flex-row items-center pl-5",
					"bg-fans-grey dark:bg-fans-grey-43",
					hasError ? "border border-fans-grey" : "",
				)}
				onPress={() => setOpen(true)}
			>
				<FansText
					style={tw.style("text-fans-grey-70 dark:text-white")}
					fontSize={18}
					lineHeight={24}
				>
					{`${value.hours
						.toString()
						.padStart(2, "0")} : ${value.minutes
						.toString()
						.padStart(2, "0")}`}
				</FansText>
			</Pressable>
			<TimePickerModal
				visible={open}
				onDismiss={onDismiss}
				onConfirm={onConfirm}
				hours={value.hours}
				minutes={value.minutes}
			/>
		</View>
	);
};

export default TimePicker;
