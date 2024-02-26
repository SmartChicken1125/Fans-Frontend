import { Check1Svg, PlusSvg } from "@assets/svgs/common";
import RoundTextInput from "@components/common/RoundTextInput";
import {
	FypText,
	FypSwitch,
	FypSvg,
	FypCollapsible,
	FypButton2,
} from "@components/common/base";
import { FansDivider, FansView } from "@components/controls";
import {
	ProfileActionType,
	UserActionType,
	useAppContext,
} from "@context/useAppContext";
import { updateCustomVideoSettings } from "@helper/endpoints/cameo/apis";
import { getUserSettings } from "@helper/endpoints/profile/apis";
import { updateSetting } from "@helper/endpoints/settings/apis";
import tw from "@lib/tailwind";
import { ICustomVideoSettings } from "@usertypes/types";
import React, { FC, useState, Fragment } from "react";
import Toast from "react-native-toast-message";

interface Props {
	videoSettings: ICustomVideoSettings;
	handleUpdateSettings: (videoSettings: ICustomVideoSettings) => void;
}

const NotificationForm: FC<Props> = (props) => {
	const { videoSettings, handleUpdateSettings } = props;
	const { state, dispatch } = useAppContext();

	const { userInfo } = state.user;
	const { phonenumber } = userInfo;

	const {
		notificationNewRequests,
		notificationPendingVideos,
		notificationCompletedRequests,
		notificationsByEmail,
		notificationsByPhone,
	} = videoSettings;

	const [showPhoneForm, setShowPhoneForm] = useState(false);

	const handleChangeField = async (name: string, val: boolean) => {
		const resp = await updateCustomVideoSettings({ [name]: val });
		if (resp.ok) {
			handleUpdateSettings({
				...videoSettings,
				[name]: val,
			});
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
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

	const handleChangePhoneNumber = async (newPhoneNumber: string) => {
		console.log("New number");
		console.log(phonenumber);
		console.log(newPhoneNumber);
		const res = await updateSetting({ phonenumber: newPhoneNumber });
		if (res.ok) {
			dispatch.setUser({
				type: UserActionType.updateUserInfo,
				payload: { data: { phonenumber: newPhoneNumber } },
			});
		}
	};

	const handleSelectAll = async () => {
		const resp = await updateCustomVideoSettings({
			notificationNewRequests: true,
			notificationPendingVideos: true,
			notificationCompletedRequests: true,
			notificationsByEmail: true,
			notificationsByPhone: true,
		});
		if (resp.ok) {
			handleUpdateSettings({
				...videoSettings,
				...resp.data,
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
			<FansView margin={{ b: 35 }}>
				<FansView
					flexDirection="row"
					alignItems="center"
					justifyContent="between"
					margin={{ b: 26 }}
				>
					<FypText fontSize={17} fontWeight={600} lineHeight={22}>
						Notify top fans
					</FypText>
					<FypText
						fontSize={17}
						fontWeight={600}
						style={tw.style("text-fans-purple")}
						onPress={handleSelectAll}
					>
						Select all
					</FypText>
				</FansView>
				<FypSwitch
					label="New requests"
					value={notificationNewRequests}
					minHeight={52}
					onValueChange={(value: boolean) =>
						handleChangeField("notificationNewRequests", value)
					}
				/>
				<FansDivider style={tw.style("my-2")} />
				<FypSwitch
					label="Pending videos"
					value={notificationPendingVideos}
					minHeight={52}
					onValueChange={(value: boolean) =>
						handleChangeField("notificationPendingVideos", value)
					}
				/>
				<FansDivider style={tw.style("my-2")} />
				<FypSwitch
					label="Completed requests"
					value={notificationCompletedRequests}
					minHeight={52}
					onValueChange={(value: boolean) =>
						handleChangeField(
							"notificationCompletedRequests",
							value,
						)
					}
				/>
				<FansDivider style={tw.style("my-2")} />
				<FypSwitch
					label="Cancelled requests"
					value={true}
					minHeight={52}
					onValueChange={(value: boolean) =>
						// handleChangeField("completedRequests", value)
						{}
					}
				/>
			</FansView>

			<FansView>
				<FypText fontWeight={600} fontSize={17} margin={{ b: 26 }}>
					Notification methods
				</FypText>
				<FypSwitch
					label="Email"
					minHeight={52}
					value={notificationsByEmail}
					onValueChange={(value: boolean) =>
						handleChangeField("notificationsByEmail", value)
					}
				/>
				<FansDivider style={tw.style("my-2")} />
				<FansView>
					<FansView
						flexDirection="row"
						alignItems="center"
						justifyContent="between"
						style={tw.style("min-h-[52px]")}
					>
						<FansView
							flexDirection="row"
							alignItems="center"
							gap={18}
						>
							{showPhoneForm ? (
								<FypText fontSize={18} lineHeight={24}>
									Phone
								</FypText>
							) : (
								<Fragment>
									<FypText
										fontSize={18}
										lineHeight={24}
										style={tw.style(
											"text-fans-grey-b1 dark:text-fans-grey-70",
										)}
									>
										Phone
									</FypText>
									<FansView
										flexDirection="row"
										alignItems="center"
										gap={7}
									>
										<FypSvg
											svg={PlusSvg}
											width={9}
											height={9}
											color="fans-purple"
										/>
										<FypText
											fontSize={18}
											lineHeight={24}
											onPress={() =>
												setShowPhoneForm(true)
											}
											style={tw.style("text-fans-purple")}
										>
											Add phone number
										</FypText>
									</FansView>
								</Fragment>
							)}
						</FansView>
						<FypSwitch
							value={notificationsByPhone}
							onValueChange={(value) =>
								handleChangeField("notificationsByPhone", value)
							}
						/>
					</FansView>
					<FypCollapsible collapsed={!showPhoneForm}>
						<FansView gap={14}>
							<RoundTextInput placeholder="Enter phone number" />

							<FypButton2
								style={tw.style("border border-fans-purple")}
								textStyle={tw.style("text-fans-purple")}
							>
								Save phone
							</FypButton2>

							<FypButton2
								textStyle={tw.style("text-fans-purple")}
							>
								Cancel
							</FypButton2>
						</FansView>
					</FypCollapsible>
				</FansView>
				<FansDivider style={tw.style("my-2")} />
				<FansView
					flexDirection="row"
					alignItems="center"
					justifyContent="between"
					style={tw.style("min-h-[52px]")}
				>
					<FansView flexDirection="row" alignItems="center" gap={30}>
						<FypText fontSize={18}>
							Add orders to Google Calendar
						</FypText>
						<FansView
							flexDirection="row"
							alignItems="center"
							gap={4}
						>
							<FypSvg
								svg={Check1Svg}
								width={12}
								height={9}
								color="fans-purple"
							/>
							<FypText
								fontSize={17}
								fontWeight={600}
								style={tw.style("text-fans-purple")}
							>
								Connected
							</FypText>
						</FansView>
					</FansView>
					<FypSwitch value={true} onValueChange={() => {}} />
				</FansView>
			</FansView>
		</FansView>
	);
};

export default NotificationForm;
