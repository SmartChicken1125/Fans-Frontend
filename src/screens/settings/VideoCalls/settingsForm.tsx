import { RedirectSvg, CopySvg } from "@assets/svgs/common";
import RoundButton from "@components/common/RoundButton";
import { FypText, FypSvg } from "@components/common/base";
import {
	FansView,
	FansSwitch,
	FansDivider,
	FansIconButton,
} from "@components/controls";
import tw from "@lib/tailwind";
import React, { useState } from "react";

const SettingsForm = () => {
	const [settings, setSettings] = useState({
		videoCallEnabled: true,
		vacationMode: true,
		newRequest: true,
		pendingVideos: true,
		completedRequest: true,
		email: true,
		phone: false,
	});

	const handleChangeField = (name: string, value: boolean) => {
		setSettings({
			...settings,
			[name]: value,
		});
	};

	const handleSelectAll = () => {};

	const handleSave = () => {};

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
					value={settings.videoCallEnabled}
					onValueChange={(value: boolean) =>
						handleChangeField("videoCallEnabled", value)
					}
				/>
			</FansView>
			<FansDivider style={tw.style("my-1")} />
			<FansView height={52} justifyContent="center" margin={{ b: 35 }}>
				<FansSwitch
					text="Vacation mode"
					value={settings.vacationMode}
					onValueChange={(value: boolean) =>
						handleChangeField("vacationMode", value)
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
					>
						fyp.fans/videocall/jane
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
			<FansView margin={{ b: 54 }}>
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
						value={settings.newRequest}
						onValueChange={(value: boolean) =>
							handleChangeField("newRequest", value)
						}
					/>
				</FansView>
				<FansDivider style={tw.style("my-1")} />
				<FansView height={52} justifyContent="center">
					<FansSwitch
						text="Pending videos"
						value={settings.pendingVideos}
						onValueChange={(value: boolean) =>
							handleChangeField("pendingVideos", value)
						}
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
						value={settings.completedRequest}
						onValueChange={(value: boolean) =>
							handleChangeField("completedRequest", value)
						}
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
						value={settings.email}
						onValueChange={(value: boolean) =>
							handleChangeField("email", value)
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
						value={settings.phone}
						onValueChange={(value: boolean) =>
							handleChangeField("phone", value)
						}
					/>
				</FansView>
			</FansView>
			<RoundButton onPress={handleSave}>Save</RoundButton>
		</FansView>
	);
};

export default SettingsForm;
