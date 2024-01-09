import { PostStepTypes } from "@usertypes/commonEnums";
import { IPostForm } from "@usertypes/types";
import React, { FC } from "react";
import { View } from "react-native";
import { InviteNewUserForm } from "../share";
import ModalHeader from "./modalHeader";
import ScreenWrapper from "./screenWrapper";

interface Props {
	data: IPostForm;
	handleChangeTab: (tab: PostStepTypes) => void;
	inProgress: boolean;
	setInProgress: (val: boolean) => void;
}

const InviteNewUserScreen: FC<Props> = (props) => {
	const { data, handleChangeTab, inProgress, setInProgress } = props;

	return (
		<View>
			<ModalHeader
				title="Invite new user"
				onClickLeft={() => handleChangeTab(PostStepTypes.TagPeople)}
			/>
			<ScreenWrapper>
				<InviteNewUserForm
					handleToggleLoading={setInProgress}
					inProgress={inProgress}
				/>
			</ScreenWrapper>
		</View>
	);
};

export default InviteNewUserScreen;
