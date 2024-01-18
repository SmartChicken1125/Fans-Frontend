import { IAppDispatch } from "@context/appContext";
import { PostsActionType, ProfileActionType } from "@context/useAppContext";
import { PostStepTypes } from "@usertypes/commonEnums";
import { IPostForm, ISubscriptionTier } from "@usertypes/types";
import React, { FC } from "react";
import { View } from "react-native";
import { NewTierForm } from "../share";
import ModalHeader from "./modalHeader";
import ScreenWrapper from "./screenWrapper";

interface Props {
	data: IPostForm;
	tiers: ISubscriptionTier[];
	handleChangeTab: (tab: PostStepTypes) => void;
	dispatch: IAppDispatch;
	prevScreen: PostStepTypes;
}

const NewTierScreen: FC<Props> = (props) => {
	const { data, dispatch, tiers, handleChangeTab, prevScreen } = props;

	const onCreateTierCallback = (newTier: ISubscriptionTier) => {
		dispatch.setProfile({
			type: ProfileActionType.updateProfile,
			data: {
				tiers: [...tiers, newTier],
			},
		});
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: {
				tiers: [...data.tiers, newTier.id],
			},
		});
		handleChangeTab(prevScreen);
	};

	return (
		<View>
			<ModalHeader
				title="New Tier"
				onClickLeft={() => handleChangeTab(prevScreen)}
			/>
			<ScreenWrapper>
				<NewTierForm
					onCreateCallback={(tier) => {
						onCreateTierCallback(tier);
					}}
				/>
			</ScreenWrapper>
		</View>
	);
};

export default NewTierScreen;
