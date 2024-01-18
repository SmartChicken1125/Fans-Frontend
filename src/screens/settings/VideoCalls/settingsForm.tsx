import { RedirectSvg, CopySvg, CheckSvg } from "@assets/svgs/common";
import RoundButton from "@components/common/RoundButton";
import { FypText, FypSvg } from "@components/common/base";
import {
	FansView,
	FansSwitch,
	FansDivider,
	FansIconButton,
} from "@components/controls";
import { ProfileActionType, useAppContext } from "@context/useAppContext";
import { updateVideoCallSettings } from "@helper/endpoints/settings/apis";
import tw from "@lib/tailwind";
import useClipboard from "@utils/useClipboard";
import React, { FC, useState } from "react";
import Toast from "react-native-toast-message";
import ContentPreferenceForm from "./contentPreferenceForm";
import PricesForm from "./pricesForm";
import TimeframeForm from "./timeframeForm";
import TitleForm from "./titleForm";

interface Props {
	handleNext: () => void;
}

const SettingsForm: FC<Props> = (props) => {
	const { handleNext } = props;
	const { state, dispatch } = useAppContext();
	const { video } = state.profile.settings;
	const { copyString } = useClipboard();

	const {
		vacationMode,
		videoCallsEnabled,
		notificationNewRequests,
		notificationsByEmail,
		notificationsByPhone,
	} = video;

	const [copied, setCopied] = useState(false);

	const handleSelectAll = async () => {
		const postbody = {
			videoCallsEnabled: true,
			notificationNewRequests: true,
			notificationsByEmail: true,
			notificationsByPhone: true,
		};
		const resp = await updateVideoCallSettings(postbody);
		if (resp.ok) {
			dispatch.setProfile({
				type: ProfileActionType.updateSettings,
				data: {
					video: {
						...state.profile.settings.video,
						...postbody,
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

	const handleUpdate = async (name: string, val: boolean) => {
		const resp = await updateVideoCallSettings({ [name]: val });
		if (resp.ok) {
			dispatch.setProfile({
				type: ProfileActionType.updateSettings,
				data: {
					video: {
						...state.profile.settings.video,
						[name]: val,
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

	const handleCopy = async () => {
		await copyString("fyp.fans/videocall/jane");
		setCopied(true);
	};

	return (
		<FansView>
			<FypText
				fontSize={23}
				lineHeight={31}
				fontWeight={600}
				margin={{ b: 28 }}
			>
				Settings
			</FypText>
			<FansView height={52} justifyContent="center">
				<FansSwitch
					text="Video calls enabled"
					value={videoCallsEnabled}
					onValueChange={(value: boolean) =>
						handleUpdate("videoCallsEnabled", value)
					}
				/>
			</FansView>
			<FansDivider style={tw.style("my-1")} />
			<FansView height={52} justifyContent="center" margin={{ b: 35 }}>
				<FansSwitch
					text="Vacation mode"
					value={vacationMode}
					onValueChange={(value: boolean) =>
						handleUpdate("vacationMode", value)
					}
				/>
			</FansView>
			<FansView>
				<FypText
					fontSize={17}
					lineHeight={22}
					fontWeight={600}
					margin={{ b: 16 }}
				>
					Video call order link
				</FypText>
				<FansView
					borderRadius={42}
					height={42}
					flexDirection="row"
					alignItems="center"
					justifyContent="between"
					gap={8}
					padding={{ l: 17, r: 4 }}
					style={tw.style(
						"border border-fans-grey dark:border-fans-grey-43",
					)}
				>
					<FypText
						fontSize={16}
						fontWeight={600}
						lineHeight={21}
						numberOfLines={1}
						style={tw.style("relative pr-[42px]")}
						onPress={handleCopy}
					>
						fyp.fans/videocall/jane
						{copied ? (
							<FypSvg
								svg={CheckSvg}
								width={16}
								height={16}
								color="fans-purple"
								style={[
									tw.style("absolute right-0 top-1/2"),
									{ transform: [{ translateY: -8 }] },
								]}
							/>
						) : (
							<FypSvg
								svg={CopySvg}
								width={12}
								height={16}
								color="fans-purple"
								style={[
									tw.style("absolute right-0 top-1/2"),
									{ transform: [{ translateY: -8 }] },
								]}
							/>
						)}
					</FypText>
					<FansIconButton
						size={34}
						backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
					>
						<FypSvg
							svg={RedirectSvg}
							width={18}
							height={13}
							color="fans-black dark:fans-white"
						/>
					</FansIconButton>
				</FansView>
			</FansView>

			<FansDivider style={tw.style("mt-9 mb-[30px]")} />

			<FansView>
				<FypText
					fontSize={19}
					lineHeight={26}
					fontWeight={600}
					margin={{ b: 40 }}
				>
					Notifications
				</FypText>
				<FansView
					flexDirection="row"
					alignItems="center"
					justifyContent="between"
					margin={{ b: 26 }}
				>
					<FypText fontSize={17} lineHeight={22} fontWeight={600}>
						Notify top fans
					</FypText>
					<FypText
						fontSize={17}
						lineHeight={22}
						fontWeight={600}
						style={tw.style("text-fans-purple")}
						onPress={handleSelectAll}
					>
						Select all
					</FypText>
				</FansView>
				<FansView height={52} justifyContent="center">
					<FansSwitch
						text="New requests"
						value={notificationNewRequests}
						onValueChange={(value: boolean) =>
							handleUpdate("notificationNewRequests", value)
						}
					/>
				</FansView>
				<FansDivider style={tw.style("my-1")} />
				<FansView height={52} justifyContent="center">
					<FansSwitch
						text="Pending videos"
						value={true}
						onValueChange={(value: boolean) => {}}
					/>
				</FansView>
				<FansDivider style={tw.style("my-1")} />
				<FansView
					height={52}
					justifyContent="center"
					margin={{ b: 35 }}
				>
					<FansSwitch
						text="Completed requests"
						value={true}
						onValueChange={(value: boolean) => {}}
					/>
				</FansView>
				<FypText
					fontSize={17}
					lineHeight={22}
					fontWeight={600}
					margin={{ t: 35, b: 26 }}
				>
					Notification methods
				</FypText>
				<FansView height={52} justifyContent="center">
					<FansSwitch
						text="Email"
						value={notificationsByEmail}
						onValueChange={(value: boolean) =>
							handleUpdate("notificationsByEmail", value)
						}
					/>
				</FansView>
				<FansDivider style={tw.style("my-1")} />
				<FansView
					height={52}
					alignItems="center"
					justifyContent="between"
					flexDirection="row"
				>
					<FansView flexDirection="row" alignItems="center" gap={8}>
						<FypText
							fontSize={18}
							lineHeight={24}
							style={tw.style(
								"text-fans-grey-b1 dark:text-fans-grey-70",
							)}
						>
							Phone
						</FypText>
						<FypText
							fontSize={18}
							lineHeight={24}
							fontWeight={600}
							style={tw.style("text-fans-purple")}
						>
							+Add phone number
						</FypText>
					</FansView>
					<FansSwitch
						value={notificationsByPhone}
						onValueChange={(value: boolean) =>
							handleUpdate("notificationsByPhone", value)
						}
					/>
				</FansView>
			</FansView>

			<FansDivider style={tw.style("mt-9 mb-[30px]")} />

			<FansView>
				<FypText
					fontWeight={600}
					fontSize={19}
					lineHeight={26}
					margin={{ b: 26 }}
				>
					Title & description
				</FypText>
				<TitleForm />
			</FansView>

			<FansDivider style={tw.style("mt-9 mb-7")} />

			<FansView>
				<FypText
					fontWeight={600}
					fontSize={19}
					lineHeight={26}
					margin={{ b: 12 }}
				>
					Prices
				</FypText>
				<FypText
					fontSize={16}
					lineHeight={21}
					margin={{ b: 50 }}
					style={tw.style("text-fans-grey-48")}
				>
					Create prices for different video call durations. Provide up
					to 10 time options for fans to buy
				</FypText>
				<PricesForm />
			</FansView>

			<FansDivider style={tw.style("mt-10 mb-[30px]")} />

			<FansView>
				<FypText fontWeight={600} fontSize={19} margin={{ b: 26 }}>
					Availability
				</FypText>
				<TimeframeForm />
			</FansView>

			<FansDivider style={tw.style("mt-[70px] mb-[30px]")} />

			<FansView margin={{ b: 36 }}>
				<FypText fontWeight={600} fontSize={19} margin={{ b: 26 }}>
					Content preferences
				</FypText>
				<ContentPreferenceForm />
			</FansView>

			<RoundButton onPress={handleNext}>Next</RoundButton>
		</FansView>
	);
};

export default SettingsForm;
