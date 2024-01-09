import { FansText } from "@components/controls";
import tw from "@lib/tailwind";
import { ICalendarDate } from "@usertypes/types";
import React, { FC, useCallback, useState } from "react";
import { Pressable, View } from "react-native";
import { DatePickerModal } from "react-native-paper-dates";

interface Props {
	value: ICalendarDate;
	onChangeValue: (val: ICalendarDate) => void;
	hasError?: boolean;
}

const DatePicker: FC<Props> = (props) => {
	const { value, onChangeValue, hasError } = props;
	const [open, setOpen] = useState(false);

	const onDismissSingle = useCallback(() => {
		setOpen(false);
	}, [setOpen]);

	const onConfirmSingle = useCallback(
		(params: { date: ICalendarDate }) => {
			setOpen(false);
			onChangeValue(params.date);
		},
		[setOpen, onChangeValue],
	);
	return (
		<View>
			<Pressable
				style={tw.style(
					"h-[42px] rounded-[42px] flex-row items-center pl-5",
					"bg-fans-grey dark:bg-fans-grey-43",
					hasError ? "border border-fans-red" : "",
				)}
				onPress={() => setOpen(true)}
			>
				<FansText
					fontSize={18}
					lineHeight={24}
					style={tw.style("text-fans-grey-70 dark:text-white")}
				>
					{value ? `${value.toJSON().split("T")[0]}` : "MM/DD/YYYY"}
				</FansText>
			</Pressable>
			<DatePickerModal
				locale="en"
				mode="single"
				visible={open}
				onDismiss={onDismissSingle}
				date={value}
				onConfirm={onConfirmSingle}
			/>
		</View>
	);
};

export default DatePicker;
