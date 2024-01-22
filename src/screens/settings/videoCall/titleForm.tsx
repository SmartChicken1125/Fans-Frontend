import { VideoImage2 } from "@assets/svgs/images";
import RoundTextInput from "@components/common/RoundTextInput";
import { FypText, FypSvg, FypSwitch } from "@components/common/base";
import { FansView } from "@components/controls";
import { ProfileActionType, useAppContext } from "@context/useAppContext";
import {
	updateVideoCallSettings,
	getVideoCallSettings,
} from "@helper/endpoints/settings/apis";
import tw from "@lib/tailwind";
import React, { useState, useEffect } from "react";
import Toast from "react-native-toast-message";

const TitleForm = () => {
	const { state, dispatch } = useAppContext();

	const { meetingTitle, meetingDescription } = state.profile.settings.video;

	const [localMeetingTitle, setLocalMeetingTitle] =
		useState<string>(meetingTitle);
	const [localMeetingDescription, setLocalMeetingDescription] =
		useState<string>(meetingDescription);

	const handleChangeField = async (name: string, val: string) => {
		if (name === "meetingTitle") {
			setLocalMeetingTitle(val);
		} else if (name === "meetingDescription") {
			setLocalMeetingDescription(val);
		}
	};

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
			setLocalMeetingTitle(resp.data.meetingTitle);
			setLocalMeetingDescription(resp.data.meetingDescription);
		}
	};

	const handleMeetingTitleBlur = async () => {
		if (localMeetingTitle !== meetingTitle) {
			handleUpdate("meetingTitle", localMeetingTitle);
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
			<FansView margin={{ b: 32 }}>
				<FypText fontWeight={600} fontSize={17} margin={{ b: 15 }}>
					Meeting title
				</FypText>
				<RoundTextInput
					value={localMeetingTitle}
					placeholder="Enter here"
					onChangeText={(value) =>
						handleChangeField("meetingTitle", value)
					}
					onBlur={handleMeetingTitleBlur}
				/>
			</FansView>

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
					onChangeText={(value) =>
						handleChangeField("meetingDescription", value)
					}
					onBlur={handleMeetingDescriptionBlur}
				/>
			</FansView>

			<FansView margin={{ b: 25 }}>
				<FypText fontWeight={600} fontSize={17} margin={{ b: 21 }}>
					Upload video previews (optional)
				</FypText>
				<FansView
					alignItems="center"
					borderRadius={15}
					gap={{ xs: 14, md: 17 }}
					style={tw.style(
						"border border-dashed border-fans-grey-de dark:border-fans-grey-50",
						"pt-[25px] pb-5 md:pt-[42px] md:pb-8",
					)}
				>
					<FypSvg
						svg={VideoImage2}
						width={{ xs: 55, md: 78 }}
						height={{ xs: 46, md: 66 }}
					/>
					{tw.prefixMatch("md") ? (
						<FypText fontSize={17} lineHeight={22}>
							Drop file here or{" "}
							<FypText
								fontSize={17}
								lineHeight={22}
								style={tw.style("text-fans-purple")}
							>
								browse
							</FypText>
						</FypText>
					) : (
						<FypText
							fontSize={17}
							fontWeight={600}
							style={tw.style("text-fans-purple")}
						>
							Browse library
						</FypText>
					)}
				</FansView>
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
