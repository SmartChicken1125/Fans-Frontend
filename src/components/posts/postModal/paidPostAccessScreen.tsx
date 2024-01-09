import { PostStepTypes } from "@usertypes/commonEnums";
import {
	IPostForm,
	ISubscriptionTier,
	IRole,
	IPaidPostAccessForm,
} from "@usertypes/types";
import React, { FC } from "react";
import { View } from "react-native";
import { PaidPostAccessForm } from "../share";
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
const PaidPostAccessScreen: FC<Props> = (props) => {
	const {
		data,
		inProgress,
		handleChangeTab,
		handleUpdatePostForm,
		tiers,
		roles,
	} = props;

	const handleSave = (paidPostAccess: IPaidPostAccessForm) => {
		handleUpdatePostForm({
			paidPostAccess: paidPostAccess,
		});
		handleChangeTab(PostStepTypes.PaidPost);
	};

	return (
		<View>
			<ModalHeader
				title="Paid post"
				onClickLeft={() => handleChangeTab(PostStepTypes.PaidPost)}
			/>
			<ScreenWrapper>
				<PaidPostAccessForm
					postForm={data}
					handleSave={handleSave}
					roles={roles}
					tiers={tiers}
				/>
			</ScreenWrapper>
		</View>
	);
};

export default PaidPostAccessScreen;
