import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { IDateRange } from "@usertypes/types";
import moment from "moment";
import React, { FC, useCallback, useState } from "react";
import { DatePickerModal } from "react-native-paper-dates";
import { FypNullableView } from "./nullableView";
import { FypText } from "./text";

interface Props {
	value: IDateRange;
	onChangeValue: (val: IDateRange) => void;
	hasError?: boolean;
	label?: string;
}

export const FypDateRangePicker: FC<Props> = (props) => {
	const { value, onChangeValue, hasError, label } = props;
	const [open, setOpen] = useState(false);

	const onDismiss = useCallback(() => {
		setOpen(false);
	}, [setOpen]);

	const onConfirm = useCallback(
		(range: IDateRange) => {
			setOpen(false);
			onChangeValue(range);
		},
		[setOpen, onChangeValue],
	);
	return (
		<FansView>
			<FypNullableView visible={!!label}>
				<FypText
					fontSize={17}
					lineHeight={22}
					fontWeight={600}
					margin={{ b: 14 }}
					style={tw.style("text-fans-black dark:text-fans-white")}
				>
					{label}
				</FypText>
			</FypNullableView>

			<FansView
				height={42}
				flexDirection="row"
				alignItems="center"
				borderRadius={42}
				padding={{ l: 20 }}
				style={tw.style(
					"bg-fans-grey dark:bg-fans-grey-43",
					hasError ? "border border-fans-red" : "",
				)}
				pressableProps={{
					onPress: () => setOpen(true),
				}}
			>
				<FypText
					fontSize={18}
					lineHeight={24}
					style={tw.style("text-fans-grey-70 dark:text-fans-white")}
				>
					{value.startDate && value.endDate
						? `${moment(value.startDate).format(
								"MM/DD/YYYY",
						  )} ~ ${moment(value.endDate).format("MM/DD/YYYY")}`
						: "MM/DD/YYYY"}
				</FypText>
			</FansView>
			<DatePickerModal
				locale="en"
				mode="range"
				visible={open}
				onDismiss={onDismiss}
				startDate={value.startDate}
				endDate={value.endDate}
				onConfirm={onConfirm}
			/>
		</FansView>
	);
};
