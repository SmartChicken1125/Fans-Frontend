import CustomTopNavBar from "@components/common/customTopNavBar";
import { FansView } from "@components/controls";
import { LocationForm } from "@components/posts/share";
import { useAppContext, PostsActionType } from "@context/useAppContext";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PostsNavigationStacks } from "@usertypes/navigations";
import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LocationScreen = (
	props: NativeStackScreenProps<PostsNavigationStacks, "Location">,
) => {
	const { navigation } = props;
	const insets = useSafeAreaInsets();
	const { state, dispatch } = useAppContext();
	const { postForm } = state.posts;
	const [location, setLocation] = useState("");

	const onChangeLocation = (val: string) => {
		setLocation(val);
	};

	const handleSave = () => {
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: {
				location: location,
			},
		});
		navigation.goBack();
	};

	useEffect(() => {
		setLocation(postForm.location ?? "");
	}, [postForm.location]);

	return (
		<FansView
			flex="1"
			position="relative"
			padding={{ t: insets.top }}
			style={tw.style("bg-fans-white dark:bg-fans-black-1d")}
		>
			<CustomTopNavBar
				title="Add location"
				onClickLeft={() => navigation.goBack()}
				onClickRight={handleSave}
				rightLabel="Save"
			/>
			<ScrollView style={tw.style("pt-6 px-[18px]")}>
				<LocationForm
					location={location}
					onChangeLocation={onChangeLocation}
					onPressSave={handleSave}
				/>
			</ScrollView>
		</FansView>
	);
};

export default LocationScreen;
