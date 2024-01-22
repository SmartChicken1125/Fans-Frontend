import { CheckSvg } from "@assets/svgs/common";
import { AdultImage, ConsultationImage } from "@assets/svgs/images";
import RoundTextInput from "@components/common/RoundTextInput";
import {
	FypText,
	FypCheckbox,
	FypNullableView,
	FypSvg,
} from "@components/common/base";
import {
	FansGap,
	FansHorizontalDivider,
	FansSwitch,
	FansText,
	FansView,
} from "@components/controls";
import { ProfileActionType, useAppContext } from "@context/useAppContext";
import {
	updateVideoCallSettings,
	getVideoCallSettings,
} from "@helper/endpoints/settings/apis";
import tw from "@lib/tailwind";
import { VideoCallWays } from "@usertypes/types";
import React, { FC, useState, useEffect } from "react";
import { Image } from "react-native";
import Toast from "react-native-toast-message";
import SexualPolicyModal from "./sexualPolicyModal";

interface PreferenceItemProps {
	title: string;
	selected: boolean;
	onPress: () => void;
	iconToRender: React.ReactNode;
}

const PreferenceItem: FC<PreferenceItemProps> = (props) => {
	const { title, selected, onPress, iconToRender } = props;
	return (
		<FansView
			style={tw.style(
				"border",
				selected
					? "border-fans-purple border-[2px]"
					: "border-fans-grey-f0 dark:border-fans-grey-43",
			)}
			width="full"
			height={{ xs: 136, md: 186 }}
			alignItems="center"
			justifyContent="center"
			borderRadius={15}
			position="relative"
			touchableOpacityProps={{
				onPress: onPress,
			}}
		>
			<FansView
				width={20}
				height={20}
				borderRadius={20}
				alignItems="center"
				justifyContent="center"
				position="absolute"
				top={10}
				right={10}
				style={tw.style(
					selected
						? "bg-fans-purple"
						: "border border-fans-grey dark:border-fans-grey-43",
				)}
			>
				<FypNullableView visible={selected}>
					<FypSvg
						svg={CheckSvg}
						width={12}
						height={10}
						color="fans-white"
					/>
				</FypNullableView>
			</FansView>

			<FansView alignItems="center" margin={{ t: -20 }}>
				{iconToRender}
			</FansView>
			<FypText
				fontSize={16}
				margin={{ t: 18 }}
				fontWeight={600}
				textAlign="center"
				style={tw.style("absolute bottom-4 md:bottom-5 left-0 w-full")}
			>
				{title}
			</FypText>
		</FansView>
	);
};

