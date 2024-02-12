import RoundTextInput from "@components/common/RoundTextInput";
import { FypText, FypSwitch } from "@components/common/base";
import { FansView } from "@components/controls";
import { ProfileActionType, useAppContext } from "@context/useAppContext";
import {
	updateVideoCallSettings,
	getVideoCallSettings,
} from "@helper/endpoints/videoCalls/apis";
import React, { useState, useEffect } from "react";
import Toast from "react-native-toast-message";

const TitleForm = () => {
	const { state, dispatch } = useAppContext();

	const { meetingDescription } = state.profile.settings.video;

	const [localMeetingDescription, setLocalMeetingDescription] =
		useState<string>(meetingDescription);

	const handleUpdate = async (name: string, value: string) => {
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
			setLocalMeetingDescription(resp.data.meetingDescription);
		}
	};

	const handleMeetingDescriptionBlur = async () => {
		if (localMeetingDescription !== meetingDescription) {
			handleUpdate("meetingDescription", localMeetingDescription);
		}
	};

	useEffect(() => {
		fetchVideoCallSettings();
	}, []);

	return (
		<FansView>
			<FansView margin={{ b: 26 }}>
				<FypText fontWeight={600} fontSize={17} margin={{ b: 15 }}>
					Description
				</FypText>
				<RoundTextInput
					value={localMeetingDescription}
					placeholder="Enter description here"
					multiline
					numberOfLines={4}
					maxLength={1000}
					customStyles="py-3 px-5 rounded-[7px] h-[128px]"
					onChangeText={(value) => setLocalMeetingDescription(value)}
					onBlur={handleMeetingDescriptionBlur}
				/>
			</FansView>

			<FansView
				flexDirection="row"
				alignItems="center"
				justifyContent="between"
			>
				<FypText fontSize={18} lineHeight={24}>
					Show reviews from fans
				</FypText>
				<FypSwitch value={true} onValueChange={() => {}} />
			</FansView>
		</FansView>
	);
};

export default TitleForm;
