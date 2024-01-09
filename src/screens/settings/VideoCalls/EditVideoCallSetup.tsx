import {
	FypNullableView,
	FypHorizontalScrollView2,
	FypText,
} from "@components/common/base";
import { FansScreen2, FansView } from "@components/controls";
import tw from "@lib/tailwind";
import React, { useState } from "react";
import ContentPreferenceStep from "./contentPreferenceStep";
import PriceDurationStep from "./priceDurationStep";
import SettingsForm from "./settingsForm";
import TimeframeStep from "./timeframeStep";

const tabs = [
	"Settings",
	"Active orders",
	"Past orders",
	"Refunded orders",
	"Prices",
	"Timeframes",
	"Content preferences",
];

const EditVideoCallSetup = () => {
	const [tab, setTab] = useState(tabs[0]);
	return (
		<FansScreen2>
			<FansView
				style={tw.style(
					"w-full md:max-w-[674px] md:mx-auto",
					"pt-6 md:pt-[46px]",
				)}
			>
				<FansView margin={{ b: 28 }} flexDirection="row">
					<FypHorizontalScrollView2>
						<FansView flexDirection="row" gap={5}>
							{tabs.map((el) => (
								<FansView
									key={el}
									padding={{ y: 6, x: 18 }}
									borderRadius={40}
									pressableProps={{
										onPress: () => setTab(el),
									}}
									style={tw.style(
										tab === el
											? "bg-fans-purple"
											: "bg-fans-grey-f0 dark:bg-fans-grey-43",
									)}
								>
									<FypText
										fontSize={17}
										lineHeight={22}
										style={tw.style(
											tab === el
												? "text-fans-white"
												: "text-fans-black dark:text-fans-white",
										)}
									>
										{el}
									</FypText>
								</FansView>
							))}
						</FansView>
					</FypHorizontalScrollView2>
				</FansView>
				<FansView style={tw.style("pb-10 md:pb-15")}>
					<FypNullableView visible={tab === "Settings"}>
						<SettingsForm />
					</FypNullableView>
					<FypNullableView visible={tab === "Prices"}>
						<PriceDurationStep />
					</FypNullableView>
					<FypNullableView visible={tab === "Timeframes"}>
						<TimeframeStep />
					</FypNullableView>
					<FypNullableView visible={tab === "Content preferences"}>
						<ContentPreferenceStep />
					</FypNullableView>
				</FansView>
			</FansView>
		</FansScreen2>
	);
};

export default EditVideoCallSetup;
