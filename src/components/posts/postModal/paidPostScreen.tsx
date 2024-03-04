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

	const paidPost = data.paidPost;
	const thumbs = paidPost?.thumbs ?? [];

	const [price, setPrice] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	// const [previews, setPreviews] = useState<IPickerMedia[]>([]);

	const handlePressAccess = () => {
		handleUpdatePostForm({
			paidPost: {
				currency: "USD",
				price: price,
				thumbs: thumbs,
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
				thumbs: thumbs,
			},
		});
		handleChangeTab(PostStepTypes.Caption);
	};

	const handleSavePreviews = (medias: IPickerMedia[]) => {
		handleUpdatePostForm({
			paidPost: {
				currency: "USD",
				price: price,
				thumbs: medias,
			},
		});
	};

	const handleChangePreview = (media: IPickerMedia) => {
		const previewIds = thumbs.map((el) => el.id);
		if (previewIds.includes(media.id)) {
			handleSavePreviews(
				thumbs.map((el) => (el.id === media.id ? media : el)),
			);
		} else {
			handleSavePreviews([...thumbs, media]);
		}
	};

	const handleDeletePreview = (mediaId: string) => {
		handleSavePreviews(thumbs.filter((el) => el.id !== mediaId));
	};

	const handleAddPreviews = (medias: IPickerMedia[]) => {
		handleSavePreviews([...thumbs, ...medias]);
	};

	useEffect(() => {
		setPrice(data.paidPost?.price as string);
		// if (data.paidPost) {
		// 	setPreviews(data.paidPost.thumbs);
		// }
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
					previews={thumbs}
					onChangePreview={handleChangePreview}
					onRemovePreview={handleDeletePreview}
					onAddPreviews={handleAddPreviews}
					isSubmitted={isSubmitted}
					onChangePrice={setPrice}
					handleSave={handleSave}
				/>
			</ScreenWrapper>
		</View>
	);
};

export default PaidPostScreen;
