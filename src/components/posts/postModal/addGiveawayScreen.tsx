import { defaultAddGiveawayFormData } from "@constants/defaultFormData";
import { PostStepTypes } from "@usertypes/commonEnums";
import {
	ICalendarDate,
	IGiveawayForm,
	IPickerMedia,
	IPostForm,
} from "@usertypes/types";
import React, { FC, useEffect, useState } from "react";
import { View } from "react-native";
import { AddGiveawayForm } from "../share";
import ModalHeader from "./modalHeader";
import ScreenWrapper from "./screenWrapper";

interface Props {
	data: IPostForm;
	handleChangeTab: (tab: PostStepTypes) => void;
	handleUpdatePostForm: (data: Partial<IPostForm>) => void;
}

const AddGiveawayScreen: FC<Props> = (props) => {
	const { data, handleChangeTab, handleUpdatePostForm } = props;

	const [formData, setFormData] = useState<IGiveawayForm>(
		defaultAddGiveawayFormData,
	);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleChangeForm = (name: string, val: string | IPickerMedia) => {
		setFormData({
			...formData,
			[name]: val,
		});
	};

	const handleChangeDate = (value: ICalendarDate) => {
		setFormData({
			...formData,
			endDate: value,
		});
	};

	const onSave = () => {
		setIsSubmitted(true);
		if (formData.prize === "" || formData.winnerCount === "") {
			return;
		}
		handleUpdatePostForm({
			giveaway: formData,
		});
		handleChangeTab(PostStepTypes.Caption);
	};

	useEffect(() => {
		setFormData(data.giveaway);
	}, []);

	return (
		<View>
			<ModalHeader
				title="Add giveaway"
				onClickLeft={() => handleChangeTab(PostStepTypes.Caption)}
				rightLabel="Save"
				onClickRight={onSave}
			/>
			<ScreenWrapper>
				<AddGiveawayForm
					data={formData}
					isSubmitted={isSubmitted}
					onChangeForm={handleChangeForm}
					onSave={onSave}
					handleChangeDate={handleChangeDate}
				/>
			</ScreenWrapper>
		</View>
	);
};

export default AddGiveawayScreen;
