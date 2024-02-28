import RoundButton from "@components/common/RoundButton";
import { FypDropdown } from "@components/common/base";
import DatePicker from "@components/common/datePicker";
import TimePicker from "@components/common/timePicker";
import { FansText } from "@components/controls";
import { timezones } from "@constants/timezones";
import tw from "@lib/tailwind";
import { RoundButtonType } from "@usertypes/commonEnums";
import {
	IHoursAndMinutes,
	ICalendarDate,
	IScheduleForm,
} from "@usertypes/types";
import React, { FC } from "react";
import { View } from "react-native";

interface Props {
	data: IScheduleForm;
	isSubmitted: boolean;
	onChangeField: (
		name: string,
		val: string | IHoursAndMinutes | ICalendarDate,
	) => void;
	handleSave: () => void;
}

const ScheduleForm: FC<Props> = (props) => {
	const { data, onChangeField, handleSave, isSubmitted } = props;

	return (
		<View>
			<FansText
				fontSize={16}
				lineHeight={21}
				style={tw.style(
					"text-center mb-11 text-fans-black dark:text-fans-white",
				)}
			>
				Pre-plan posts for automatic publishing to maintain a consistent
				content flow
			</FansText>

			<View style={tw.style("mb-[30px]")}>
				<FansText
					fontSize={17}
					lineHeight={22}
					style={tw.style(
						"mb-4 font-semibold text-fans-black dark:text-fans-white",
					)}
				>
					Posting date:
				</FansText>
				<DatePicker
					value={data.startDate}
					onChangeValue={(val) => onChangeField("startDate", val)}
					hasError={isSubmitted && !data.startDate}
					validRange={{ startDate: new Date() }}
				/>
			</View>

			<View style={tw.style("mb-[30px]")}>
				<FansText
					fontSize={17}
					lineHeight={22}
					style={tw.style(
						"font-semibold mb-[15px] text-fans-black dark:text-fans-white",
					)}
				>
					Time:
				</FansText>
				<TimePicker
					value={data.time}
					onChangeValue={(val) => onChangeField("time", val)}
				/>
			</View>

			<View style={tw.style("mb-[30px]")}>
				<FansText
					fontSize={17}
					lineHeight={22}
					style={tw.style(
						"font-semibold mb-[15px] text-fans-black dark:text-fans-white",
					)}
				>
					Time Zone:
				</FansText>
				<FypDropdown
					search
					data={timezones.map((tz) => ({
						data: tz.tzCode,
						label: tz.name,
					}))}
					value={data.timezone}
					onSelect={(val) => onChangeField("timezone", val as string)}
					hasError={isSubmitted && data.timezone === ""}
				/>
			</View>
			<View>
				<RoundButton
					variant={RoundButtonType.OUTLINE_PRIMARY}
					onPress={handleSave}
				>
					Schedule post
				</RoundButton>
			</View>
		</View>
	);
};

export default ScheduleForm;
