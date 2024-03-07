import { defaultPostFormData } from "@constants/defaultFormData";
import {
	ActionType,
	IconTypes,
	PostStepTypes,
	PostType,
} from "@usertypes/commonEnums";
import { IPostForm } from "@usertypes/types";
import React, { FC, useState, useEffect } from "react";
import { View } from "react-native";
import { CaptionForm } from "../share";
import ModalHeader from "./modalHeader";
import ScreenWrapper from "./screenWrapper";

interface Props {
	data: IPostForm;
	inProgress: boolean;
	progress: number;
	titleIcon: IconTypes;
	handleClearForm: () => void;
	handleNext: () => void;
	handleChangeTab: (tab: PostStepTypes) => void;
	handleUpdatePostForm: (data: Partial<IPostForm>) => void;
}

const CaptionScreen: FC<Props> = (props) => {
	const {
		data,
		inProgress,
		progress,
		titleIcon,
		handleClearForm,
		handleNext,
		handleChangeTab,
		handleUpdatePostForm,
	} = props;

	const [caption, setCaption] = useState("");

	const handleSave = () => {
		handleNext();
	};

	const handleChangeCaption = (val: string) => {
		setCaption(val);
	};

	const getRightLabel = () => {
		const action =
			data.id === defaultPostFormData.id
				? ActionType.Create
				: ActionType.Update;
		if (data.type === PostType.Text) {
			return action === ActionType.Create ? "Share" : "Save";
		} else {
			return data.medias.length === 0
				? ""
				: action === ActionType.Create
				? "Share"
				: "Save";
		}
	};

	const handlePrev = () => {
		if (data.id !== defaultPostFormData.id) {
			handleClearForm();
			return;
		}

		switch (data.type) {
			case PostType.Text:
				handleChangeTab(PostStepTypes.Text);
				break;
			case PostType.Vault:
				handleChangeTab(PostStepTypes.Vault);
				break;
			default:
				handleChangeTab(PostStepTypes.Thumbnail);
				break;
		}
	};

	const onPointerLeave = () => {
		handleUpdatePostForm({
			caption: caption,
		});
	};

	useEffect(() => {
		setCaption(data.caption);
	}, [data.caption]);

	return (
		<View>
			<ModalHeader
				title="New post"
				rightLabel={getRightLabel()}
				onClickRight={handleSave}
				onClickLeft={handlePrev}
				titleIcon={titleIcon}
				loading={inProgress}
			/>
			<ScreenWrapper>
				<CaptionForm
					data={data}
					caption={caption}
					onChangeCaption={handleChangeCaption}
					onNavigateLink={(link) => {
						onPointerLeave();
						handleChangeTab(link.stepType);
					}}
					onPointerLeave={onPointerLeave}
				/>
			</ScreenWrapper>
		</View>
	);
};

export default CaptionScreen;
