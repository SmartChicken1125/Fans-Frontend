import CustomTopNavBar from "@components/common/customTopNavBar";
import { FansView } from "@components/controls";
import { NewCategoryForm } from "@components/posts/share";
import { useAppContext, ProfileActionType } from "@context/useAppContext";
import { createCategory } from "@helper/endpoints/categories/apis";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PostsNavigationStacks } from "@usertypes/navigations";
import { IRole } from "@usertypes/types";
import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const NewCategoryScreen = (
	props: NativeStackScreenProps<PostsNavigationStacks, "NewCategory">,
) => {
	const { navigation } = props;
	const insets = useSafeAreaInsets();

	const { state, dispatch } = useAppContext();
	const { postForm } = state.posts;
	const { roles, categories } = state.profile;

	const [inProgress, setInProgress] = useState(false);
	const [localRoles, setLocalRoles] = useState<IRole[]>([]);
	const [isAll, setIsAll] = useState(true);
	const [categoryName, setCategoryName] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleCancel = () => {
		navigation.goBack();
	};

	const handleEditRole = (roleId: string) => {
		navigation.navigate("Role", { id: roleId });
	};

	const handleSubmit = async () => {
		setIsSubmitted(true);
		if (categoryName === "") {
			return;
		}
		setInProgress(true);
		const resp = await createCategory({
			name: categoryName,
			roleIds: localRoles
				.filter((role) => role.isEnable)
				.map((el) => el.id),
		});
		if (resp.ok) {
			dispatch.setProfile({
				type: ProfileActionType.updateProfile,
				data: {
					categories: [...categories, { ...resp.data }],
				},
			});
		}

		setInProgress(false);

		if (resp.ok) {
			handleCancel();
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	useEffect(() => {
		setLocalRoles(
			roles.map((el) => ({
				...el,
				isEnable: true,
			})),
		);
	}, [roles]);

	useEffect(() => {
		if (postForm.categoryForm) {
			setIsAll(postForm.categoryForm.isAll);
			setCategoryName(postForm.categoryForm.categoryName);
			if (
				!postForm.categoryForm.isAll &&
				postForm.categoryForm.roleIds.length > 0
			) {
				setLocalRoles(
					roles.map((role) =>
						postForm.categoryForm.roleIds.includes(role.id)
							? { ...role, isEnable: true }
							: role,
					),
				);
			}
		}
	}, [postForm.categoryForm]);

	return (
		<FansView
			flex="1"
			position="relative"
			padding={{ t: insets.top }}
			style={tw.style("bg-fans-white dark:bg-fans-black-1d")}
		>
			<CustomTopNavBar
				title="New category"
				onClickLeft={handleCancel}
				onClickRight={handleSubmit}
				rightLabel="Save"
			/>
			<ScrollView style={tw.style("pt-6 px-[18px]")}>
				<NewCategoryForm
					roles={roles}
					categories={categories}
					inProgress={inProgress}
					handleToggleLoading={setInProgress}
					goToBack={() => navigation.goBack()}
					onEditRole={handleEditRole}
					dispatch={dispatch}
					categoryName={categoryName}
					setCategoryName={setCategoryName}
					handleSubmit={handleSubmit}
					isSubmitted={isSubmitted}
					localRoles={localRoles}
					setLocalRoles={setLocalRoles}
					isAll={isAll}
					setIsAll={setIsAll}
				/>
			</ScrollView>
		</FansView>
	);
};

export default NewCategoryScreen;
