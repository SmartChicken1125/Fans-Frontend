import { IAppDispatch } from "@context/appContext";
import { PostsActionType } from "@context/reducer/postsReducer";
import { IPostForm } from "@usertypes/types";
import React, { FC } from "react";
import { View } from "react-native";
import { AdvancedSettingsForm } from "../share";
import ModalHeader from "./modalHeader";
import ScreenWrapper from "./screenWrapper";

interface Props {
	data: IPostForm;
	handlePrev: () => void;
	dispatch: IAppDispatch;
}

const AdvancedSettingsScreen: FC<Props> = (props) => {
	const { data, handlePrev, dispatch } = props;
	const { advanced } = data;
	const handleChange = (name: string, val: boolean) => {
		const updatedAdvanced = {
			...advanced,
			[name]: val,
		};
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: {
				advanced: updatedAdvanced,
			},
		});
	};

	return (
		<View>
			<ModalHeader
				title="Advanced settings"
				onClickLeft={handlePrev}
				rightLabel="Save"
				onClickRight={handlePrev}
			/>
			<ScreenWrapper>
				<AdvancedSettingsForm
					data={data.advanced}
					onChange={handleChange}
				/>
			</ScreenWrapper>
		</View>
	);
};

export default AdvancedSettingsScreen;