const ContentPreferenceForm: FC = () => {
	const { state, dispatch } = useAppContext();

	const {
		sexualContentAllowed,
		contentPreferences,
		customContentPreferences,
		meetingType,
	} = state.profile.settings.video;

	const [openSexualPolicyModal, setOpenSexualPolicyModal] = useState(false);
	const [localcustomContentPreferences, setLocalCustomContentPreferences] =
		useState<string>("");

	const handleAdditionalPreferencesChange = (text: string) => {
		setLocalCustomContentPreferences(text);
	};

	const fetchVideoCallSettings = async () => {
		const resp = await getVideoCallSettings();
		if (resp.ok) {
			dispatch.setProfile({
				type: ProfileActionType.updateSettings,
				data: {
					video: {
						...state.profile.settings.video,
						...resp.data,
					},
				},
			});
			setLocalCustomContentPreferences(
				resp.data.customContentPreferences,
			);
		}
	};

	const handleUpdate = async (
		name: string,
		value: string[] | boolean | string | VideoCallWays,
	) => {
		const resp = await updateVideoCallSettings({ [name]: value });
		if (resp.ok) {
			dispatch.setProfile({
				type: ProfileActionType.updateSettings,
				data: {
					video: {
						...state.profile.settings.video,
						[name]: value,
					},
				},
			});
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const handleAdditionalPreferencesBlur = async () => {
		if (localcustomContentPreferences !== customContentPreferences) {
			await handleUpdate(
				"customContentPreferences",
				localcustomContentPreferences,
			);
		}
	};

	const handleVideoCallToggle = async (value: VideoCallWays) => {
		await handleUpdate("meetingType", value);
	};

	const handleSexualContentToggle = async (value: boolean) => {
		if (value) {
			setOpenSexualPolicyModal(true);
		} else {
			await handleUpdate("sexualContentAllowed", false);
		}
	};

	const handleAgreeSexual = async () => {
		setOpenSexualPolicyModal(false);
		await handleUpdate("sexualContentAllowed", true);
	};

	const toggleSelection = async (id: string) => {
		const updatedContentPreferences = contentPreferences.includes(id)
			? contentPreferences.filter((item) => item !== id)
			: [...contentPreferences, id];

		await handleUpdate("contentPreferences", updatedContentPreferences);
	};

	useEffect(() => {
		fetchVideoCallSettings();
	}, []);

	const options = [
		{
			id: "Consultation",
			title: "Consultation",
			// iconToRender: <ConsultationImage width={64} height={64} />,
			iconToRender: (
				<Image
					source={require("@assets/images/preferences/consultation.png")}
					resizeMode="contain"
					style={tw.style("w-[47px] h-[47px] md:w-16 md:h-16")}
				/>
			),
			iconColor: "#edfaea",
		},
		{
			id: "Advice",
			title: "Advice",
			iconToRender: (
				<Image
					source={require("@assets/images/preferences/advice.png")}
					resizeMode="contain"
					style={tw.style(
						"w-[54px] h-[54px] md:w-[73px] md:h-[73px]",
					)}
				/>
			),
			iconColor: "#e8f6ff",
		},
		{
			id: "Performance",
			title: "Performance",
			iconToRender: (
				<Image
					source={require("@assets/images/preferences/performance.png")}
					resizeMode="contain"
					style={tw.style(
						"w-[56px] h-[34px] md:w-[76px] md:h-[45px]",
					)}
				/>
			),
			iconColor: "#f6edff",
		},
		{
			id: "Adult",
			title: "18+ Adult",
			iconToRender: (
				<Image
					source={require("@assets/images/preferences/adult.png")}
					resizeMode="contain"
					style={tw.style(
						"w-[46px] h-[51px] md:w-[66px] md:h-[66px]",
					)}
				/>
			),
			iconColor: "#fdebf9",
		},
		{
			id: "Sexual",
			title: "18+ Sexual",
			iconToRender: (
				<Image
					source={require("@assets/images/preferences/sexual.png")}
					resizeMode="contain"
					style={tw.style(
						"w-[49px] h-[49px] md:w-[62px] md:h-[69px]",
					)}
				/>
			),
			iconColor: "#fff3e9",
		},
		{
			id: "Spirituality",
			title: "Spirituality",
			iconToRender: (
				<Image
					source={require("@assets/images/preferences/spirituality.png")}
					resizeMode="contain"
					style={tw.style(
						"w-[50px] h-[44px] md:w-[68px] md:h-[59px]",
					)}
				/>
			),
			iconColor: "#fffcdb",
		},
	];

	return (
		<FansView>
			<FansSwitch
				text="Allow sexual content"
				value={sexualContentAllowed}
				onValueChange={handleSexualContentToggle}
			/>

			<FansView
				flexDirection="row"
				flexWrap="wrap"
				margin={{ t: 20 }}
				style={tw.style("mx-[-4px] md:mx-[-8px]")}
			>
				{options.map((item) => (
					<FansView
						style={tw.style("w-1/3 md:w-1/4 p-1 md:p-2")}
						key={item.id}
					>
						<PreferenceItem
							title={item.title}
							selected={contentPreferences.includes(item.id)}
							onPress={() => toggleSelection(item.id)}
							iconToRender={item.iconToRender}
						/>
					</FansView>
				))}
			</FansView>
			<FansGap height={34} />
			<FansText fontFamily="inter-semibold" fontSize={17}>
				Additional content preferences
			</FansText>
			<FansGap height={15} />
			<RoundTextInput
				value={localcustomContentPreferences}
				onChangeText={handleAdditionalPreferencesChange}
				placeholder="Describe additional preferences"
				multiline
				numberOfLines={4}
				maxLength={1000}
				customStyles="py-3 px-5 rounded-[7px] h-[128px]"
				onBlur={handleAdditionalPreferencesBlur}
			/>
			<FansGap height={36} />
			<FansText fontFamily="inter-semibold" fontSize={17}>
				One-way or Two-way video calls?
			</FansText>
			<FansGap height={12} />
			<FansText style={tw.style("text-[#707070]")}>
				Choose if you want to see the fan, or if they will only be able
				to see you
			</FansText>
			<FansGap height={25} />
			<FansView>
				<FansView flexDirection="row" alignItems="center">
					<FypCheckbox
						checked={meetingType === VideoCallWays.TwoWay}
						onPress={() =>
							handleVideoCallToggle(VideoCallWays.TwoWay)
						}
					/>
					<FypText fontSize={16} lineHeight={21} margin={{ l: 18 }}>
						Two-way
					</FypText>
				</FansView>
				<FansGap height={15} />

				<FansHorizontalDivider />

				<FansView
					flexDirection="row"
					alignItems="center"
					margin={{ t: 20 }}
				>
					<FypCheckbox
						checked={meetingType === VideoCallWays.OneWay}
						onPress={() =>
							handleVideoCallToggle(VideoCallWays.OneWay)
						}
					/>
					<FypText fontSize={16} lineHeight={21} margin={{ l: 18 }}>
						One-Way
					</FypText>
				</FansView>
			</FansView>
			<SexualPolicyModal
				open={openSexualPolicyModal}
				handleClose={() => setOpenSexualPolicyModal(false)}
				handleAgree={handleAgreeSexual}
			/>
		</FansView>
	);
};

export default ContentPreferenceForm;
