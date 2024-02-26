import RoundButton from "@components/common/RoundButton";
import { FypNullableView } from "@components/common/base";
import { FansDivider, FansView } from "@components/controls";
import { PriceDurationFormRow } from "@components/videoCall";
import { videoCallPriceOptions } from "@constants/common";
import { defaultVideoCallDurationFormData } from "@constants/defaultFormData";
import {
	createVideoCallDuration,
	updateVideoCallDuration,
	deleteVideoCallDuration,
} from "@helper/endpoints/videoCalls/apis";
import tw from "@lib/tailwind";
import { RoundButtonType } from "@usertypes/commonEnums";
import { IVideoDurationForm } from "@usertypes/types";
import React, { FC } from "react";
import Toast from "react-native-toast-message";

interface Props {
	durations: IVideoDurationForm[];
	updateDurationsCallback: (durations: IVideoDurationForm[]) => void;
}

const PricesForm: FC<Props> = (props) => {
	const { durations, updateDurationsCallback } = props;

	const handleUpdate = async (duration: IVideoDurationForm) => {
		const { id, ...postbody } = duration;
		if (duration.price > 200000) {
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
				updateDurationsCallback([
					...durations.filter((el) => el.id !== duration.id),
					resp.data,
				]);
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
				updateDurationsCallback(
					durations.map((el) => (el.id === id ? duration : el)),
				);
			} else {
				Toast.show({
					type: "error",
					text1: resp.data.message,
				});
			}
		}
	};

	const handleAddDuration = async () => {
		updateDurationsCallback([
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
				updateDurationsCallback(durations.filter((el) => el.id !== id));
			} else {
				Toast.show({
					type: "error",
					text1: resp.data.message,
				});
			}
		} else {
			updateDurationsCallback(durations.filter((el) => el.id !== id));
		}
	};

	return (
		<FansView>
			{durations.map((duration, index) => (
				<FansView key={index}>
					<PriceDurationFormRow
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
