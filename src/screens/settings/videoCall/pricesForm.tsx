import RoundButton from "@components/common/RoundButton";
import RoundTextInput from "@components/common/RoundTextInput";
import { FypText, FypDropdown, FypNullableView } from "@components/common/base";
import { FansDivider, FansSwitch, FansView } from "@components/controls";
import { videoCallPriceOptions } from "@constants/common";
import { defaultVideoCallDurationFormData } from "@constants/defaultFormData";
import { ProfileActionType, useAppContext } from "@context/useAppContext";
import {
	getVideoCallDurations,
	createVideoCallDuration,
	updateVideoCallDuration,
} from "@helper/endpoints/settings/apis";
import tw from "@lib/tailwind";
import { RoundButtonType } from "@usertypes/commonEnums";
import { IVideoCallDuration } from "@usertypes/types";
import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

interface LineProps {
	duration: IVideoCallDuration;
	onChange: (duration: IVideoCallDuration) => void;
}

const Line: React.FC<LineProps> = (props) => {
	const { duration, onChange } = props;
	const [localPriceItem, setLocalPriceItem] =
		useState<IVideoCallDuration>(duration);

	const onChangePrice = (text: string, property: string) => {
		const numericValue = text.replace(/[^0-9]/g, "");
		setLocalPriceItem({ ...localPriceItem, [property]: +numericValue });
	};

	const handleChangeMinutes = (minues: string) => {
		onChange({ ...localPriceItem, length: parseInt(minues) });
		setLocalPriceItem({ ...localPriceItem, length: parseInt(minues) });
	};

	const handleBlur = () => {
		if (localPriceItem.price !== duration.price) {
			onChange(localPriceItem);
		}
	};

	useEffect(() => {
		setLocalPriceItem(duration);
	}, [duration]);

	return (
		<FansView
			alignItems="center"
			flexDirection="row"
			gap={{ xs: 12, md: 36 }}
		>
			<FansView flexDirection="row" gap={{ xs: 9, md: 14 }} flex="1">
				<FansView flex="1">
					<FypDropdown
						data={videoCallPriceOptions}
						value={localPriceItem.length.toString()}
						onSelect={(val) => handleChangeMinutes(val as string)}
					/>
				</FansView>
				<FansView flex="1" position="relative">
					<FypText
						fontSize={14}
						lineHeight={19}
						style={tw.style(
							"absolute left-5 top-[11px] text-fans-black dark:text-fans-white z-10",
						)}
					>
						$
					</FypText>
					<RoundTextInput
						placeholder="Price"
						value={localPriceItem.price.toString()}
						onChangeText={(text: string) =>
							onChangePrice(text, "price")
						}
						onBlur={handleBlur}
						customStyles="pl-[38px] bg-fans-grey-f0 dark:bg-fans-grey-43 border-0 text-[18px] leading-[26px]"
						keyboardType="numeric"
					/>
				</FansView>
			</FansView>
			{duration.id === "0" ? (
				<FansView width={40}></FansView>
			) : (
				<FansSwitch
					value={duration.isEnabled}
					onValueChange={(value: boolean) =>
						onChange({ ...duration, isEnabled: value })
					}
					justifyContent="justify-end"
				/>
			)}
		</FansView>
	);
};

const PricesForm = () => {
	const { state, dispatch } = useAppContext();

	const [isLoading, setIsLoading] = useState(false);
	const [durations, setDurations] = useState<IVideoCallDuration[]>([]);
	const [showNewForm, setShowNewForm] = useState(false);
	const [formData, setFormData] = useState<IVideoCallDuration>(
		defaultVideoCallDurationFormData,
	);

	const fetchVideoCallDurations = async () => {
		const resp = await getVideoCallDurations();
		if (resp.ok) {
			dispatch.setProfile({
				type: ProfileActionType.updateSettings,
				data: {
					video: {
						...state.profile.settings.video,
						meetingDurations: resp.data,
					},
				},
			});
			setDurations(resp.data);
		} else {
			setDurations([]);
		}
	};

	const handleUpdate = async (duration: IVideoCallDuration) => {
		const { id, ...postbody } = duration;
		const resp = await updateVideoCallDuration(postbody, {
			id: id,
		});
		if (resp.ok) {
			setDurations(durations.map((el) => (el.id === id ? duration : el)));
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const handleAddDuration = async () => {
		if (!showNewForm) {
			setShowNewForm(true);
		} else {
			setIsLoading(true);
			const resp = await createVideoCallDuration({
				price: formData.price,
				length: formData.length,
				currency: "usd",
				isEnabled: true,
			});
			setIsLoading(false);
			if (resp.ok) {
				fetchVideoCallDurations();
				setShowNewForm(false);
				setFormData(defaultVideoCallDurationFormData);
			} else {
				Toast.show({
					type: "error",
					text1: resp.data.message,
				});
			}
		}
	};

	useEffect(() => {
		setFormData(defaultVideoCallDurationFormData);
		fetchVideoCallDurations();
	}, []);

	return (
		<FansView>
			{durations.map((duration, index) => (
				<FansView key={index}>
					<Line duration={duration} onChange={handleUpdate} />
					{index !== durations.length - 1 ? (
						<FansDivider style={tw.style("my-[18px] md:my-4")} />
					) : null}
				</FansView>
			))}
			<FypNullableView visible={showNewForm}>
				<FansView>
					<FansDivider style={tw.style("my-[18px] md:my-4")} />
					<Line duration={formData} onChange={setFormData} />
				</FansView>
			</FypNullableView>

			<FypNullableView
				visible={videoCallPriceOptions.length !== durations.length}
			>
				<FansView flex="1" justifyContent="center" margin={{ t: 30 }}>
					<RoundButton
						variant={RoundButtonType.OUTLINE_PRIMARY}
						onPress={handleAddDuration}
						loading={isLoading}
					>
						{showNewForm ? "Save duration" : "Add duration"}
					</RoundButton>
				</FansView>
			</FypNullableView>
		</FansView>
	);
};

export default PricesForm;
