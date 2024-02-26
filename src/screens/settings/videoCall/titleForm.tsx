import RoundTextInput from "@components/common/RoundTextInput";
import { FypText, FypSwitch } from "@components/common/base";
import { FansView } from "@components/controls";
import { updateVideoCallSettings } from "@helper/endpoints/videoCalls/apis";
import { useFeatureGates } from "@state/featureGates";
import { IVideoCallSetting } from "@usertypes/types";
import React, { FC, useState, useEffect } from "react";
import Toast from "react-native-toast-message";

interface Props {
	videoCallSettings: IVideoCallSetting;
	updateVideoCallSettingsCallback: (
		videoCallSettings: IVideoCallSetting,
	) => void;
}

const TitleForm: FC<Props> = (props) => {
	const { videoCallSettings, updateVideoCallSettingsCallback } = props;
	const featureGates = useFeatureGates();

	const [localMeetingDescription, setLocalMeetingDescription] =
		useState<string>("");

	const handleUpdate = async (name: string, value: string) => {
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

	const handleMeetingDescriptionBlur = async () => {
		if (localMeetingDescription !== videoCallSettings.meetingDescription) {
			handleUpdate("meetingDescription", localMeetingDescription);
		}
	};

	useEffect(() => {
		setLocalMeetingDescription(videoCallSettings.meetingDescription);
	}, [videoCallSettings.meetingDescription]);

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

			{featureGates.has("2024_02-show-reviews-in-video-call") ? (
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
			) : null}
		</FansView>
	);
};

export default TitleForm;
