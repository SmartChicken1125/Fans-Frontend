import { defaultFundraiserFormData } from "@constants/defaultFormData";
import { IAppDispatch } from "@context/appContext";
import { PostsActionType } from "@context/useAppContext";
import { PostStepTypes, IconTypes, PostType } from "@usertypes/commonEnums";
import {
	IPostForm,
	IPickerMedia,
	IFundraiserForm,
	IDateRange,
} from "@usertypes/types";
import React, { FC, useState, useEffect } from "react";
import { View } from "react-native";
import { FundraiserForm } from "../share";
import ModalHeader from "./modalHeader";
import ScreenWrapper from "./screenWrapper";

interface Props {
	data: IPostForm;
	step: PostStepTypes;
	handleChangeTab: (tab: PostStepTypes) => void;
	handleCreatePost: (fundraiser: IFundraiserForm) => void;
	handleCloseModal: () => void;
	dispatch: IAppDispatch;
}

const FundraiserScreen: FC<Props> = (props) => {
	const {
		data,
		handleChangeTab,
		handleCreatePost,
		step,
		handleCloseModal,
		dispatch,
	} = props;
	const [formData, setFormData] = useState<IFundraiserForm>(
		defaultFundraiserFormData,
	);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleChangeForm = (
		name: string,
		val: string | boolean | IPickerMedia,
	) => {
		setFormData({
			...formData,
			[name]: val,
		});
	};

	const handleAddFundraiser = async () => {
		setIsSubmitted(true);
		if (
			formData.title === "" ||
			formData.price === "" ||
			formData.timezone === ""
		) {
			return;
		}
		if (
			parseFloat(formData.price) > 200 ||
			parseFloat(formData.price) < 2
		) {
			return;
		}
		if (data.type === PostType.Fundraiser) {
			handleCreatePost(formData);
		} else {
			dispatch.setPosts({
				type: PostsActionType.updatePostForm,
				data: {
					fundraiser: formData,
				},
			});
			handleChangeTab(PostStepTypes.Caption);
		}
	};

	const onClickBack = () => {
		if (step === PostStepTypes.AddFundraiser) {
			handleChangeTab(PostStepTypes.Caption);
		} else {
			handleCloseModal;
		}
	};

	const handleCacheData = () => {
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: {
				fundraiser: formData,
			},
		});
	};

	const handleChangeDuration = (value: IDateRange) => {
		setFormData({
			...formData,
			...value,
		});
	};

	useEffect(() => {
		if (data.fundraiser) {
			setFormData(data.fundraiser);
		}
	}, []);

	return (
		<View>
			<ModalHeader
				title={
					step === PostStepTypes.AddFundraiser
						? "Add fundraiser"
						: "New post"
				}
				rightLabel={
					step === PostStepTypes.AddFundraiser ? "Save" : "Share"
				}
				onClickRight={handleAddFundraiser}
				onClickLeft={onClickBack}
				titleIcon={
					step === PostStepTypes.NewFundraiserPost
						? IconTypes.Fundraiser
						: undefined
				}
				leftIcon={
					step === PostStepTypes.NewFundraiserPost
						? IconTypes.Close
						: undefined
				}
			/>
			<ScreenWrapper>
				<FundraiserForm
					formData={formData}
					handleCacheData={handleCacheData}
					isSubmitted={isSubmitted}
					handleChangeForm={handleChangeForm}
					handleAddFundraiser={
						data.type === PostType.Fundraiser
							? undefined
							: handleAddFundraiser
					}
					handleChangeDuration={handleChangeDuration}
				/>
			</ScreenWrapper>
		</View>
	);
};

export default FundraiserScreen;
