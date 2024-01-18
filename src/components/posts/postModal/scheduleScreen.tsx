import { IAppDispatch } from "@context/appContext";
import { PostsActionType } from "@context/reducer/postsReducer";
import { PostStepTypes } from "@usertypes/commonEnums";
import {
	IHoursAndMinutes,
	IPostForm,
	IScheduleForm,
	ICalendarDate,
} from "@usertypes/types";
import moment from "moment";
import React, { FC, useState, useEffect } from "react";
import { View } from "react-native";
import { ScheduleForm } from "../share";
import ModalHeader from "./modalHeader";
import ScreenWrapper from "./screenWrapper";

export const defaultForm = {
	startDate: undefined,
	time: {
		hours: 0,
		minutes: 0,
	},
	timezone: "GMT +0:00",
};

interface Props {
	data: IPostForm;
	handlePrev: () => void;
	dispatch: IAppDispatch;
	handleChangeTab: (tab: PostStepTypes) => void;
}

const ScheduleScreen: FC<Props> = (props) => {
	const { data, handlePrev, handleChangeTab, dispatch } = props;

	const [scheduleForm, setScheduleForm] =
		useState<IScheduleForm>(defaultForm);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const onChangeField = (
		name: string,
		val: string | IHoursAndMinutes | ICalendarDate,
	) => {
		setScheduleForm({
			...scheduleForm,
			[name]: val,
		});
	};

	const onClickSave = () => {
		setIsSubmitted(true);
		if (!scheduleForm.startDate || scheduleForm.timezone === "") {
			return;
		}
		// const postbody = {
		// 	startDate: moment(scheduleForm.startDate)
		// 		.utcOffset("+000", true)
		// 		.format(),
		// 	endDate: moment(scheduleForm.startDate)
		// 		.utcOffset("+000", true)
		// 		.format(),
		// 	timezone: scheduleForm.timezone,
		// };
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: {
				schedule: scheduleForm,
			},
		});
		handleChangeTab(PostStepTypes.Caption);
	};

	useEffect(() => {
		setScheduleForm({
			...scheduleForm,
			timezone: data.schedule.timezone,
			startDate: data.schedule.startDate,
		});
	}, []);

	return (
		<View>
			<ModalHeader
				title="Schedule post"
				rightLabel="Save"
				onClickRight={onClickSave}
				onClickLeft={handlePrev}
			/>
			<ScreenWrapper>
				<ScheduleForm
					data={scheduleForm}
					isSubmitted={isSubmitted}
					onChangeField={onChangeField}
					handleSave={onClickSave}
				/>
			</ScreenWrapper>
		</View>
	);
};

export default ScheduleScreen;
