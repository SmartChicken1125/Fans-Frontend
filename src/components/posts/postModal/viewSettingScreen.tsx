import { IAppDispatch } from "@context/appContext";
import { ProfileActionType } from "@context/useAppContext";
import { deleteRole } from "@helper/endpoints/role/apis";
import { PostStepTypes, SubscriptionTypes } from "@usertypes/commonEnums";
import {
	IPostForm,
	IRole,
	ISubscriptionTier,
	IPostFormViewType,
	IFansUser,
} from "@usertypes/types";
import React, { FC, useEffect, useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { ViewSettingForm } from "../share";
import ModalHeader from "./modalHeader";
import ScreenWrapper from "./screenWrapper";

interface Props {
	data: IPostForm;
	roles: IRole[];
	tiers: ISubscriptionTier[];
	subscriptionType: SubscriptionTypes;
	handleChangeTab: (tab: PostStepTypes) => void;
	handleChangeRole: (roleId: string) => void;
	handleUpdatePostForm: (data: Partial<IPostForm>) => void;
	inProgress: boolean;
	setInProgress: (val: boolean) => void;
	dispatch: IAppDispatch;
	setPrevScreen: (screen: PostStepTypes) => void;
}

const ViewSettingScreen: FC<Props> = (props) => {
	const {
		data,
		roles,
		tiers,
		handleChangeTab,
		handleChangeRole,
		handleUpdatePostForm,
		inProgress,
		setInProgress,
		dispatch,
		setPrevScreen,
		subscriptionType,
	} = props;
	const { viewType } = data;
	const [localRoles, setLocalRoles] = useState<IRole[]>([]);
	const [tierIds, setTierIds] = useState<string[]>([]);
	const [fanUsers, setFanUsers] = useState<IFansUser[]>([]);

	const handleSaveFormData = () => {
		if (viewType === "All") {
			handleUpdatePostForm({
				roles: [],
				tiers: [],
				users: [],
			});
		} else if (viewType === "XPLevels") {
			handleUpdatePostForm({
				roles: localRoles
					.filter((role) => role.isEnable)
					.map((el) => el.id),
				tiers: [],
				users: [],
			});
		} else if (viewType === "PaymentTiers") {
			handleUpdatePostForm({
				roles: [],
				tiers: tierIds,
				users: [],
			});
		} else if (viewType === "SpecificFans") {
			handleUpdatePostForm({
				roles: [],
				tiers: [],
				users: fanUsers,
			});
		}
	};

	const onClickSave = () => {
		handleSaveFormData();
		handleChangeTab(PostStepTypes.Caption);
	};

	const onChangeViewType = (val: IPostFormViewType) => {
		switch (val) {
			case "All":
				handleUpdatePostForm({
					viewType: val,
					roles: [],
					tiers: [],
					users: [],
				});
				break;
			case "XPLevels":
				handleUpdatePostForm({
					viewType: val,
					roles: roles.map((el) => el.id),
					tiers: [],
					users: [],
				});
				setLocalRoles(roles.map((el) => ({ ...el, isEnable: true })));
				break;
			case "PaymentTiers":
				handleUpdatePostForm({
					viewType: val,
					roles: [],
					tiers: tiers.map((tier) => tier.id),
					users: [],
				});
				setTierIds(tiers.map((tier) => tier.id));
				break;
			case "SpecificFans":
				handleUpdatePostForm({
					viewType: val,
					roles: [],
					tiers: [],
					users: [],
				});
				break;
			default:
				break;
		}
	};

	const onCreateRole = () => {
		handleChangeTab(PostStepTypes.Role);
	};

	const onToggleRole = (roleId: string, val: boolean) => {
		const _roles = localRoles.map((el) =>
			el.id === roleId ? { ...el, isEnable: val } : el,
		);
		setLocalRoles(_roles);
	};

	const handleDeleteRole = async (roleId: string) => {
		setInProgress(true);
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
		setInProgress(false);
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
		setPrevScreen(PostStepTypes.ViewSetting);
		handleChangeTab(PostStepTypes.NewTier);
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
				isEnable: data.roles.includes(el.id),
			})),
		);
		setTierIds(data.tiers);
		setFanUsers(data.users);
	}, [data.tiers, data.roles, viewType, data.users]);

	return (
		<View>
			<ModalHeader
				title="Everyone can view"
				rightLabel="Save"
				onClickRight={onClickSave}
				onClickLeft={() => handleChangeTab(PostStepTypes.Caption)}
				loading={inProgress}
			/>
			<ScreenWrapper>
				<ViewSettingForm
					roles={localRoles}
					viewType={viewType}
					subscriptionType={subscriptionType}
					onChangeViewType={onChangeViewType}
					onCreateRole={onCreateRole}
					onEditRole={handleChangeRole}
					onDeleteRole={handleDeleteRole}
					onToggleRole={onToggleRole}
					tiers={tiers}
					tierIds={tierIds}
					onToggleTier={onToggleTier}
					onCreateTier={onCreateTier}
					fanUsers={fanUsers}
					onRemoveFanUser={onRemoveFanUser}
					onAddFanUsers={onAddFanUsers}
				/>
			</ScreenWrapper>
		</View>
	);
};

export default ViewSettingScreen;
