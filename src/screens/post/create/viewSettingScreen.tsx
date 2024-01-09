import CustomTopNavBar from "@components/common/customTopNavBar";
import { FansView } from "@components/controls";
import { ViewSettingForm } from "@components/posts/share";
import {
	useAppContext,
	PostsActionType,
	ProfileActionType,
} from "@context/useAppContext";
import { deleteRole } from "@helper/endpoints/post/apis";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PostsNavigationStacks } from "@usertypes/navigations";
import { IRole } from "@usertypes/types";
import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const ViewSettingScreen = (
	props: NativeStackScreenProps<PostsNavigationStacks, "ViewSetting">,
) => {
	const { navigation } = props;
	const insets = useSafeAreaInsets();

	const { state, dispatch } = useAppContext();
	const { postForm } = state.posts;
	const { roles } = state.profile;

	const [localRoles, setLocalRoles] = useState<IRole[]>([]);
	const [inProgress, setInProgress] = useState(false);

	const handleCancel = () => {
		navigation.goBack();
	};

	const handleEditRole = (roleId: string) => {
		navigation.navigate("Role", { id: roleId });
	};

	const handleDeleteRole = async (roleId: string) => {
		setInProgress(true);
		const resp = await deleteRole({ id: roleId }, { id: roleId });

		if (resp.ok) {
			setLocalRoles(localRoles.filter((el) => el.id !== roleId));
			dispatch.setProfile({
				type: ProfileActionType.updateProfile,
				data: {
					roles: state.posts.roles.filter((el) => el.id !== roleId),
				},
			});
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
		setInProgress(false);
	};

	const handleToggleRole = (roleId: string, val: boolean) => {
		const _roles = localRoles.map((el) =>
			el.id === roleId ? { ...el, isEnable: val } : el,
		);
		setLocalRoles(_roles);
	};

	const hanldeCreateRole = () => {
		navigation.navigate("Role", { id: null });
	};

	const onClickAllSubscribers = (val: boolean) => {
		if (val) {
			dispatch.setPosts({
				type: PostsActionType.updatePostForm,
				data: {
					roles: roles.map((el) => el.id),
					isAllSubscribers: val,
				},
			});
			setLocalRoles(roles.map((el) => ({ ...el, isEnable: true })));
		} else {
			dispatch.setPosts({
				type: PostsActionType.updatePostForm,
				data: {
					roles: [],
					isAllSubscribers: val,
				},
			});
		}
	};

	const onSave = () => {
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: {
				roles: localRoles
					.filter((role) => role.isEnable)
					.map((el) => el.id),
			},
		});
		navigation.goBack();
	};

	useEffect(() => {
		setLocalRoles(
			roles.map((el) => ({
				...el,
				isEnable: postForm.roles.includes(el.id) ? true : false,
			})),
		);
	}, [postForm.roles]);

	return (
		<FansView
			flex="1"
			position="relative"
			padding={{ t: insets.top }}
			style={tw.style("bg-fans-white dark:bg-fans-black-1d")}
		>
			<CustomTopNavBar
				title="Everyone can view"
				onClickLeft={handleCancel}
				onClickRight={onSave}
				rightLabel="Save"
				loading={inProgress}
			/>
			<ScrollView style={tw.style("pt-6")}>
				<View style={tw.style("px-[18px]")}>
					<ViewSettingForm
						roles={localRoles}
						isAll={postForm.isAllSubscribers}
						onClickAllSubscribers={onClickAllSubscribers}
						onCreateRole={hanldeCreateRole}
						onEditRole={handleEditRole}
						onDeleteRole={handleDeleteRole}
						onToggleRole={handleToggleRole}
					/>
				</View>
			</ScrollView>
		</FansView>
	);
};

export default ViewSettingScreen;
