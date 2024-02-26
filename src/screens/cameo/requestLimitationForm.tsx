import RoundTextInput from "@components/common/RoundTextInput";
import { FypDropdown, FypText } from "@components/common/base";
import { FansView } from "@components/controls";
import { updateCustomVideoSettings } from "@helper/endpoints/cameo/apis";
import tw from "@lib/tailwind";
import { ISelectData, ICustomVideoSettings } from "@usertypes/types";
import React, { FC, useState, useEffect } from "react";
import Toast from "react-native-toast-message";

const fulFillmentOptions: ISelectData[] = [
	{ data: "24", label: "24 hours" },
	{ data: "48", label: "48 hours" },
	{ data: "72", label: "3 days" },
	{ data: "120", label: "5 days" },
	{ data: "168", label: "7 days" },
	{ data: "240", label: "10 days" },
];

const requestTypeOptions: ISelectData[] = [
	{ data: "Daily", label: "Daily" },
	{ data: "Weekly", label: "Weekly" },
	{ data: "Monthly", label: "Monthly" },
];

interface Props {
	videoSettings: ICustomVideoSettings;
	handleUpdateSettings: (videoSettings: ICustomVideoSettings) => void;
}

const RequestLimitationForm: FC<Props> = (props) => {
	const { videoSettings, handleUpdateSettings } = props;

	const [localAmount, setLocalAmount] = useState<number | null>(null);

	const handleChangeFulFillmentTime = async (val: string) => {
		const resp = await updateCustomVideoSettings({
			fulfillmentTime: parseInt(val),
		});
		if (resp.ok) {
			handleUpdateSettings({
				...videoSettings,
				fulfillmentTime: parseInt(val),
			});
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const handleChangeVolume = async (name: string, value: string | number) => {
		const resp = await updateCustomVideoSettings({
			volumeLimit: { ...videoSettings.volumeLimit, [name]: value },
		});
		if (resp.ok) {
			handleUpdateSettings({
				...videoSettings,
				volumeLimit: {
					...videoSettings.volumeLimit,
					[name]: value,
				},
			});
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	useEffect(() => {
		setLocalAmount(videoSettings.volumeLimit.amount);
	}, [videoSettings.volumeLimit.amount]);

	return (
		<FansView>
			<FansView margin={{ b: 30 }}>
				<FypText
					maxFontSizeMultiplier={600}
					fontSize={17}
					margin={{ b: 15 }}
				>
					Fullfilment timeframe
				</FypText>
				<FypDropdown
					data={fulFillmentOptions}
					value={videoSettings.fulfillmentTime.toString()}
					placeholder="Select fulfillment timeframe"
					onSelect={(val) =>
						handleChangeFulFillmentTime(val as string)
					}
				/>
			</FansView>

			<FansView>
				<FypText fontWeight={600} fontSize={17} margin={{ b: 12 }}>
					Limit volume (optional)
				</FypText>
				<FypText
					style={tw.style("text-fans-grey-48 dark:text-fans-grey-b1")}
					fontSize={16}
					margin={{ b: 12 }}
				>
					Limit the number of requests by selecting a timeframe and
					the quantity of requests within it
				</FypText>
				<FansView
					flexDirection="row"
					alignItems="center"
					gap={18}
					margin={{ b: 15 }}
				>
					<FansView flex="1">
						<FypDropdown
							data={requestTypeOptions}
							value={videoSettings.volumeLimit.unit}
							placeholder="Select"
							onSelect={(val) => handleChangeVolume("unit", val)}
						/>
					</FansView>
					<FansView flex="1">
						<RoundTextInput
							value={localAmount?.toString()}
							placeholder="Enter here"
							keyboardType="numeric"
							onChangeText={(value) =>
								setLocalAmount(parseInt(value, 10) || 0)
							}
							onBlur={() =>
								handleChangeVolume("amount", localAmount ?? 0)
							}
						/>
					</FansView>
				</FansView>
				<FypText
					fontSize={16}
					style={tw.style("text-fans-grey-70 dark:text-fans-grey-b1")}
				>
					You will be limited to{" "}
					<FypText fontSize={16} style={tw.style("text-fans-purple")}>
						{videoSettings.volumeLimit.amount}
					</FypText>{" "}
					requests per{" "}
					<FypText fontSize={16} style={tw.style("text-fans-purple")}>
						{videoSettings.volumeLimit.unit === "Weekly"
							? "week"
							: videoSettings.volumeLimit.unit === "Monthly"
							? "month"
							: "day"}
					</FypText>
				</FypText>
			</FansView>
		</FansView>
	);
};

export default RequestLimitationForm;
