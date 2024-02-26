import { RedirectSvg, CopySvg, CheckSvg } from "@assets/svgs/common";
import RoundButton from "@components/common/RoundButton";
import { FypText, FypSvg, FypSwitch } from "@components/common/base";
import { FansView, FansDivider, FansIconButton } from "@components/controls";
import { useAppContext } from "@context/useAppContext";
import { updateCustomVideoSettings } from "@helper/endpoints/cameo/apis";
import tw from "@lib/tailwind";
import { IVideoDurationForm, ICustomVideoSettings } from "@usertypes/types";
import { useBlankLink } from "@utils/useBlankLink";
import useClipboard from "@utils/useClipboard";
import { createURL } from "expo-linking";
import React, { FC, useState } from "react";
import Toast from "react-native-toast-message";
import ContentPreferenceForm from "./contentPreferenceForm";
import DescriptionForm from "./descriptionForm";
import NotificationForm from "./notificationForm";
import PricesForm from "./priceForm";
import RequestLimitationForm from "./requestLimitationForm";

interface Props {
	durations: IVideoDurationForm[];
	videoSettings: ICustomVideoSettings;
	handleUpdateSettings: (videoSettings: ICustomVideoSettings) => void;
	handleUpdateDurations: (durations: IVideoDurationForm[]) => void;
	handleNext: () => void;
}

const SettingsTabContent: FC<Props> = (props) => {
	const {
		handleNext,
		durations,
		videoSettings,
		handleUpdateSettings,
		handleUpdateDurations,
	} = props;
	const { copyString } = useClipboard();
	const [openLink] = useBlankLink();

	const { state } = useAppContext();

	const [copied, setCopied] = useState(false);

	const handleUpdate = async (name: string, val: boolean) => {
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

	const handleCopy = async () => {
		await copyString(
			createURL(`/custom-video/${state.profile.profileLink}`),
		);
		setCopied(true);
	};

	const handleOpenVideoOrderLink = () => {
		openLink(createURL(`/custom-video/${state.profile.profileLink}`));
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
			<FypSwitch
				label="Custom video orders enabled"
				minHeight={52}
				value={videoSettings.customVideoEnabled}
				onValueChange={(value: boolean) =>
					handleUpdate("customVideoEnabled", value)
				}
			/>
			<FansDivider style={tw.style("my-1")} />
			<FypSwitch
				label="Vacation mode"
				minHeight={52}
				value={true}
				onValueChange={(value: boolean) =>
					handleUpdate("vacationMode", value)
				}
			/>
			<FansView>
				<FypText
					fontSize={17}
					lineHeight={22}
					fontWeight={600}
					margin={{ b: 16 }}
				>
					Purchase custom video link
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
						{`fyp.fans/custom-video/${state.profile.profileLink}`}
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
						onPress={handleOpenVideoOrderLink}
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
					fontWeight={600}
					fontSize={19}
					lineHeight={26}
					margin={{ b: 40 }}
				>
					Notifications
				</FypText>
				<NotificationForm
					videoSettings={videoSettings}
					handleUpdateSettings={handleUpdateSettings}
				/>
			</FansView>

			<FansDivider style={tw.style("mt-9 mb-[30px]")} />

			<FansView>
				<FypText
					fontWeight={600}
					fontSize={19}
					lineHeight={26}
					margin={{ b: 26 }}
				>
					Description
				</FypText>
				<DescriptionForm
					videoSettings={videoSettings}
					handleUpdateSettings={handleUpdateSettings}
				/>
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
					Select up to 10 video durations that you can sell for
					difference prices to your fans
				</FypText>
				<PricesForm
					durations={durations}
					updateDurations={handleUpdateDurations}
				/>
			</FansView>

			<FansDivider style={tw.style("mt-10 mb-[30px]")} />

			<FansView>
				<FypText fontWeight={600} fontSize={19} margin={{ b: 26 }}>
					Request limitations
				</FypText>
				<RequestLimitationForm
					videoSettings={videoSettings}
					handleUpdateSettings={handleUpdateSettings}
				/>
			</FansView>

			<FansDivider style={tw.style("mt-[70px] mb-[30px]")} />

			<FansView margin={{ b: 36 }}>
				<FypText fontWeight={600} fontSize={19} margin={{ b: 26 }}>
					Content preferences
				</FypText>
				<ContentPreferenceForm
					videoSettings={videoSettings}
					handleUpdateSettings={handleUpdateSettings}
				/>
			</FansView>

			<RoundButton onPress={handleNext}>Save</RoundButton>
		</FansView>
	);
};

export default SettingsTabContent;
