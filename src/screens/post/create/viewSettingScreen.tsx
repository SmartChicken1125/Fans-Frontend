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
import { IRole, IFansUser, IPostFormViewType } from "@usertypes/types";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const ViewSettingScreen = (
	props: NativeStackScreenProps<PostsNavigationStacks, "ViewSetting">,
) => {
	const { navigation } = props;
	const insets = useSafeAreaInsets();

	const { state, dispatch } = useAppContext();
	const { postForm } = state.posts;
	const { roles, tiers, subscriptionType } = state.profile;

	const [localRoles, setLocalRoles] = useState<IRole[]>([]);
	const [tierIds, setTierIds] = useState<string[]>([]);
	const [fanUsers, setFanUsers] = useState<IFansUser[]>([]);
	const [inProgress, setInProgress] = useState(false);

	const handleSaveFormData = () => {
		const viewType = postForm.viewType;
		if (viewType === "All") {
			dispatch.setPosts({
				type: PostsActionType.updatePostForm,
				data: {
					roles: [],
					tiers: [],
					users: [],
				},
			});
		} else if (viewType === "XPLevels") {
			dispatch.setPosts({
				type: PostsActionType.updatePostForm,
				data: {
					roles: localRoles
						.filter((role) => role.isEnable)
						.map((el) => el.id),
					tiers: [],
					users: [],
				},
			});
		} else if (viewType === "PaymentTiers") {
			dispatch.setPosts({
				type: PostsActionType.updatePostForm,
				data: {
					roles: [],
					tiers: tierIds,
					users: [],
				},
			});
		} else if (viewType === "SpecificFans") {
			dispatch.setPosts({
				type: PostsActionType.updatePostForm,
				data: {
					roles: [],
					tiers: [],
					users: fanUsers,
				},
			});
		}
	};

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

	const onChangeViewType = (val: IPostFormViewType) => {
		switch (val) {
			case "All":
				dispatch.setPosts({
					type: PostsActionType.updatePostForm,
					data: {
						viewType: val,
						roles: [],
						tiers: [],
						users: [],
					},
				});
				break;
			case "XPLevels":
				dispatch.setPosts({
					type: PostsActionType.updatePostForm,
					data: {
						viewType: val,
						roles: roles.map((el) => el.id),
						tiers: [],
						users: [],
					},
				});
				setLocalRoles(roles.map((el) => ({ ...el, isEnable: true })));
				break;
			case "PaymentTiers":
				dispatch.setPosts({
					type: PostsActionType.updatePostForm,
					data: {
						viewType: val,
						roles: [],
						tiers: tiers.map((tier) => tier.id),
						users: [],
					},
				});
				setTierIds(tiers.map((tier) => tier.id));
				break;
			case "SpecificFans":
				dispatch.setPosts({
					type: PostsActionType.updatePostForm,
					data: {
						viewType: val,
						roles: [],
						tiers: [],
						users: [],
					},
				});
				break;
			default:
				break;
		}
	};

	const onSave = () => {
		handleSaveFormData();
		navigation.goBack();
	};

	const onToggleTier = (tierId: string, val: boolean) => {
		setTierIds(
			tierIds.includes(tierId)
				? tierIds.filter((el) => el !== tierId)
				: [tierId, ...tierIds],
		);
	};

	const onCreateTier = () => {
		handleSaveFormData();
		navigation.navigate("NewTier");
	};

	const onRemoveFanUser = (userId: string) => {
		setFanUsers(fanUsers.filter((user) => user.id !== userId));
	};

	const onAddFanUsers = (users: IFansUser[]) => {
		setFanUsers(users);
	};

	useEffect(() => {
		setLocalRoles(
			roles.map((el) => ({
				...el,
				isEnable: postForm.roles.includes(el.id),
			})),
		);
		setTierIds(postForm.tiers);
		setFanUsers(postForm.users);
	}, [postForm.tiers, postForm.roles, postForm.viewType, postForm.users]);

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
				<FansView padding={{ x: 18, b: 24 }}>
					<ViewSettingForm
						roles={localRoles}
						viewType={postForm.viewType}
						subscriptionType={subscriptionType}
						onChangeViewType={onChangeViewType}
						onCreateRole={hanldeCreateRole}
						onEditRole={handleEditRole}
						onDeleteRole={handleDeleteRole}
						onToggleRole={handleToggleRole}
						tiers={tiers}
						tierIds={tierIds}
						onToggleTier={onToggleTier}
						onCreateTier={onCreateTier}
						fanUsers={fanUsers}
						onRemoveFanUser={onRemoveFanUser}
						onAddFanUsers={onAddFanUsers}
					/>
				</FansView>
			</ScrollView>
		</FansView>
	);
};

export default ViewSettingScreen;
