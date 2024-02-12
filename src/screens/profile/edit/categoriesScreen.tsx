import RoundButton from "@components/common/RoundButton";
import { FypText, FypNullableView } from "@components/common/base";
import CustomTopNavBar from "@components/common/customTopNavBar";
import AppLayout, { LayoutContentsContainer } from "@components/common/layout";
import { FansDivider, FansView } from "@components/controls";
import { Category } from "@components/profiles";
import { ProfileActionType, useAppContext } from "@context/useAppContext";
import {
	deleteCategory,
	getCategories,
	updateCategory,
	moveUpCategoryById,
	moveDownCategoryById,
} from "@helper/endpoints/categories/apis";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RoundButtonType } from "@usertypes/commonEnums";
import { ProfileNavigationStacks } from "@usertypes/navigations";
import React, { Fragment, useEffect } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const CategoriesScreen = (
	props: NativeStackScreenProps<ProfileNavigationStacks, "Categories">,
) => {
	const { navigation } = props;
	const insets = useSafeAreaInsets();

	const { state, dispatch } = useAppContext();
	const { categories } = state.profile;

	const handleSave = async () => {};

	const hadleDelete = async (id: string) => {
		dispatch.setShowLoading();
		const resp = await deleteCategory({ id: id }, { id: id });
		if (resp.ok) {
			dispatch.setProfile({
				type: ProfileActionType.updateProfile,
				data: {
					categories: categories.filter((el) => el.id !== id),
				},
			});
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}

		dispatch.setHideLoading();
	};

	const fetchCategories = async () => {
		const resp = await getCategories();
		if (resp.ok) {
			dispatch.setProfile({
				type: ProfileActionType.updateProfile,
				data: {
					categories: resp.data.categories,
				},
			});
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const onToogleCategory = async (categoryId: string, val: boolean) => {
		dispatch.setShowLoading();
		const resp = await updateCategory(
			{ isActive: val },
			{ id: categoryId },
		);
		dispatch.setHideLoading();
		if (resp.ok) {
			const updatedCategories = categories.map((category) =>
				category.id === categoryId
					? {
							...category,
							isActive: val,
					  }
					: category,
			);
			dispatch.setProfile({
				type: ProfileActionType.updateProfile,
				data: {
					categories: updatedCategories,
				},
			});
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message ?? "Failed to update category",
			});
		}
	};

	const handleUpCategory = async (categoryId: string) => {
		const resp = await moveUpCategoryById(null, { id: categoryId });
		if (resp.ok) {
			dispatch.setProfile({
				type: ProfileActionType.updateProfile,
				data: {
					categories: resp.data.categories,
				},
			});
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const handleDownCategory = async (categoryId: string) => {
		const resp = await moveDownCategoryById(null, { id: categoryId });
		if (resp.ok) {
			dispatch.setProfile({
				type: ProfileActionType.updateProfile,
				data: {
					categories: resp.data.categories,
				},
			});
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const onClickAddCategory = () => {
		navigation.navigate("NewCategory");
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	return (
		<AppLayout
			title="Edit Profile | FYP.Fans"
			description="FYP.Fans allows creators to make an income doing what they love!"
		>
			<FansView flex="1">
				<ScrollView style={tw.style("flex-1")}>
					<LayoutContentsContainer>
						<CustomTopNavBar
							title="Add category"
							onClickLeft={() => navigation.goBack()}
							onClickRight={handleSave}
						/>
						<FansView
							padding={{ t: 24, x: 18, b: insets.bottom + 35 }}
						>
							<FypText
								fontSize={17}
								lineHeight={22}
								fontWeight={600}
								margin={{ b: 18 }}
								style={tw.style(
									"text-fans-black dark:text-fans-white",
								)}
							>
								You categories
							</FypText>
							<FansView margin={{ b: 24 }}>
								{categories.map((category, index) => (
									<Fragment key={category.id}>
										<Category
											data={category}
											onClickDelete={() =>
												hadleDelete(category.id)
											}
											onClickEdit={() => {
												navigation.navigate(
													"EditCategory",
													{
														id: category.id,
													},
												);
											}}
											onToggle={(val) =>
												onToogleCategory(
													category.id,
													val,
												)
											}
											onClickUp={() =>
												handleUpCategory(category.id)
											}
											onClickDown={() =>
												handleDownCategory(category.id)
											}
										/>
										<FypNullableView
											visible={
												index !== categories.length - 1
											}
										>
											<FansDivider
												style={tw.style("my-1.5")}
											/>
										</FypNullableView>
									</Fragment>
								))}
							</FansView>

							<RoundButton
								variant={RoundButtonType.OUTLINE_PRIMARY}
								onPress={onClickAddCategory}
							>
								Add category
							</RoundButton>
						</FansView>
					</LayoutContentsContainer>
				</ScrollView>
			</FansView>
		</AppLayout>
	);
};

export default CategoriesScreen;
