import CustomTopNavBar from "@components/common/customTopNavBar";
import { FansView } from "@components/controls";
import { RoleForm } from "@components/posts/share";
import { roleIcons } from "@constants/common";
import { defaultRoleFormData } from "@constants/defaultFormData";
import { useAppContext, ProfileActionType } from "@context/useAppContext";
import { createRole, updateRole } from "@helper/endpoints/role/apis";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MediaType } from "@usertypes/commonEnums";
import { PostsNavigationStacks } from "@usertypes/navigations";
import { IRole, IRoleIcon, IPickerMedia } from "@usertypes/types";
import useUploadFiles from "@utils/useUploadFile";
import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const RoleScreen = (
	props: NativeStackScreenProps<PostsNavigationStacks, "Role">,
) => {
	const { navigation, route } = props;
	const { id } = route.params;
	const insets = useSafeAreaInsets();

	const { state, dispatch } = useAppContext();
	const { roles } = state.profile;
	const { uploadFiles } = useUploadFiles();

	const [inProgress, setInProgress] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [formData, setFormData] = useState<IRole>(defaultRoleFormData);
	const [icon, setIcon] = useState<IRoleIcon | null>(null);
	const [imageIcon, setImageIcon] = useState<IPickerMedia | null>(null);

	const handleViewFansLevel = () => {
		navigation.navigate("FansLevels");
	};

	const handleToggleLoading = (val: boolean) => {
		if (val) {
			setInProgress(true);
		} else {
			setInProgress(false);
		}
	};

	const onChangeForm = (name: string, val: string) => {
		setFormData({
			...formData,
			[name]: val,
		});
	};

	const handleCreate = async () => {
		handleToggleLoading(true);
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
		handleToggleLoading(false);
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
			navigation.goBack();
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const handleEdit = async () => {
		handleToggleLoading(true);
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
		const resp = await updateRole(postbody, { id: id as string });
		handleToggleLoading(false);
		if (resp.ok) {
			const sortedRoles = roles
				.map((el) =>
					el.id === id
						? {
								...formData,
								id: id,
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

			navigation.goBack();
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

		if (id) {
			handleEdit();
		} else {
			handleCreate();
		}
	};

	useEffect(() => {
		if (id) {
			const role = roles.find((el) => el.id === (id as string));
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
				setImageIcon({
					uri: role?.icon ?? "",
					isPicker: false,
					type: MediaType.Image,
				});
				setIcon(null);
			}
		} else {
			setIcon(roleIcons[0]);
			setImageIcon(null);
		}
	}, [id, roles]);

	return (
		<FansView
			flex="1"
			position="relative"
			padding={{ t: insets.top }}
			style={tw.style("bg-fans-white dark:bg-fans-black-1d")}
		>
			<CustomTopNavBar
				title="Add or edit role"
				onClickLeft={() => navigation.goBack()}
				onClickRight={handleSubmit}
				rightLabel="Save"
			/>
			<ScrollView
				style={{
					paddingTop: 24,
					paddingHorizontal: 18,
				}}
			>
				<RoleForm
					id={(id as string) ?? ""}
					inProgress={inProgress}
					onViewFansLevel={handleViewFansLevel}
					formData={formData}
					onChangeForm={onChangeForm}
					isSubmitted={isSubmitted}
					icon={icon}
					onChangeIcon={setIcon}
					imageIcon={imageIcon}
					onChangeImageIcon={setImageIcon}
					handleSubmit={handleSubmit}
				/>
			</ScrollView>
		</FansView>
	);
};

export default RoleScreen;
