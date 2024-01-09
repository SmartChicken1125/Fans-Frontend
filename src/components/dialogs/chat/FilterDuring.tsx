import BottomSheetWrapper from "@components/common/bottomSheetWrapper";
import tw from "@lib/tailwind";
import { SnapPoints } from "@usertypes/commonEnums";
import moment from "moment";
import React, { FC, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import DateRangePicker from "rn-select-date-range";

interface Props {
	open: boolean;
	onClose: () => void;
	onSubmit: (
		from: string | moment.Moment,
		to: string | moment.Moment,
	) => void;
}

const FilterDuringDialog: FC<Props> = (props) => {
	const { open, onClose, onSubmit } = props;
	const [range, setRange] = useState<{
		from: string | moment.Moment;
		to: string | moment.Moment;
	}>();

	return (
		<BottomSheetWrapper
			open={open}
			onClose={onClose}
			snapPoint={SnapPoints.Fifty}
		>
			<View style={tw.style("flex px-[20px] gap-5 py-4")}>
				<View>
					<Text style={tw.style("font-bold text-center text-5")}>
						Search date or timeframe
					</Text>
				</View>
				<View>
					<DateRangePicker
						onSelectDateRange={(range) => {
							setRange({
								from: range.firstDate,
								to: range.secondDate,
							});
						}}
						blockSingleDateSelection={false}
						responseFormat="YYYY-MM-DD"
						maxDate={moment()}
						selectedDateContainerStyle={{
							height: 35,
							width: 35,
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: "purple",
							borderRadius: 35 / 2,
						}}
						clearBtnTitle=""
						confirmBtnTitle=""
					/>
				</View>
				<View>
					<TouchableOpacity
						style={tw.style("bg-purple-500 p-3 rounded-full")}
						onPress={() => {
							if (range) {
								onSubmit(range.from, range.to);
							}
							onClose();
						}}
					>
						<Text
							style={tw.style(
								"text-white text-center text-4 font-bold",
							)}
						>
							Search
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</BottomSheetWrapper>
	);
};

export default FilterDuringDialog;
