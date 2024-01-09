import { FansView } from "@components/controls";
import { IAppDispatch } from "@context/appContext";
import { PostStepTypes } from "@usertypes/commonEnums";
import { IPostForm } from "@usertypes/types";
import React, { FC } from "react";
import { TagPeopleSearchForm } from "../share";
import ModalHeader from "./modalHeader";
import ScreenWrapper from "./screenWrapper";

interface Props {
	data: IPostForm;
	handleChangeTab: (tab: PostStepTypes) => void;
	dispatch: IAppDispatch;
}

const TagPeopleSearchScreen: FC<Props> = (props) => {
	const { handleChangeTab, data, dispatch } = props;

	return (
		<FansView>
			<ModalHeader
				title="Tag people"
				onClickLeft={() => handleChangeTab(PostStepTypes.TagPeople)}
				rightLabel="Save"
				onClickRight={() => handleChangeTab(PostStepTypes.TagPeople)}
			/>
			<ScreenWrapper>
				<TagPeopleSearchForm
					postForm={data}
					dispatch={dispatch}
					onSaveCallback={() =>
						handleChangeTab(PostStepTypes.TagPeople)
					}
				/>
			</ScreenWrapper>
		</FansView>
	);
};

export default TagPeopleSearchScreen;
