import { OutlinedInfoSvg } from "@assets/svgs/common";
import RoundTextInput from "@components/common/RoundTextInput";
import { FypText, FypCheckbox, FypSvg } from "@components/common/base";
import {
	FansGap,
	FansHorizontalDivider,
	FansSwitch,
	FansText,
	FansView,
} from "@components/controls";
import { PreferenceItem, SexualPolicyModal } from "@components/videoCall";
import { updateVideoCallSettings } from "@helper/endpoints/videoCalls/apis";
import tw from "@lib/tailwind";
import { VideoCallWays, IVideoCallSetting } from "@usertypes/types";
import React, { FC, useState, useEffect } from "react";
import { Image } from "react-native";
import Toast from "react-native-toast-message";

interface Props {
	videoCallSettings: IVideoCallSetting;
	updateVideoCallSettingsCallback: (
		videoCallSettings: IVideoCallSetting,
	) => void;
}

const ContentPreferenceForm: FC<Props> = (props) => {
	const { videoCallSettings, updateVideoCallSettingsCallback } = props;

	const {
		sexualContentAllowed,
		contentPreferences,
		customContentPreferences,
		meetingType,
	} = videoCallSettings;

	const [openSexualPolicyModal, setOpenSexualPolicyModal] = useState(false);
	const [localcustomContentPreferences, setLocalCustomContentPreferences] =
		useState<string>("");

	const handleAdditionalPreferencesChange = (text: string) => {
		setLocalCustomContentPreferences(text);
	};

	const handleUpdate = async (
		name: string,
		value: string[] | boolean | string | VideoCallWays,
	) => {
		const resp = await updateVideoCallSettings({ [name]: value });
		if (resp.ok) {
			updateVideoCallSettingsCallback({
				...videoCallSettings,
				[name]: value,
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
		setLocalCustomContentPreferences(
			videoCallSettings.customContentPreferences,
		);
	}, [videoCallSettings.customContentPreferences]);

	const options = [
		{
			id: "Consultation",
			title: "Consultation",
			iconToRender: (
				<Image
					source={require("@assets/images/preferences/consultation.png")}
					resizeMode="contain"
					style={tw.style("w-[47px] h-[47px] md:w-16 md:h-16")}
				/>
			),
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
		},
		{
			id: "EighteenPlusAdult",
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
		},
		{
			id: "Endorsement",
			title: "Endorsements",
			iconToRender: (
				<Image
					source={require("@assets/images/preferences/endorsements.png")}
					resizeMode="contain"
					style={tw.style(
						"w-[41px] h-[46px] md:w-[77px] md:h-[66px]",
					)}
				/>
			),
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
		},
	];

	return (
		<FansView>
			<FansSwitch
				text="Allow sexual content"
				value={sexualContentAllowed}
				onValueChange={handleSexualContentToggle}
			/>
			<FansGap height={30} />
			<FansView
				padding={{ x: 16, t: 16, b: 15 }}
				borderRadius={15}
				style={tw.style("bg-fans-purple-light")}
			>
				<FypText
					fontSize={16}
					lineHeight={21}
					textAlign="center"
					style={tw.style("text-fans-grey-48 max-w-[460px] mx-auto")}
				>
					<FypSvg
						svg={OutlinedInfoSvg}
						width={15}
						height={15}
						color="fans-grey-48"
					/>{" "}
					When selected, all fans have to go through ID verification
					to purchase video calls
				</FypText>
			</FansView>
			<FansGap height={40} />
			<FansView
				flexDirection="row"
				flexWrap="wrap"
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
