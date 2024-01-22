import CustomTopNavBar from "@components/common/customTopNavBar";
import { FansView } from "@components/controls";
import { AddGiveawayForm } from "@components/posts/share";
import { defaultAddGiveawayFormData } from "@constants/defaultFormData";
import { PostsActionType, useAppContext } from "@context/useAppContext";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PostsNavigationStacks } from "@usertypes/navigations";
import { ICalendarDate, IGiveawayForm, IPickerMedia } from "@usertypes/types";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AddGiveAwayScreen = (
	props: NativeStackScreenProps<PostsNavigationStacks, "Giveaway">,
) => {
	const { navigation } = props;
	const insets = useSafeAreaInsets();
	const { state, dispatch } = useAppContext();
	const { postForm } = state.posts;

	const [formData, setFormData] = useState<IGiveawayForm>(
		defaultAddGiveawayFormData,
	);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleChangeForm = (name: string, val: string | IPickerMedia) => {
		setFormData({
			...formData,
			[name]: val,
		});
	};

	const onSave = () => {
		setIsSubmitted(true);
		if (formData.prize === "" || formData.winnerCount === "") {
			return;
		}
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: {
				giveaway: formData,
			},
		});
		navigation.goBack();
	};

	const handleChangeDate = (value: ICalendarDate) => {
		setFormData({
			...formData,
			endDate: value,
		});
	};

	useEffect(() => {
		setFormData(postForm.giveaway);
	}, []);

	return (
		<FansView
			flex="1"
			position="relative"
			padding={{ t: insets.top }}
			style={tw.style("bg-fans-white dark:bg-fans-black-1d")}
		>
			<CustomTopNavBar
				title="Add giveaway"
				onClickLeft={() => navigation.goBack()}
				rightLabel="Save"
				onClickRight={onSave}
			/>
			<ScrollView style={{ paddingTop: 24 }}>
				<AddGiveawayForm
					data={formData}
					isSubmitted={isSubmitted}
					onChangeForm={handleChangeForm}
					onSave={onSave}
					handleChangeDate={handleChangeDate}
				/>
			</ScrollView>
		</FansView>
	);
};

export default AddGiveAwayScreen;
