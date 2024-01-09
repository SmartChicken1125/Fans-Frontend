import { ColorPickerSvg, ImageSvg, UsersSvg } from "@assets/svgs/common";
import RoundButton from "@components/common/RoundButton";
import RoundTextInput from "@components/common/RoundTextInput";
import { FypText, FypColorPicker, FypSvg } from "@components/common/base";
import { FansView } from "@components/controls";
import { ColorButton, RoleIconButton } from "@components/posts/roles";
import { roleColors, roleIcons } from "@constants/common";
import { cdnURL } from "@helper/Utils";
import tw from "@lib/tailwind";
import { RoundButtonType } from "@usertypes/commonEnums";
import { IRole, IRoleIcon, IPickerMedia } from "@usertypes/types";
import useDocumentPicker from "@utils/useDocumentPicker";
import React, { FC, useState } from "react";
import { Image, Pressable, ScrollView } from "react-native";
import Toast from "react-native-toast-message";

interface Props {
	id: string;
	inProgress: boolean;
	onViewFansLevel: () => void;
	formData: IRole;
	onChangeForm: (name: string, val: string) => void;
	isSubmitted: boolean;
	icon: IRoleIcon | null;
	onChangeIcon: (val: IRoleIcon | null) => void;
	imageIcon: IPickerMedia | null;
	onChangeImageIcon: (val: IPickerMedia | null) => void;
	handleSubmit: () => void;
}

