import RoundButton from "@components/common/RoundButton";
import RoundTextInput from "@components/common/RoundTextInput";
import { FypText } from "@components/common/base";
import CustomRadio from "@components/common/customRadio";
import { FansDivider } from "@components/controls";
import { IAppDispatch } from "@context/appContext";
import { ProfileActionType } from "@context/useAppContext";
import { deleteRole } from "@helper/endpoints/role/apis";
import tw from "@lib/tailwind";
import { RoundButtonType } from "@usertypes/commonEnums";
import { ICategory, IRole, IPostCategoryForm } from "@usertypes/types";
import React, { FC } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import ManageRolesForm from "./manageRolesForm";

interface Props {
	goToBack: () => void;
	roles: IRole[];
	inProgress: boolean;
	handleToggleLoading: (val: boolean) => void;
	onEditRole: (roleId: string) => void;
	dispatch: IAppDispatch;
	categories: ICategory[];
	defaultForm?: IPostCategoryForm;
	handlePointerLeave?: (formData: IPostCategoryForm) => void;
	categoryName: string;
	setCategoryName: (val: string) => void;
	handleSubmit: () => void;
	isSubmitted: boolean;
	localRoles: IRole[];
	setLocalRoles: (roles: IRole[]) => void;
	isAll: boolean;
	setIsAll: (val: boolean) => void;
}

const NewCategoryForm: FC<Props> = (props) => {
	const {
		handleToggleLoading,
		goToBack,
		inProgress,
		onEditRole,
		roles,
		dispatch,
		categories,
		defaultForm,
		handlePointerLeave,
		categoryName,
		setCategoryName,
		handleSubmit,
		isSubmitted,
		localRoles,
		setLocalRoles,
		isAll,
		setIsAll,
	} = props;

	const onToggleRole = (roleId: string, val: boolean) => {
		const _roles = localRoles.map((el) =>
			el.id === roleId ? { ...el, isEnable: val } : el,
		);
		setLocalRoles(_roles);
	};

	const onDeleteRole = async (roleId: string) => {
		handleToggleLoading(true);
		const resp = await deleteRole({ id: roleId }, { id: roleId });

		if (resp.ok) {
			setLocalRoles(localRoles.filter((el) => el.id !== roleId));
			dispatch.setProfile({
				type: ProfileActionType.updateProfile,
				data: {
					roles: roles.filter((el) => el.id !== roleId),
				},
			});
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
		handleToggleLoading(false);
	};

	const onChangeShare = (val: boolean) => {
		if (val) {
			const _roles = localRoles.map((el) => ({ ...el, isEnable: val }));
			setLocalRoles(_roles);
		}
		setIsAll(val);
	};

	const onPointerLeave = () => {
		if (handlePointerLeave) {
			handlePointerLeave({
				categoryName,
				isAll,
				roleIds: localRoles
					.filter((el) => el.isEnable)
					.map((role) => role.id),
			});
		}
	};

	return (
		<View>
			<View style={tw.style("mb-[26px]")}>
				<FypText
					fontSize={17}
					lineHeight={22}
					fontWeight={600}
					style={tw.style(
						"mb-[15px] text-fans-black dark:text-fans-white",
					)}
				>
					Category name
				</FypText>

				<RoundTextInput
					placeholder="e.g.DIY Inspiration"
					value={categoryName}
					onChangeText={(val) => setCategoryName(val)}
					hasError={isSubmitted && categoryName === ""}
					helperText="Category name is mandatory field."
					maxLength={50}
					onPointerLeave={onPointerLeave}
				/>
			</View>

			<View style={tw.style("mb-6")}>
				<FypText
					fontSize={17}
					lineHeight={22}
					fontWeight={600}
					style={tw.style(
						"mb-[10px] text-fans-black dark:text-fans-white",
					)}
				>
					Shared with
				</FypText>

				<View style={tw.style("py-4")}>
					<CustomRadio
						label="Everyone"
						checked={isAll}
						onPress={() => onChangeShare(true)}
					/>
				</View>

				<FansDivider style={tw.style("my-1.5")} />

				<View style={tw.style("py-4")}>
					<CustomRadio
						label="Some roles"
						checked={!isAll}
						onPress={() => onChangeShare(false)}
					/>
				</View>

				<ManageRolesForm
					collapsed={isAll}
					roles={localRoles}
					onEditRole={onEditRole}
					onDeleteRole={onDeleteRole}
					onToggleRole={onToggleRole}
				/>
			</View>

			<RoundButton
				variant={RoundButtonType.OUTLINE_PRIMARY}
				onPress={handleSubmit}
				loading={inProgress}
			>
				Create category
			</RoundButton>
		</View>
	);
};

export default NewCategoryForm;
