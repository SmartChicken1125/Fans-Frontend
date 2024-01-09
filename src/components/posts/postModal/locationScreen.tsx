import { PostStepTypes } from "@usertypes/commonEnums";
import { IPostForm } from "@usertypes/types";
import React, { FC, useState, useEffect } from "react";
import { View } from "react-native";
import { LocationForm } from "../share";
import ModalHeader from "./modalHeader";
import ScreenWrapper from "./screenWrapper";

interface Props {
	data: IPostForm;
	handleChangeTab: (tab: PostStepTypes) => void;
	handleUpdatePostForm: (data: Partial<IPostForm>) => void;
}

const LocationScreen: FC<Props> = (props) => {
	const { data, handleChangeTab, handleUpdatePostForm } = props;
	const [location, setLocation] = useState("");

	const onChangeLocation = (val: string) => {
		setLocation(val);
	};

	const handleSave = () => {
		handleUpdatePostForm({
			location: location,
		});
		handleChangeTab(PostStepTypes.Caption);
	};

	useEffect(() => {
		setLocation(data.location ?? "");
	}, [data.location]);

	return (
		<View>
			<ModalHeader
				title="Add location"
				onClickLeft={() => handleChangeTab(PostStepTypes.Caption)}
				rightLabel="Save"
				onClickRight={handleSave}
			/>
			<ScreenWrapper>
				<LocationForm
					location={location}
					onChangeLocation={onChangeLocation}
					onPressSave={handleSave}
				/>
			</ScreenWrapper>
		</View>
	);
};

export default LocationScreen;
