import { TrashSvg } from "@assets/svgs/common";
import RoundButton from "@components/common/RoundButton";
import RoundTextInput from "@components/common/RoundTextInput";
import {
	FypText,
	FypDropdown,
	FypNullableView,
	FypSvg,
} from "@components/common/base";
import { FansDivider, FansView, FansIconButton } from "@components/controls";
import { videoCallPriceOptions } from "@constants/common";
import { defaultVideoCallDurationFormData } from "@constants/defaultFormData";
import { ProfileActionType, useAppContext } from "@context/useAppContext";
import {
	getVideoCallDurations,
	createVideoCallDuration,
	updateVideoCallDuration,
	deleteVideoCallDuration,
} from "@helper/endpoints/videoCalls/apis";
import tw from "@lib/tailwind";
import { RoundButtonType } from "@usertypes/commonEnums";
import { IVideoCallDuration } from "@usertypes/types";
import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

interface IExtendedVideoCallDuration extends IVideoCallDuration {
	isNew?: boolean;
}

interface LineProps {
	duration: IExtendedVideoCallDuration;
	onChange: (duration: IExtendedVideoCallDuration) => void;
	onDelete: () => void;
}

const Line: React.FC<LineProps> = (props) => {
	const { duration, onChange, onDelete } = props;
	const [localPriceItem, setLocalPriceItem] =
		useState<IExtendedVideoCallDuration>(duration);

	const onChangePrice = (text: string, property: string) => {
		const numericValue = text.replace(/[^0-9]/g, "");
		setLocalPriceItem({ ...localPriceItem, [property]: +numericValue });
	};

	const handleChangeMinutes = (minues: string) => {
		if (localPriceItem.price !== 0) {
			onChange({ ...localPriceItem, length: parseInt(minues) });
		}
		setLocalPriceItem({ ...localPriceItem, length: parseInt(minues) });
	};

	const handleBlur = () => {
		if (localPriceItem.isNew) {
			if (localPriceItem.price !== 0 && localPriceItem.length !== 0) {
				onChange(localPriceItem);
			}
		} else {
			if (localPriceItem.price !== duration.price) {
				onChange(localPriceItem);
			}
		}
	};

	useEffect(() => {
		setLocalPriceItem(duration);
	}, [duration]);

	return (
		<FansView
			alignItems="center"
			flexDirection="row"
			gap={{ xs: 18, md: 42 }}
		>
			<FansView flexDirection="row" gap={{ xs: 9, md: 14 }} flex="1">
				<FansView style={tw.style("flex-0.65 md:flex-1")}>
					<FypDropdown
						data={videoCallPriceOptions}
						value={localPriceItem.length.toString()}
						onSelect={(val) => handleChangeMinutes(val as string)}
						placeholder="Select Duration"
					/>
				</FansView>
				<FansView
					position="relative"
					style={tw.style("flex-0.35 md:flex-1")}
				>
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
			<FansIconButton
				size={34}
				backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
				onPress={onDelete}
			>
				<FypSvg
					svg={TrashSvg}
					width={12}
					height={15}
					color="fans-red"
				/>
			</FansIconButton>
		</FansView>
	);
};

const PricesForm = () => {
	const { state, dispatch } = useAppContext();

	const [durations, setDurations] = useState<IExtendedVideoCallDuration[]>(
		[],
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

	const handleUpdate = async (duration: IExtendedVideoCallDuration) => {
		const { id, ...postbody } = duration;
		if (duration.price > 200) {
			Toast.show({
				type: "error",
				text1: "Price must be below $200",
			});
			return;
		}
		if (duration.isNew) {
			const resp = await createVideoCallDuration({
				price: duration.price,
				length: duration.length,
				currency: "usd",
				isEnabled: true,
			});
			if (resp.ok) {
				fetchVideoCallDurations();
			} else {
				Toast.show({
					type: "error",
					text1: resp.data.message,
				});
			}
		} else {
			const resp = await updateVideoCallDuration(postbody, {
				id: id,
			});
			if (resp.ok) {
				setDurations(
					durations.map((el) => (el.id === id ? duration : el)),
				);
				dispatch.setProfile({
					type: ProfileActionType.updateSettings,
					data: {
						video: {
							...state.profile.settings.video,
							meetingDurations: durations.map((el) =>
								el.id === id ? duration : el,
							),
						},
					},
				});
			} else {
				Toast.show({
					type: "error",
					text1: resp.data.message,
				});
			}
		}
	};

	const handleAddDuration = async () => {
		setDurations([
			...durations,
			{
				...defaultVideoCallDurationFormData,
				id: new Date().getTime().toString(),
				isNew: true,
			},
		]);
	};

	const handleDelete = async (id: string) => {
		const duration = durations.find((el) => el.id === id);
		if (!duration?.isNew) {
			const resp = await deleteVideoCallDuration({ id: id }, { id: id });
			if (resp.ok) {
				setDurations(durations.filter((el) => el.id !== id));
				dispatch.setProfile({
					type: ProfileActionType.updateSettings,
					data: {
						video: {
							...state.profile.settings.video,
							meetingDurations: durations.filter(
								(el) => el.id !== id,
							),
						},
					},
				});
			} else {
				Toast.show({
					type: "error",
					text1: resp.data.message,
				});
			}
		} else {
			setDurations(durations.filter((el) => el.id !== id));
		}
	};

	useEffect(() => {
		fetchVideoCallDurations();
	}, []);

	return (
		<FansView>
			{durations.map((duration, index) => (
				<FansView key={index}>
					<Line
						duration={duration}
						onChange={handleUpdate}
						onDelete={() => handleDelete(duration.id)}
					/>
					{index !== durations.length - 1 ? (
						<FansDivider style={tw.style("my-[18px] md:my-4")} />
					) : null}
				</FansView>
			))}

			<FypNullableView
				visible={videoCallPriceOptions.length !== durations.length}
			>
				<FansView flex="1" justifyContent="center" margin={{ t: 30 }}>
					<RoundButton
						variant={RoundButtonType.OUTLINE_PRIMARY}
						onPress={handleAddDuration}
					>
						Add duration
					</RoundButton>
				</FansView>
			</FypNullableView>
		</FansView>
	);
};

export default PricesForm;
