import RoundButton from "@components/common/RoundButton";
import { FypNullableView } from "@components/common/base";
import { FansDivider, FansView } from "@components/controls";
import { PriceDurationFormRow } from "@components/videoCall";
import { videoCallPriceOptions } from "@constants/common";
import { defaultVideoCallDurationFormData } from "@constants/defaultFormData";
import {
	createCustomVideoDuration,
	deleteCustomVideoDuration,
	updateCustomVideoDuration,
} from "@helper/endpoints/cameo/apis";
import tw from "@lib/tailwind";
import { RoundButtonType } from "@usertypes/commonEnums";
import { IVideoDurationForm } from "@usertypes/types";
import React, { FC } from "react";
import Toast from "react-native-toast-message";

interface Props {
	durations: IVideoDurationForm[];
	updateDurations: (durations: IVideoDurationForm[]) => void;
}

const PricesForm: FC<Props> = (props) => {
	const { durations, updateDurations } = props;

	const handleUpdate = async (duration: IVideoDurationForm) => {
		const { id, ...postbody } = duration;
		if (duration.price > 20000) {
			Toast.show({
				type: "error",
				text1: "Price must be below $200",
			});
			return;
		}
		if (duration.isNew) {
			const resp = await createCustomVideoDuration({
				price: duration.price,
				length: duration.length,
				currency: "usd",
			});
			if (resp.ok) {
				updateDurations([
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
			const resp = await updateCustomVideoDuration(postbody, {
				id: id,
			});
			if (resp.ok) {
				updateDurations(
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
		updateDurations([
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
			const resp = await deleteCustomVideoDuration(
				{ id: id },
				{ id: id },
			);
			if (resp.ok) {
				updateDurations(durations.filter((el) => el.id !== id));
			} else {
				Toast.show({
					type: "error",
					text1: resp.data.message,
				});
			}
		} else {
			updateDurations(durations.filter((el) => el.id !== id));
		}
	};

	return (
		<FansView>
			{durations.map((duration, index) => (
				<FansView key={index}>
					<PriceDurationFormRow
						duration={duration}
						lengthType="seconds"
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
