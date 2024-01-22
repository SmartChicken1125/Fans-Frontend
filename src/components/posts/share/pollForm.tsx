import { PlusSvg } from "@assets/svgs/common";
import FormControl from "@components/common/FormControl";
import RoundButton from "@components/common/RoundButton";
import {
	FypDropdown,
	FypNullableView,
	FypSwitch,
	FypText,
} from "@components/common/base";
import CustomRadio from "@components/common/customRadio";
import DatePicker from "@components/common/datePicker";
import { FansDivider } from "@components/controls";
import { PollAnswer, PreviewImageField } from "@components/posts/common";
import { timezones } from "@constants/timezones";
import tw from "@lib/tailwind";
import { RoundButtonType } from "@usertypes/commonEnums";
import { ICalendarDate, IPickerMedia, IPollForm } from "@usertypes/types";
import useDocumentPicker from "@utils/useDocumentPicker";
import React, { FC } from "react";
import { Pressable, View } from "react-native";

interface Props {
	formData: IPollForm;
	isSubmitted: boolean;
	handleAddAnswer: () => void;
	handleAddPoll?: () => void;
	onChangeField: (name: string, val: string | boolean | IPickerMedia) => void;
	onDeleteAnswer: (index: number) => void;
	onChangeAnswer: (val: string, index: number) => void;
	voteType: string;
	onChangeVoteType: (val: string) => void;
	publicResult: boolean;
	onChangePublicResult: (val: boolean) => void;
	handleChangeDate: (value: ICalendarDate) => void;
	handleCacheData: () => void;
}

const PollForm: FC<Props> = (props) => {
	const {
		formData,
		handleAddAnswer,
		handleAddPoll,
		onChangeField,
		isSubmitted,
		onDeleteAnswer,
		onChangeAnswer,
		voteType,
		onChangeVoteType,
		publicResult,
		onChangePublicResult,
		handleChangeDate,
		handleCacheData,
	} = props;
	const { useImagePicker } = useDocumentPicker();
	const onChangeImage = async () => {
		const result = await useImagePicker();
		if (result.ok) {
			const medias = result.data;
			if (medias.length > 0) {
				onChangeField("cover", medias[0]);
			}
		}
	};
	return (
		<View>
			<View style={tw.style("px-[18px] md:px-0 mb-7")}>
				<FypText
					fontSize={16}
					lineHeight={21}
					textAlign="center"
					margin={{ b: 44 }}
					style={tw.style("text-fans-black dark:text-fans-white")}
				>
					Create a poll below your post to ask your fans questions and
					get feedback
				</FypText>

				<FormControl
					label="Question"
					placeholder="e.g.Favorite content"
					value={formData.question}
					onChangeText={(val: string) =>
						onChangeField("question", val)
					}
					hasError={isSubmitted && formData.question === ""}
					validateString="Please enter question."
					styles="mb-[30px]"
					onPointerLeave={handleCacheData}
				/>

				<FormControl
					label="Description (optional)"
					placeholder="e.g.Favorite content"
					value={formData.caption}
					onChangeText={(val: string) =>
						onChangeField("caption", val)
					}
					styles="mb-[30px]"
					isTextArea
					onPointerLeave={handleCacheData}
				/>

				<View>
					<FypText
						fontSize={17}
						lineHeight={22}
						margin={{ b: 15 }}
						fontWeight={600}
						style={tw.style("text-fans-black dark:text-fans-white")}
					>
						Answers
					</FypText>
					<View style={tw.style("gap-y-3 mb-3")}>
						{formData.answers.map((answer, i) => (
							<PollAnswer
								value={answer}
								onCancel={() => onDeleteAnswer(i)}
								onChange={(val) => onChangeAnswer(val, i)}
								placeholder={`Option ${i + 1}`}
								key={i}
							/>
						))}
					</View>

					<Pressable
						style={tw.style("flex-row items-center")}
						onPress={handleAddAnswer}
					>
						<PlusSvg width={11.6} height={11.6} color="#a854f5" />
						<FypText
							fontSize={17}
							lineHeight={22}
							margin={{ l: 12 }}
							fontWeight={600}
							style={tw.style("text-fans-purple")}
						>
							Add option
						</FypText>
					</Pressable>
				</View>
			</View>

			<PreviewImageField
				label="Preview image (optional)"
				style="mb-[34px]"
				onChangeImage={onChangeImage}
				data={formData.cover ?? { uri: "", isPicker: true }}
				onCancel={() =>
					onChangeField("cover", { uri: "", isPicker: true })
				}
			/>

			<View style={tw.style("px-[18px] md:px-0")}>
				<View style={tw.style("mb-[30px]")}>
					<DatePicker
						value={formData.endDate}
						onChangeValue={handleChangeDate}
					/>
				</View>
				{/* <View style={tw.style("mb-7")}>
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
						value={formData.timezone}
						onSelect={(val) =>
							onChangeField("timezone", val as string)
						}
						hasError={isSubmitted && formData.timezone === ""}
						validateString="Please select timezone"
					/>
				</View> */}
				<View style={tw.style("mb-4")}>
					<FypText
						fontSize={17}
						lineHeight={22}
						fontWeight={600}
						margin={{ b: 12 }}
						style={tw.style("text-fans-black dark:text-fans-white")}
					>
						Privacy
					</FypText>
					<View
						style={tw.style(
							"flex-row items-center justify-between h-13",
						)}
					>
						<FypText
							fontSize={18}
							lineHeight={24}
							style={tw.style(
								"text-fans-black dark:text-fans-white",
							)}
						>
							Public results
						</FypText>
						<FypSwitch
							value={publicResult}
							onValueChange={onChangePublicResult}
						/>
					</View>
				</View>

				<View style={tw.style("mb-5")}>
					<FypText
						fontSize={17}
						lineHeight={22}
						fontWeight={600}
						margin={{ b: 12 }}
						style={tw.style("text-fans-black dark:text-fans-white")}
					>
						Who can vote
					</FypText>
					<View
						style={tw.style(
							"flex-row items-center justify-between h-13",
						)}
					>
						<CustomRadio
							label="All subscribers"
							onPress={() => onChangeVoteType("all")}
							checked={voteType === "all"}
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
							onPress={() => onChangeVoteType("role")}
							checked={voteType === "role"}
						/>
					</View>
				</View>
				<FypNullableView visible={!!handleAddPoll}>
					<View style={tw.style("mb-5")}>
						<RoundButton
							variant={RoundButtonType.OUTLINE_PRIMARY}
							onPress={handleAddPoll}
						>
							Add poll
						</RoundButton>
					</View>
				</FypNullableView>
			</View>
		</View>
	);
};

export default PollForm;
