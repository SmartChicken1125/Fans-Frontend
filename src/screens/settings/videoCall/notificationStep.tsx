import {
	FansGap,
	FansHorizontalDivider,
	FansSwitch,
	FansText,
	FansView,
} from "@components/controls";
import { updateVideoCallSettings } from "@helper/endpoints/videoCalls/apis";
import { IVideoCallSetting } from "@usertypes/types";
import React, { FC } from "react";
import Toast from "react-native-toast-message";

interface Props {
	videoCallSettings: IVideoCallSetting;
	updateVideoCallSettingsCallback: (
		videoCallSettings: IVideoCallSetting,
	) => void;
}

const NotificationStep: FC<Props> = (props) => {
	const { videoCallSettings, updateVideoCallSettingsCallback } = props;

	const {
		notificationNewRequests,
		notificationCancellations,
		notificationReminders,
		notificationsByEmail,
		notificationsByPhone,
	} = videoCallSettings;

	const handleChangeField = async (name: string, val: boolean) => {
		const resp = await updateVideoCallSettings({ [name]: val });
		if (resp.ok) {
			updateVideoCallSettingsCallback({
				...videoCallSettings,
				[name]: val,
			});
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	return (
		<FansView>
			<FansGap height={34} />
			<FansView>
				<FansText fontFamily="inter-semibold" fontSize={17}>
					Notification Settings
				</FansText>
				<FansGap height={40} />
				<FansSwitch
					text="New requests"
					value={notificationNewRequests}
					onValueChange={(value: boolean) =>
						handleChangeField("notificationNewRequests", value)
					}
				/>
				<FansGap height={20} />
				<FansHorizontalDivider />
				<FansGap height={20} />
				<FansSwitch
					text="Cancellations"
					value={notificationCancellations}
					onValueChange={(value: boolean) =>
						handleChangeField("notificationCancellations", value)
					}
				/>
				<FansGap height={20} />
				<FansHorizontalDivider />
				<FansGap height={20} />
				<FansSwitch
					text="Reminders"
					value={notificationReminders}
					onValueChange={(value: boolean) =>
						handleChangeField("notificationReminders", value)
					}
				/>
				<FansGap height={53.5} />
				<FansText fontFamily="inter-semibold" fontSize={17}>
					Notification methods
				</FansText>
				<FansGap height={41.5} />
				<FansSwitch
					text="Email"
					value={notificationsByEmail}
					onValueChange={(value: boolean) =>
						handleChangeField("notificationsByEmail", value)
					}
				/>
				<FansGap height={20} />
				<FansHorizontalDivider />
				<FansGap height={20} />
				<FansSwitch
					text="Phone"
					value={notificationsByPhone}
					onValueChange={(value: boolean) =>
						handleChangeField("notificationsByPhone", value)
					}
				/>
			</FansView>
		</FansView>
	);
};

export default NotificationStep;