const RoleForm: FC<Props> = (props) => {
	const {
		id,
		onViewFansLevel,
		inProgress,
		formData,
		onChangeForm,
		isSubmitted,
		icon,
		onChangeIcon,
		imageIcon,
		onChangeImageIcon,
		handleSubmit,
	} = props;
	const { useImagePicker } = useDocumentPicker();
	const [openColorPicker, setOpenColorPicker] = useState(false);

	const handleSelectIcon = (roleIcon: IRoleIcon) => {
		onChangeIcon(roleIcon);
		onChangeImageIcon(null);
		onChangeForm("icon", roleIcon.name);
	};

	const handlePressChangeImage = async () => {
		const result = await useImagePicker();
		if (result.ok) {
			const medias = result.data;
			onChangeIcon(null);
			onChangeImageIcon(medias[0]);
		} else {
			Toast.show({
				type: "error",
				text1: result?.message ?? "",
			});
		}
	};

	return (
		<FansView>
			<FansView margin={{ b: 30 }}>
				<FypText
					fontSize={17}
					lineHeight={22}
					fontWeight={600}
					margin={{ b: 15 }}
					style={tw.style("text-fans-black dark:text-fans-white")}
				>
					Role name
					<FypText
						fontSize={17}
						lineHeight={22}
						fontWeight={600}
						color="red"
					>
						*
					</FypText>
				</FypText>

				<RoundTextInput
					value={formData.name}
					onChangeText={(val) => onChangeForm("name", val)}
					placeholder="e.g.Admin"
					hasError={isSubmitted && formData.name === ""}
					helperText="Name is mandatory"
					maxLength={50}
				/>
			</FansView>

			<FansView margin={{ b: 30 }}>
				<FypText
					fontSize={17}
					lineHeight={22}
					fontWeight={600}
					style={tw.style("text-fans-black dark:text-fans-white")}
					margin={{ b: 10 }}
				>
					Role color
					<FypText
						fontSize={17}
						lineHeight={22}
						fontWeight={600}
						color="red"
					>
						*
					</FypText>
				</FypText>
				<FypText
					fontSize={16}
					lineHeight={21}
					margin={{ b: 12 }}
					style={tw.style("text-fans-grey-70 dark:text-fans-grey-b1")}
				>
					Members use the color of the highest role they have
				</FypText>

				<FansView
					width={102}
					height={102}
					borderRadius={102}
					margin={{ b: 16 }}
					padding={4}
					style={tw.style(
						"mx-auto border-fans-grey border dark:border-fans-grey-43",
					)}
				>
					<FansView
						width={95}
						height={95}
						style={{
							borderRadius: 95,
							backgroundColor: formData.color,
						}}
					></FansView>
				</FansView>

				<FansView
					flexDirection="row"
					flexWrap="wrap"
					style={tw.style("gap-x-2 gap-y-[10px]")}
				>
					<Pressable
						style={tw.style(
							"w-11 h-11 rounded-full flex-row items-center justify-center",
							"bg-fans-grey dark:bg-fans-grey-43",
						)}
						onPress={() => setOpenColorPicker(true)}
					>
						<FypSvg
							svg={ColorPickerSvg}
							width={21.87}
							height={21.84}
							color="fans-black dark:fans-white"
						/>
					</Pressable>
					{roleColors.map((el) => (
						<ColorButton
							key={el}
							value={el}
							isSelected={formData.color === el}
							onSelect={() => onChangeForm("color", el)}
						/>
					))}
				</FansView>
			</FansView>

			<FansView margin={{ b: 30 }}>
				<FypText
					fontSize={17}
					lineHeight={22}
					fontWeight={600}
					margin={{ b: 16 }}
					style={tw.style("text-fans-black dark:text-fans-white")}
				>
					Role icon
					<FypText
						fontSize={17}
						lineHeight={22}
						color="red"
						fontWeight={600}
					>
						*
					</FypText>
				</FypText>
				<FypText
					fontSize={16}
					lineHeight={21}
					margin={{ b: 20 }}
					style={tw.style("text-fans-black dark:text-fans-white")}
				>
					Upload an image or select a preset icon
				</FypText>
				<FansView
					width={103}
					height={103}
					borderRadius={103}
					margin={{ b: 20 }}
					alignItems="center"
					justifyContent="center"
					style={tw.style(
						"mx-auto border border-fans-grey dark:border-fans-grey-43",
					)}
				>
					{icon ? (
						<Image
							source={icon.icon}
							style={{
								width: icon.width * 2.34,
								height: icon.height * 2.34,
							}}
						/>
					) : null}
					{imageIcon ? (
						<Image
							source={{
								uri: imageIcon.isPicker
									? imageIcon.uri
									: cdnURL(imageIcon.uri),
							}}
							style={tw.style("w-full h-full rounded-full")}
						/>
					) : null}
				</FansView>

				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{
						columnGap: 8,
						marginBottom: 26,
					}}
				>
					{roleIcons.map((el) => (
						<RoleIconButton
							key={el.name}
							data={el}
							onSelect={() => handleSelectIcon(el)}
							isSelected={icon?.name === el.name}
						/>
					))}
				</ScrollView>

				<RoundButton
					variant={RoundButtonType.OUTLINE_PRIMARY}
					icon={() => (
						<ImageSvg
							width={13.73}
							height={13.73}
							color="#a854f5"
						/>
					)}
					onPress={handlePressChangeImage}
				>
					Change image
				</RoundButton>
			</FansView>

			<FansView margin={{ b: 102 }}>
				<FansView
					flexDirection="row"
					alignItems="center"
					justifyContent="between"
					margin={{ b: 15 }}
				>
					<FypText
						fontSize={17}
						lineHeight={22}
						style={tw.style("text-fans-black dark:text-fans-white")}
						fontWeight={600}
					>
						Activity level
						<FypText
							fontSize={17}
							lineHeight={22}
							color="red"
							fontWeight={600}
						>
							*
						</FypText>
					</FypText>
					<Pressable
						style={tw.style("flex-row items-center")}
						onPress={onViewFansLevel}
					>
						<FansView>
							<UsersSvg
								width={15.68}
								height={12.64}
								color="#a854f5"
							/>
						</FansView>
						<FypText
							color="purple"
							fontSize={17}
							lineHeight={22}
							fontWeight={700}
							margin={{ l: 12 }}
						>
							View fans level
						</FypText>
					</Pressable>
				</FansView>

				<FypText
					fontSize={16}
					lineHeight={21}
					margin={{ b: 16 }}
					style={tw.style("text-fans-black dark:text-fans-white")}
				>
					Members use the color of the highest role they have
				</FypText>

				<FansView margin={{ b: 32 }}>
					<RoundTextInput
						placeholder="e.g.Level 100"
						value={formData.level as string}
						onChangeText={(val) => onChangeForm("level", val)}
						hasError={isSubmitted && formData.level === ""}
						helperText="Level is mandatory"
						keyboardType="numeric"
					/>
				</FansView>
				<RoundButton onPress={handleSubmit} loading={inProgress}>
					{id ? "Save role" : "Create role"}
				</RoundButton>
			</FansView>
			<FypColorPicker
				visible={openColorPicker}
				onCancel={() => setOpenColorPicker(false)}
				onSelect={(color) => {
					onChangeForm("color", color);
					setOpenColorPicker(false);
				}}
			/>
		</FansView>
	);
};

export default RoleForm;
