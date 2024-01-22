import FormControl from "@components/common/FormControl";
import RoundButton from "@components/common/RoundButton";
import { FypDropdown, FypText } from "@components/common/base";
import DatePicker from "@components/common/datePicker";
import { PreviewImageField } from "@components/posts/common";
import { winnerOptions } from "@constants/common";
import { timezones } from "@constants/timezones";
import tw from "@lib/tailwind";
import { RoundButtonType } from "@usertypes/commonEnums";
import { ICalendarDate, IGiveawayForm, IPickerMedia } from "@usertypes/types";
import useDocumentPicker from "@utils/useDocumentPicker";
import React, { FC, useState } from "react";
import { View } from "react-native";

interface Props {
	data: IGiveawayForm;
	isSubmitted: boolean;
	onChangeForm: (name: string, value: string | IPickerMedia) => void;
	onSave: () => void;
	handleChangeDate: (value: ICalendarDate) => void;
}

const AddGiveawayForm: FC<Props> = (props) => {
	const { data, onChangeForm, isSubmitted, onSave, handleChangeDate } = props;
	const { useImagePicker } = useDocumentPicker();
	const [enableOption, setEnableOption] = useState("all");

	const onChangeImage = async () => {
		const result = await useImagePicker();
		if (result.ok) {
			const medias = result.data;
			if (medias.length > 0) {
				onChangeForm("cover", medias[0]);
			}
		}
	};

	return (
		<View>
			<View style={tw.style("px-[18px] md:px-0")}>
				<FypText
					fontSize={16}
					lineHeight={21}
					textAlign="center"
					margin={{ b: 32 }}
					style={tw.style("text-fans-black dark:text-fans-white")}
				>
					Strengthen your fan community by organizing exciting
					giveaways and rewarding your loyal supporters
				</FypText>

				<View style={tw.style("mb-[30px]")}>
					<FormControl
						label="Prize"
						placeholder="Enter product name or link..."
						value={data.prize}
						onChangeText={(val: string) =>
							onChangeForm("prize", val)
						}
						hasError={isSubmitted && data.prize === ""}
						validateString="This is mandatory field."
					/>
				</View>
			</View>
			<PreviewImageField
				label="Cover image (optional)"
				style="mb-[34px]"
				onChangeImage={onChangeImage}
				data={data.cover}
				onCancel={() =>
					onChangeForm("cover", { uri: "", isPicker: true })
				}
			/>

			<View style={tw.style("px-[18px] pb-[104px] md:px-0 md:pb-10")}>
				<View style={tw.style("mb-[30px]")}>
					<DatePicker
						value={data.endDate}
						onChangeValue={handleChangeDate}
					/>
				</View>

				{/* <View style={tw.style("mb-[30px]")}> // TODO
					<FypText
						fontSize={17}
						lineHeight={22}
						fontWeight={600}
						margin={{ b: 15 }}
						style={tw.style("text-fans-black dark:text-fans-white")}
					>
						Time Zone
					</FypText>
					<FypDropdown
						data={timezones}
						value={data.timezone}
						onSelect={(val) =>
							onChangeForm("timezone", val as string)
						}
						hasError={isSubmitted && data.timezone === ""}
						validateString="please select timezone."
					/>
				</View> */}

				<View style={tw.style("mb-7")}>
					<FypText
						fontSize={17}
						lineHeight={22}
						fontWeight={600}
						margin={{ b: 15 }}
						style={tw.style("text-fans-black dark:text-fans-white")}
					>
						Number of winners
					</FypText>
					<FypDropdown
						data={winnerOptions}
						value={data.winnerCount as string}
						onSelect={(val) =>
							onChangeForm("winnerCount", val as string)
						}
						hasError={isSubmitted && data.winnerCount === ""}
						validateString="please select number of winners."
					/>
				</View>
				{/* <View style={tw.style("mb-5")}>
					<FypText
						fontSize={17}
						lineHeight={22}
						fontWeight={600}
						margin={{ b: 12 }}
						style={tw.style("text-fans-black dark:text-fans-white")}
					>
						Who can enter
					</FypText>
					<View
						style={tw.style(
							"flex-row items-center justify-between h-13",
						)}
					>
						<CustomRadio
							label="All subscribers"
							onPress={() => setEnableOption("all")}
							checked={enableOption === "all"}
						/>
					</View>

					<FansDivider style={tw.style("my-1.5")} />

					<View
						style={tw.style(
							"flex-row items-center justify-between h-13",
						)}
					>
						<CustomRadio
							label="Some roles"
							onPress={() => setEnableOption("role")}
							checked={enableOption === "role"}
						/>
					</View>
				</View> */}

				<RoundButton
					variant={RoundButtonType.OUTLINE_PRIMARY}
					onPress={onSave}
				>
					Add giveaway
				</RoundButton>
			</View>
		</View>
	);
};

export default AddGiveawayForm;
