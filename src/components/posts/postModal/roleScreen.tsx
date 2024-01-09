import { roleIcons } from "@constants/common";
import { defaultRoleFormData } from "@constants/defaultFormData";
import { IAppDispatch } from "@context/appContext";
import { ProfileActionType } from "@context/useAppContext";
import { createRole, updateRole } from "@helper/endpoints/role/apis";
import { PostStepTypes, MediaType } from "@usertypes/commonEnums";
import { IRole, IRoleIcon, IPickerMedia, IPostForm } from "@usertypes/types";
import useUploadFiles from "@utils/useUploadFile";
import React, { FC, useState, useEffect } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { RoleForm } from "../share";
import ModalHeader from "./modalHeader";
import ScreenWrapper from "./screenWrapper";

interface Props {
	data: IPostForm;
	roleId: string;
	roles: IRole[];
	handleChangeTab: (tab: PostStepTypes) => void;
	inProgress: boolean;
	setInProgress: (val: boolean) => void;
	prevScreen: PostStepTypes;
	dispatch: IAppDispatch;
}

const RoleScreen: FC<Props> = (props) => {
	const { roleId, roles, handleChangeTab, prevScreen, dispatch } = props;
	const { uploadFiles } = useUploadFiles();

	const [inProgress, setInProgress] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [formData, setFormData] = useState<IRole>(defaultRoleFormData);
	const [icon, setIcon] = useState<IRoleIcon | null>(null);
	const [imageIcon, setImageIcon] = useState<IPickerMedia | null>(null);

	const onViewFansLevel = () => {
		handleChangeTab(PostStepTypes.AnalyzeFansLevels);
	};

	const onChangeForm = (name: string, val: string) => {
		setFormData({
			...formData,
			[name]: val,
		});
	};

	const handleCreate = async () => {
		setInProgress(true);
		let roleIcon = formData.icon;
		if (imageIcon && imageIcon.isPicker) {
			const resp = await uploadFiles([
				{ uri: imageIcon.uri, type: MediaType.Image },
			]);
			if (resp?.ok) {
				roleIcon = resp.data[0].url;
			}
		}
		const postbody = {
			name: formData.name,
			color: formData.color,
			icon: roleIcon,
			level: parseInt(formData.level as string),
		};
		const resp = await createRole(postbody);
		setInProgress(false);
		if (resp.ok) {
			const sortedRoles = [
				...roles,
				{ ...resp.data, level: resp.data.level.toString() },
			].sort((p1, p2) =>
				p1.level < p2.level ? 1 : p1.level > p2.level ? -1 : 0,
			);
			dispatch.setProfile({
				type: ProfileActionType.updateProfile,
				data: {
					roles: sortedRoles,
				},
			});
			handleChangeTab(prevScreen);
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const handleEdit = async () => {
		setInProgress(true);
		let roleIcon = formData.icon;
		if (imageIcon && imageIcon.isPicker) {
			const resp = await uploadFiles([
				{ uri: imageIcon.uri, type: MediaType.Image },
			]);
			if (resp?.ok) {
				roleIcon = resp.data[0].url;
			}
		}
		const postbody = {
			name: formData.name,
			color: formData.color,
			icon: roleIcon,
			level: parseInt(formData.level as string),
		};
		const resp = await updateRole(postbody, { id: roleId as string });
		setInProgress(false);
		if (resp.ok) {
			const sortedRoles = roles
				.map((el) =>
					el.id === roleId
						? {
								...formData,
								id: roleId,
								icon: roleIcon,
								level: formData.level.toString(),
						  }
						: el,
				)
				.sort((p1, p2) =>
					p1.level < p2.level ? 1 : p1.level > p2.level ? -1 : 0,
				);
			dispatch.setProfile({
				type: ProfileActionType.updateProfile,
				data: {
					roles: sortedRoles,
				},
			});

			handleChangeTab(prevScreen);
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const handleSubmit = () => {
		setIsSubmitted(true);
		const errors = {
			name: formData.name === "",
			color: formData.color === "",
			icon: formData.icon === "" && !imageIcon,
			level: formData.level === "",
		};

		if (Object.values(errors).includes(true)) {
			return;
		}

		if (roleId) {
			handleEdit();
		} else {
			handleCreate();
		}
	};

	useEffect(() => {
		if (roleId) {
			const role = roles.find((el) => el.id === (roleId as string));
			setFormData({
				id: role?.id ?? "",
				name: role?.name ?? "",
				color: role?.color ?? "",
				icon: role?.icon ?? "",
				level: role?.level ? role.level.toString() : "",
			});
			if (roleIcons.find((el) => el.name === role?.icon)) {
				setIcon(roleIcons.find((el) => el.name === role?.icon) ?? null);
				setImageIcon(null);
			} else {
				setImageIcon({ uri: role?.icon ?? "", isPicker: false });
				setIcon(null);
			}
		} else {
			setIcon(roleIcons[0]);
			setImageIcon(null);
		}
	}, [roleId, roles]);

	return (
		<View>
			<ModalHeader
				title="Add or edit role"
				onClickLeft={() => handleChangeTab(prevScreen)}
				rightLabel="Save"
				onClickRight={handleSubmit}
			/>
			<ScreenWrapper>
				<RoleForm
					id={roleId}
					inProgress={inProgress}
					onViewFansLevel={onViewFansLevel}
					formData={formData}
					onChangeForm={onChangeForm}
					isSubmitted={isSubmitted}
					icon={icon}
					onChangeIcon={setIcon}
					imageIcon={imageIcon}
					onChangeImageIcon={setImageIcon}
					handleSubmit={handleSubmit}
				/>
			</ScreenWrapper>
		</View>
	);
};

export default RoleScreen;
