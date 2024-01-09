import { defaultPollFormData } from "@constants/defaultFormData";
import { IAppDispatch } from "@context/appContext";
import { PostsActionType } from "@context/useAppContext";
import { PostStepTypes, IconTypes, PostType } from "@usertypes/commonEnums";
import {
	IPostForm,
	IPollForm,
	IPickerMedia,
	IDateRange,
} from "@usertypes/types";
import React, { FC, useEffect, useState } from "react";
import { View } from "react-native";
import { PollForm } from "../share";
import ModalHeader from "./modalHeader";
import ScreenWrapper from "./screenWrapper";

interface Props {
	data: IPostForm;
	step: PostStepTypes;
	handleChangeTab: (tab: PostStepTypes) => void;
	handleCreate: (poll: IPollForm) => void;
	handleCloseModal: () => void;
	dispatch: IAppDispatch;
}

const AddPollScreen: FC<Props> = (props) => {
	const {
		data: postForm,
		step,
		handleChangeTab,
		handleCreate,
		handleCloseModal,
		dispatch,
	} = props;

	const [formData, setFormData] = useState<IPollForm>(defaultPollFormData);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const [publicResult, setPublicResult] = useState(false);
	const [voteType, setVoteType] = useState("all");

	const handleAddAnswer = () => {
		setFormData({
			...formData,
			answers: [...formData.answers, ""],
		});
	};

	const onChangeField = (
		name: string,
		val: string | boolean | IPickerMedia,
	) => {
		setFormData({
			...formData,
			[name]: val,
		});
	};

	const onChangeAnswer = (val: string, index: number) => {
		const answers = formData.answers.map((answer, i) =>
			i === index ? val : answer,
		);
		setFormData({
			...formData,
			answers: answers,
		});
	};

	const handleCacheData = () => {
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: {
				poll: formData,
			},
		});
	};

	const handleChangeDuration = (value: IDateRange) => {
		setFormData({
			...formData,
			...value,
		});
	};

	const onDeleteAnswer = (index: number) => {
		setFormData({
			...formData,
			answers: formData.answers.filter((el, i) => i !== index),
		});
	};

	const onSave = async () => {
		setIsSubmitted(true);
		if (formData.question === "") {
			return;
		}
		if (postForm.type === PostType.Poll) {
			handleCreate(formData);
		} else {
			dispatch.setPosts({
				type: PostsActionType.updatePostForm,
				data: {
					poll: formData,
				},
			});
			handleChangeTab(PostStepTypes.Caption);
		}
	};

	useEffect(() => {
		if (postForm.poll) {
			setFormData(postForm.poll);
		}
	}, [postForm.poll]);

	const onClickLeft = () => {
		if (step === PostStepTypes.NewPollPost) {
			handleCloseModal();
		} else {
			handleChangeTab(PostStepTypes.Caption);
		}
	};

	return (
		<View>
			<ModalHeader
				title={step === PostStepTypes.AddPoll ? "Add poll" : "New post"}
				rightLabel={step === PostStepTypes.AddPoll ? "Save" : "Share"}
				onClickRight={onSave}
				onClickLeft={onClickLeft}
				titleIcon={
					step === PostStepTypes.NewPollPost
						? IconTypes.Poll
						: undefined
				}
				leftIcon={
					step === PostStepTypes.NewPollPost
						? IconTypes.Close
						: undefined
				}
			/>
			<ScreenWrapper>
				<PollForm
					formData={formData}
					handleAddAnswer={handleAddAnswer}
					handleAddPoll={
						postForm.type === PostType.Poll ? undefined : onSave
					}
					onChangeField={onChangeField}
					isSubmitted={isSubmitted}
					onDeleteAnswer={onDeleteAnswer}
					onChangeAnswer={onChangeAnswer}
					voteType={voteType}
					onChangeVoteType={(val) => setVoteType(val)}
					publicResult={publicResult}
					onChangePublicResult={(val) => setPublicResult(val)}
					handleChangeDuration={handleChangeDuration}
					handleCacheData={handleCacheData}
				/>
			</ScreenWrapper>
		</View>
	);
};

export default AddPollScreen;
