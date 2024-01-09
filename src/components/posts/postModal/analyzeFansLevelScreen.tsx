import { PostStepTypes } from "@usertypes/commonEnums";
import { IPostForm } from "@usertypes/types";
import React, { FC } from "react";
import { View } from "react-native";
import { AnalyzeFansLevelsContents } from "../share";
import ModalHeader from "./modalHeader";
import ScreenWrapper from "./screenWrapper";

interface Props {
	data: IPostForm;
	handleChangeTab: (tab: PostStepTypes) => void;
}

const AnalyzeFansLevelScreen: FC<Props> = (props) => {
	const { handleChangeTab, data } = props;

	return (
		<View>
			<ModalHeader
				title="Add or edit role"
				rightLabel=""
				onClickRight={() => {}}
				onClickLeft={() => handleChangeTab(PostStepTypes.ViewSetting)}
			/>
			<ScreenWrapper>
				<AnalyzeFansLevelsContents />
			</ScreenWrapper>
		</View>
	);
};

export default AnalyzeFansLevelScreen;
