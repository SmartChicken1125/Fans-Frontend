import { defaultPostFormData } from "@constants/defaultFormData";
import { IAppDispatch } from "@context/appContext";
import { PostsActionType, ProfileActionType } from "@context/useAppContext";
import { createCategory } from "@helper/endpoints/categories/apis";
import { PostStepTypes } from "@usertypes/commonEnums";
import {
	IPostForm,
	IRole,
	ICategory,
	IPostCategoryForm,
} from "@usertypes/types";
import React, { FC, useState, useEffect } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { NewCategoryForm } from "../share";
import ModalHeader from "./modalHeader";
import ScreenWrapper from "./screenWrapper";

interface Props {
	data: IPostForm;
	roles: IRole[];
	handleChangeTab: (tab: PostStepTypes) => void;
	inProgress: boolean;
	setInProgress: (val: boolean) => void;
	handleChangeRole: (roleId: string) => void;
	dispatch: IAppDispatch;
	categories: ICategory[];
}

const NewCategoryScreen: FC<Props> = (props) => {
	const {
		data,
		roles,
		handleChangeTab,
		setInProgress,
		inProgress,
		handleChangeRole,
		dispatch,
		categories,
	} = props;

	const [localRoles, setLocalRoles] = useState<IRole[]>([]);
	const [isAll, setIsAll] = useState(true);
	const [categoryName, setCategoryName] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handlePointerLeave = (formData: IPostCategoryForm) => {
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: {
				categoryForm: formData,
			},
		});
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
			if (handlePointerLeave) {
				handlePointerLeave(defaultPostFormData.categoryForm);
			}
			dispatch.setProfile({
				type: ProfileActionType.updateProfile,
				data: {
					categories: [...categories, { ...resp.data }],
				},
			});
		}

		setInProgress(false);

		if (resp.ok) {
			handleChangeTab(PostStepTypes.Categories);
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
		if (data.categoryForm) {
			setIsAll(data.categoryForm.isAll);
			setCategoryName(data.categoryForm.categoryName);
			if (
				!data.categoryForm.isAll &&
				data.categoryForm.roleIds.length > 0
			) {
				setLocalRoles(
					roles.map((role) =>
						data.categoryForm.roleIds.includes(role.id)
							? { ...role, isEnable: true }
							: role,
					),
				);
			}
		}
	}, [data.categoryForm]);

	return (
		<View>
			<ModalHeader
				title="New category"
				onClickLeft={() => handleChangeTab(PostStepTypes.Categories)}
			/>
			<ScreenWrapper>
				<NewCategoryForm
					roles={roles}
					handleToggleLoading={setInProgress}
					inProgress={inProgress}
					goToBack={() => handleChangeTab(PostStepTypes.Categories)}
					onEditRole={handleChangeRole}
					dispatch={dispatch}
					categories={categories}
					defaultForm={data.categoryForm}
					handlePointerLeave={handlePointerLeave}
					categoryName={categoryName}
					setCategoryName={setCategoryName}
					handleSubmit={handleSubmit}
					isSubmitted={isSubmitted}
					localRoles={localRoles}
					setLocalRoles={setLocalRoles}
					isAll={isAll}
					setIsAll={setIsAll}
				/>
			</ScreenWrapper>
		</View>
	);
};

export default NewCategoryScreen;
