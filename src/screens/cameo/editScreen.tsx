import { FypNullableView, FypText } from "@components/common/base";
import { FansScreen2, FansView } from "@components/controls";
import { defaultCustomVideoSettingData } from "@constants/common";
import { useAppContext } from "@context/useAppContext";
import {
	getCustomVideoDurations,
	getCustomVideoSettings,
} from "@helper/endpoints/cameo/apis";
import tw from "@lib/tailwind";
import { IVideoDurationForm, ICustomVideoSettings } from "@usertypes/types";
import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import ActiveOrdersTabPanel from "./activeOrdersTabPanel";
import PastOrdersTabPanel from "./pastOrdersTabPanel";
import PendingOrdersTabPanel from "./pendingOrdersTabPanel";
import RefundedOrdersTabPanel from "./refundedOrdersTabPanel";
import SettingsTabContent from "./settingsTabContent";

const tabs = [
	"Settings",
	"Pending acceptance",
	"Active orders",
	"Past orders",
	"Refunded orders",
];

const EditScreen = () => {
	const { state } = useAppContext();
	const [tab, setTab] = useState(tabs[0]);

	const [durations, setDurations] = useState<IVideoDurationForm[]>([]);
	const [videoSettings, setVideoSettings] = useState<ICustomVideoSettings>(
		defaultCustomVideoSettingData,
	);

	const fetchDurations = async () => {
		const resp = await getCustomVideoDurations();
		if (resp.ok) {
			setDurations(resp.data);
		} else {
			setDurations([]);
		}
	};

	const fetchCustomVideoSettings = async () => {
		const resp = await getCustomVideoSettings();
		if (resp.ok) {
			setVideoSettings(resp.data);
		} else {
			setDurations([]);
		}
	};

	const handleUpdateSettings = (value: ICustomVideoSettings) => {
		setVideoSettings(value);
	};

	const handleUpdateDurations = (value: IVideoDurationForm[]) => {
		setDurations(value);
	};

	useEffect(() => {
		fetchDurations();
		fetchCustomVideoSettings();
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
											videoSettings.customVideoEnabled ||
											item === "Settings"
										) {
											setTab(item);
										}
									},
								}}
								style={tw.style(
									!videoSettings.customVideoEnabled &&
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
						<SettingsTabContent
							durations={durations}
							videoSettings={videoSettings}
							handleUpdateSettings={handleUpdateSettings}
							handleUpdateDurations={handleUpdateDurations}
							handleNext={() => setTab(tabs[1])}
						/>
					</FypNullableView>
					<FypNullableView visible={tab === "Pending acceptance"}>
						<PendingOrdersTabPanel />
					</FypNullableView>
					<FypNullableView visible={tab === "Active orders"}>
						<ActiveOrdersTabPanel />
					</FypNullableView>
					<FypNullableView visible={tab === "Past orders"}>
						<PastOrdersTabPanel />
					</FypNullableView>
					<FypNullableView visible={tab === "Refunded orders"}>
						<RefundedOrdersTabPanel />
					</FypNullableView>
				</FansView>
			</FansView>
		</FansScreen2>
	);
};

export default EditScreen;
