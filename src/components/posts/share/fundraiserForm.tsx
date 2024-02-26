import FormControl from "@components/common/FormControl";
import RoundButton from "@components/common/RoundButton";
import {
	FypDropdown,
	FypText,
	FypNullableView,
	FypDateRangePicker,
	FypSwitch,
} from "@components/common/base";
import { PreviewImageField } from "@components/posts/common";
import { defaultPickerMedia } from "@constants/common";
import { timezones } from "@constants/timezones";
import tw from "@lib/tailwind";
import { RoundButtonType } from "@usertypes/commonEnums";
import { IFundraiserForm, IPickerMedia, IDateRange } from "@usertypes/types";
import useDocumentPicker from "@utils/useDocumentPicker";
import React, { FC } from "react";
import { View } from "react-native";

interface Props {
	formData: IFundraiserForm;
	isSubmitted: boolean;
	handleChangeForm: (
		name: string,
		val: string | boolean | IPickerMedia,
	) => void;
	handleAddFundraiser?: () => void;
	handleCacheData: () => void;
	handleChangeDuration: (value: IDateRange) => void;
}

const FundraiserForm: FC<Props> = (props) => {
	const {
		formData,
		handleChangeForm,
		isSubmitted,
		handleAddFundraiser,
		handleCacheData,
		handleChangeDuration,
	} = props;
	const { useImagePicker } = useDocumentPicker();

	const onChangeImage = async () => {
		const result = await useImagePicker();
		if (result.ok) {
			const medias = result.data;
			if (medias.length > 0) {
				handleChangeForm("cover", medias[0]);
			}
		}
	};

	const handleCancelCover = () => {
		handleChangeForm("cover", defaultPickerMedia);
	};

	return (
		<View>
			<View style={tw.style("px-[18px] md:px-0")}>
				<FypText
					fontSize={16}
					lineHeight={21}
					textAlign="center"
					margin={{ b: 44 }}
					style={tw.style("text-fans-black dark:text-fans-white")}
				>
					Launch a fundraising campaign for personal of meaningful
					causes, set targets, and engage fans in supporting your
					vision
				</FypText>

				<View style={tw.style("mb-[30px]")}>
					<FormControl
						label="Fundraiser title"
						value={formData.title}
						onChangeText={(val: string) =>
							handleChangeForm("title", val as string)
						}
						placeholder="Enter fundraiser title"
						hasError={isSubmitted && formData.title === ""}
						validateString="Title is mandatory field."
						onPointerLeave={handleCacheData}
					/>
				</View>
				<FormControl
					label="Description (optional)"
					value={formData.caption}
					onChangeText={(val: string) =>
						handleChangeForm("caption", val as string)
					}
					placeholder="Write a description..."
					isTextArea
					styles="mb-8"
					onPointerLeave={handleCacheData}
				/>
			</View>

			<PreviewImageField
				label="Cover image (optional)"
				style="mb-[34px]"
				onChangeImage={onChangeImage}
				data={formData.cover ?? defaultPickerMedia}
				onCancel={handleCancelCover}
			/>

			<View style={tw.style("px-[18px] pb-[104px] md:px-0 md:pb-10")}>
				<View style={tw.style("mb-[30px]")}>
					<FormControl
						label="Target amount (USD)"
						value={formData.price}
						onChangeText={(val: string) =>
							handleChangeForm("price", val)
						}
						placeholder="e.g.25"
						hasError={
							isSubmitted &&
							(formData.price === "" ||
								parseFloat((formData.price as string) ?? "0") >
									200 ||
								parseFloat((formData.price as string) ?? "0") <
									2)
						}
						validateString={
							formData.price === ""
								? "Price is mandatory field"
								: "Price should be between $2 ~ $200"
						}
						keyboardType="numeric"
						onPointerLeave={handleCacheData}
					/>
				</View>

				<View style={tw.style("mb-7")}>
					<FypDateRangePicker
						label="Duration"
						value={{
							startDate: formData.startDate,
							endDate: formData.endDate,
						}}
						onChangeValue={handleChangeDuration}
					/>
				</View>

				<View style={tw.style("mb-7")}>
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
						search
						data={timezones.map((tz) => ({
							data: tz.tzCode,
							label: tz.name,
						}))}
						value={formData.timezone}
						onSelect={(val) =>
							handleChangeForm("timezone", val as string)
						}
						hasError={isSubmitted && formData.timezone === ""}
						validateString="Please select timezone"
					/>
				</View>

				<View style={tw.style("mb-5")}>
					<FypText
						fontSize={17}
						lineHeight={22}
						fontWeight={600}
						margin={{ b: 12 }}
						style={tw.style("text-fans-black dark:text-fans-white")}
					>
						Experience points
					</FypText>
					<View
						style={tw.style(
							"flex-row items-center justify-between",
						)}
					>
						<FypText
							fontSize={17}
							lineHeight={22}
							fontWeight={600}
							style={tw.style(
								"text-fans-black dark:text-fans-white",
							)}
						>
							Give XP for donations?
						</FypText>
						<FypSwitch
							value={formData.isXpAdd}
							onValueChange={(val) =>
								handleChangeForm("isXpAdd", val)
							}
						/>
					</View>
				</View>
				<FypNullableView visible={!!handleAddFundraiser}>
					<RoundButton
						variant={RoundButtonType.OUTLINE_PRIMARY}
						onPress={handleAddFundraiser}
					>
						Add fundraiser
					</RoundButton>
				</FypNullableView>
			</View>
		</View>
	);
};

export default FundraiserForm;
