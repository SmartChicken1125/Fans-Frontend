import { FypNullableView, FypText } from "@components/common/base";
import { FansScreen2, FansView } from "@components/controls";
import { defaultVideoCallSettingsData } from "@constants/common";
import { useAppContext } from "@context/useAppContext";
import {
	getVideoCallDurations,
	getVideoCallTimeframes,
	getVideoCallSettings,
} from "@helper/endpoints/videoCalls/apis";
import tw from "@lib/tailwind";
import {
	IVideoDurationForm,
	ITimeframeInterval,
	IVideoCallSetting,
} from "@usertypes/types";
import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import ActiveOrdersForm from "./activeOrdersForm";
import PastOrdersForm from "./pastOrdersForm";
import PendingAcceptanceForm from "./pendingAcceptanceForm";
import RefundedOrdersForm from "./refundedOrdersForm";
import SettingsForm from "./settingsForm";

const tabs = [
	"Settings",
	"Pending acceptance",
	"Active orders",
	"Past orders",
	"Refunded orders",
];

const EditVideoCallSetupScreen = () => {
	const { state } = useAppContext();
	const [tab, setTab] = useState(tabs[0]);
	const [durations, setDurations] = useState<IVideoDurationForm[]>([]);
	const [timeframes, setTimeframes] = useState<ITimeframeInterval[]>([]);
	const [videoCallSettings, setVideoCallSettings] =
		useState<IVideoCallSetting>(defaultVideoCallSettingsData);

	const fetchVideoCallDurations = async () => {
		const resp = await getVideoCallDurations();
		if (resp.ok) {
			setDurations(resp.data);
		} else {
			setDurations([]);
		}
	};

	const updateDurationsCallback = (value: IVideoDurationForm[]) => {
		setDurations(value);
	};

	const fetchTimeframes = async () => {
		const resp = await getVideoCallTimeframes();
		if (resp.ok) {
			setTimeframes(resp.data);
		}
	};

	const updateTimeframesCallback = (value: ITimeframeInterval[]) => {
		setTimeframes(value);
	};

	const fetchVideoCallSettings = async () => {
		const resp = await getVideoCallSettings();
		if (resp.ok) {
			setVideoCallSettings(resp.data);
		}
	};

	const updateVideoCallSettingsCallback = (value: IVideoCallSetting) => {
		setVideoCallSettings(value);
	};

	useEffect(() => {
		fetchVideoCallDurations();
		fetchTimeframes();
		fetchVideoCallSettings();
	}, []);

	return (
		<FansScreen2>
			<FansView
				flex="1"
				style={tw.style(
					"w-full md:max-w-[674px] md:mx-auto",
					"pt-6 md:pt-[46px]",
				)}
			>
				<FansView margin={{ b: 28 }} flexDirection="row">
					<FlatList
						data={tabs}
						horizontal
						pagingEnabled
						keyExtractor={(item) => item}
						renderItem={({ item }) => (
							<FansView
								key={item}
								padding={{ y: 6, x: 18 }}
								margin={{ r: 5 }}
								borderRadius={40}
								pressableProps={{
									onPress: () => {
										if (
											videoCallSettings.videoCallsEnabled ||
											item === "Settings"
										) {
											setTab(item);
										}
									},
								}}
								style={tw.style(
									!videoCallSettings.videoCallsEnabled &&
										item !== "Settings"
										? "opacity-35"
										: "",
									tab === item
										? "bg-fans-purple"
										: "bg-fans-grey-f0 dark:bg-fans-grey-43",
								)}
							>
								<FypText
									fontSize={17}
									lineHeight={22}
									style={tw.style(
										tab === item
											? "text-fans-white"
											: "text-fans-black dark:text-fans-white",
									)}
								>
									{item}
								</FypText>
							</FansView>
						)}
					/>
				</FansView>
				<FansView style={tw.style("pb-10 md:pb-15")} flex="1">
					<FypNullableView visible={tab === "Settings"}>
						<SettingsForm
							durations={durations}
							updateDurationsCallback={updateDurationsCallback}
							handleNext={() => setTab(tabs[1])}
							timeframes={timeframes}
							videoCallSettings={videoCallSettings}
							fetchTimeframes={fetchTimeframes}
							updateTimeframesCallback={updateTimeframesCallback}
							updateVideoCallSettingsCallback={
								updateVideoCallSettingsCallback
							}
						/>
					</FypNullableView>
					<FypNullableView visible={tab === "Pending acceptance"}>
						<PendingAcceptanceForm />
					</FypNullableView>
					<FypNullableView visible={tab === "Active orders"}>
						<ActiveOrdersForm />
					</FypNullableView>
					<FypNullableView visible={tab === "Past orders"}>
						<PastOrdersForm />
					</FypNullableView>
					<FypNullableView visible={tab === "Refunded orders"}>
						<RefundedOrdersForm />
					</FypNullableView>
				</FansView>
			</FansView>
		</FansScreen2>
	);
};

export default EditVideoCallSetupScreen;
