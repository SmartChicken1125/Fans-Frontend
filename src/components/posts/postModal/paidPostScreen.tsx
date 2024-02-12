import { defaultPickerMedia } from "@constants/common";
import { PostStepTypes } from "@usertypes/commonEnums";
import {
	IPostForm,
	ISubscriptionTier,
	IRole,
	IPickerMedia,
} from "@usertypes/types";
import React, { FC, useState, useEffect } from "react";
import { View } from "react-native";
import { PaidPostForm } from "../share";
import ModalHeader from "./modalHeader";
import ScreenWrapper from "./screenWrapper";

interface Props {
	data: IPostForm;
	tiers: ISubscriptionTier[];
	roles: IRole[];
	inProgress: boolean;
	handleChangeTab: (tab: PostStepTypes) => void;
	handleUpdatePostForm: (data: Partial<IPostForm>) => void;
}
const PaidPostScreen: FC<Props> = (props) => {
	const {
		data,
		handleChangeTab,
		handleUpdatePostForm,
		inProgress,
		tiers,
		roles,
	} = props;

	const [price, setPrice] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [coverImg, setCoverImg] = useState<IPickerMedia>(defaultPickerMedia);

	const handlePressAccess = () => {
		handleUpdatePostForm({
			paidPost: {
				currency: "USD",
				price: price,
				thumb: coverImg,
			},
		});
		handleChangeTab(PostStepTypes.PaidPostAccess);
	};

	const handleSave = () => {
		setIsSubmitted(true);
		if (
			price === "" ||
			parseFloat(price) > 200 ||
			parseFloat(price ?? "0") < 2
		) {
			return;
		}
		handleUpdatePostForm({
			paidPost: {
				currency: "USD",
				price: price,
				thumb: coverImg,
			},
		});
		handleChangeTab(PostStepTypes.Caption);
	};

	useEffect(() => {
		setPrice(data.paidPost?.price as string);
		if (data.paidPost) {
			setCoverImg(data.paidPost.thumb);
		}
	}, []);

	return (
		<View>
			<ModalHeader
				title="Paid post"
				onClickLeft={() => handleChangeTab(PostStepTypes.Caption)}
				rightLabel="Save"
				onClickRight={handleSave}
			/>
			<ScreenWrapper>
				<PaidPostForm
					postForm={data}
					tiers={tiers}
					roles={roles}
					inProgress={inProgress}
					handleUpdatePostForm={handleUpdatePostForm}
					handlePressAccess={handlePressAccess}
					price={price}
					coverImg={coverImg}
					onChangeCoverImage={(img) => setCoverImg(img)}
					isSubmitted={isSubmitted}
					onChangePrice={setPrice}
					handleSave={handleSave}
				/>
			</ScreenWrapper>
		</View>
	);
};

export default PaidPostScreen;
