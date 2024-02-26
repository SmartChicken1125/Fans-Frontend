import { TrashSvg } from "@assets/svgs/common";
import RoundTextInput from "@components/common/RoundTextInput";
import { FypText, FypDropdown, FypSvg } from "@components/common/base";
import { FansView, FansIconButton } from "@components/controls";
import { videoCallPriceOptions } from "@constants/common";
import tw from "@lib/tailwind";
import { IVideoDurationForm } from "@usertypes/types";
import React, { FC, useEffect, useState } from "react";

interface PriceDurationFormRowProps {
	duration: IVideoDurationForm;
	onChange: (duration: IVideoDurationForm) => void;
	onDelete: () => void;
	lengthType?: "seconds" | "minutes";
}

const PriceDurationFormRow: FC<PriceDurationFormRowProps> = (props) => {
	const { duration, onChange, onDelete, lengthType } = props;
	const [localPriceItem, setLocalPriceItem] =
		useState<IVideoDurationForm>(duration);

	const onChangePrice = (text: string) => {
		setLocalPriceItem({
			...localPriceItem,
			price: parseInt(text === "" ? "0" : text) * 100,
		});
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
						data={
							lengthType === "seconds"
								? videoCallPriceOptions.map((option) => ({
										...option,
										data: (
											parseInt(option.data) * 60
										).toString(),
								  }))
								: videoCallPriceOptions
						}
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
						value={(localPriceItem.price / 100).toString()}
						onChangeText={(text: string) => onChangePrice(text)}
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

export default PriceDurationFormRow;
