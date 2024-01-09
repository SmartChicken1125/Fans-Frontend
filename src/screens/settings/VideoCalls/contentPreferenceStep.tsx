import Adult from "@assets/svgs/common/Adult";
import Advice from "@assets/svgs/common/Advice";
import Consultation from "@assets/svgs/common/Consultation";
import Performance from "@assets/svgs/common/Performance";
import SexualContent from "@assets/svgs/common/SexualContent";
import GridItem from "@components/common/GridItem";
import RoundTextInput from "@components/common/RoundTextInput";
import { FypText } from "@components/common/base";
import Checkbox from "@components/common/checkbox";
import {
	FansGap,
	FansHorizontalDivider,
	FansSwitch,
	FansText,
	FansView,
} from "@components/controls";
import { ProfileActionType, useAppContext } from "@context/useAppContext";
import {
	getUserSettings,
	updateVideoSettings,
} from "@helper/endpoints/profile/apis";
import tw from "@lib/tailwind";
import { IProfileSettings, VideoCallWays } from "@usertypes/types";
import React, { useState } from "react";

const ContentPreferenceStep: React.FC = () => {
	const { state, dispatch } = useAppContext();

	const {
		sexualContent,
		contentPreferences,
		additionalContentPreferences,
		videoCallWays,
	} = state.profile.settings.video;

	const [
		localAdditionalContentPreferences,
		setLocalAdditionalContentPreferences,
	] = useState<string>(additionalContentPreferences);

	const handleAdditionalPreferencesChange = (text: string) => {
		setLocalAdditionalContentPreferences(text);
	};

	const handleAdditionalPreferencesBlur = async () => {
		if (
			localAdditionalContentPreferences !== additionalContentPreferences
		) {
			await setAdditionalPreferences(localAdditionalContentPreferences);
		}
	};

	const { video } = state.profile.settings;

	const updateSettings = async (updatedSettings: IProfileSettings) => {
		const response = await updateVideoSettings(updatedSettings);

		if (response.ok) {
			fetchProfileSettings();
		}
	};

	const fetchProfileSettings = async () => {
		const response = await getUserSettings();
		if (response.ok) {
			const profileSettings = response.data;
			dispatch.setProfile({
				type: ProfileActionType.updateSettings,
				data: profileSettings,
			});
		}
	};

	const handleVideoCallToggle = async (value: VideoCallWays) => {
		const updatedSettings = {
			...state.profile.settings,
			video: {
				...video,
				videoCallWays: value,
			},
		};

		await updateSettings(updatedSettings);
	};

	const handleSexualContentToggle = async (value: boolean) => {
		const updatedSettings = {
			...state.profile.settings,
			video: {
				...video,
				sexualContent: value,
			},
		};

		await updateSettings(updatedSettings);
	};

	const setAdditionalPreferences = async (text: string) => {
		const updatedSettings = {
			...state.profile.settings,
			video: {
				...video,
				additionalContentPreferences: text,
			},
		};

		await updateSettings(updatedSettings);
	};

	const toggleSelection = async (id: string) => {
		const updatedContentPreferences = contentPreferences.includes(id)
			? contentPreferences.filter((item) => item !== id)
			: [...contentPreferences, id];

		const updatedSettings = {
			...state.profile.settings,
			video: {
				...video,
				contentPreferences: updatedContentPreferences,
			},
		};

		await updateSettings(updatedSettings);
	};

	const options = [
		{
			id: "Consultation",
			title: "Consultation",
			iconToRender: <Consultation />,
			iconColor: "#edfaea",
		},
		{
			id: "Advice",
			title: "Advice",
			iconToRender: <Advice />,
			iconColor: "#e8f6ff",
		},
		{
			id: "Performance",
			title: "Performance",
			iconToRender: <Performance />,
			iconColor: "#f6edff",
		},
		{
			id: "Adult",
			title: "18+ Adult",
			iconToRender: <Adult />,
			iconColor: "#fdebf9",
		},
		{
			id: "Sexual",
			title: "18+ Sexual",
			iconToRender: <SexualContent />,
			iconColor: "#fff3e9",
		},
		{
			id: "Spirituality",
			title: "Spirituality",
			iconToRender: <Consultation />,
			iconColor: "#fffcdb",
		},
		// {
		// 	id: "7",
		// 	title: "Empty",
		// 	iconToRender: <Consultation />,
		// 	empty: true,
		// },
		// {
		// 	id: "8",
		// 	title: "Empty",
		// 	iconToRender: <Consultation />,
		// 	empty: true,
		// },
	];

	return (
		<FansView>
			<FansGap height={34} />
			<FansView>
				<FansText
					textAlign="center"
					fontFamily="inter-semibold"
					fontSize={27}
				>
					Content preferences
				</FansText>
				<FansGap height={12} />
				<FansText textAlign="center" fontSize={16}>
					Select the types of content you are comfortable creating.
					This guides fans in their requests
				</FansText>
			</FansView>
			<FansGap height={40} />
			<FansSwitch
				text="Allow sexual content"
				value={sexualContent}
				onValueChange={(value) => handleSexualContentToggle(value)}
			/>
			<FansGap height={20} />
			<FansView flexDirection="row" flexWrap="wrap" margin={{ x: -16 }}>
				{options.map((item) => (
					<FansView
						padding={8}
						style={tw.style("w-1/4")}
						key={item.id}
					>
						<GridItem
							title={item.title}
							selected={contentPreferences.includes(item.id)}
							onPress={() => toggleSelection(item.id)}
							iconToRender={item.iconToRender}
							iconColor={item.iconColor}
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
				value={localAdditionalContentPreferences}
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
			<FansView margin={{ b: 34 }}>
				<FansView flexDirection="row" alignItems="center">
					<Checkbox
						checked={videoCallWays === VideoCallWays.TwoWay}
						onPress={() =>
							handleVideoCallToggle(VideoCallWays.TwoWay)
						}
						size={"lg"}
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
					<Checkbox
						checked={videoCallWays === VideoCallWays.OneWay}
						onPress={() =>
							handleVideoCallToggle(VideoCallWays.OneWay)
						}
						size={"lg"}
					/>
					<FypText fontSize={16} lineHeight={21} margin={{ l: 18 }}>
						One-Way
					</FypText>
				</FansView>
			</FansView>
		</FansView>
	);
};

export default ContentPreferenceStep;
