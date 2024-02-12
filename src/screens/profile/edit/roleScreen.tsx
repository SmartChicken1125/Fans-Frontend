import CustomTopNavBar from "@components/common/customTopNavBar";
import AppLayout, { LayoutContentsContainer } from "@components/common/layout";
import RoleForm from "@components/posts/share/roleForm";
import { roleIcons } from "@constants/common";
import { defaultRoleFormData } from "@constants/defaultFormData";
import { useAppContext, ProfileActionType } from "@context/useAppContext";
import { createRole, updateRole } from "@helper/endpoints/role/apis";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MediaType } from "@usertypes/commonEnums";
import { ProfileNavigationStacks } from "@usertypes/navigations";
import { IRole, IRoleIcon, IPickerMedia } from "@usertypes/types";
import useUploadFiles from "@utils/useUploadFile";
import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import Toast from "react-native-toast-message";

const RoleScreen = (
	props: NativeStackScreenProps<ProfileNavigationStacks, "Role">,
) => {
	const { navigation, route } = props;
	const { id } = route.params;

	const { state, dispatch } = useAppContext();
	const { roles } = state.profile;
	const { uploadFiles } = useUploadFiles();

	const [inProgress, setInProgress] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [formData, setFormData] = useState<IRole>(defaultRoleFormData);
	const [icon, setIcon] = useState<IRoleIcon | null>(null);
	const [imageIcon, setImageIcon] = useState<IPickerMedia | null>(null);

	const onViewFansLevel = () => {
		navigation.goBack();
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
			navigation.goBack();
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
		const resp = await updateRole(postbody, { id: id as string });
		setInProgress(false);
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
		<AppLayout
			title="Edit Profile | FYP.Fans"
			description="FYP.Fans allows creators to make an income doing what they love!"
		>
			<View style={tw.style("flex-1")}>
				<ScrollView style={tw.style("flex-1")}>
					<LayoutContentsContainer>
						<CustomTopNavBar
							title={id ? "Edit role" : "Add role"}
							onClickLeft={() => navigation.goBack()}
							onClickRight={() => {}}
						/>
						<ScrollView
							style={{
								paddingTop: 28,
								paddingHorizontal: 18,
							}}
						>
							<RoleForm
								id={id ?? ""}
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
						</ScrollView>
					</LayoutContentsContainer>
				</ScrollView>
			</View>
		</AppLayout>
	);
};

export default RoleScreen;
