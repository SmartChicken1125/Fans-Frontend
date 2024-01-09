import { Trash2Svg } from "@assets/svgs/common";
import RoundButton from "@components/common/RoundButton";
import RoundTextInput from "@components/common/RoundTextInput";
import { FypText } from "@components/common/base";
import {
	FansDivider,
	FansGap,
	FansSwitch,
	FansView,
} from "@components/controls";
import { ProfileActionType, useAppContext } from "@context/useAppContext";
import {
	getUserSettings,
	updateVideoSettings,
} from "@helper/endpoints/profile/apis";
import tw from "@lib/tailwind";
import { RoundButtonType } from "@usertypes/commonEnums";
import React, { useEffect, useState } from "react";

interface PriceItem {
	price: number;
	duration: number;
	active: boolean;
}

const Line: React.FC<{
	priceItem: PriceItem;
	onChange: (priceItem: PriceItem) => void;
	onDelete: () => void;
	active?: boolean;
}> = ({ priceItem, onChange, onDelete, active }) => {
	const [localPriceItem, setLocalPriceItem] = useState<PriceItem>(priceItem);

	const onTextChanged = (text: string, property: string) => {
		const numericValue = text.replace(/[^0-9]/g, "");
		setLocalPriceItem({ ...localPriceItem, [property]: +numericValue });
	};

	const handleBlur = () => {
		if (
			localPriceItem.price !== priceItem.price ||
			localPriceItem.duration !== priceItem.duration ||
			localPriceItem.active !== priceItem.active
		) {
			onChange(localPriceItem);
		}
	};

	useEffect(() => {
		setLocalPriceItem(priceItem);
	}, [priceItem]);

	return (
		<FansView flex="1" alignItems="center" flexDirection="row">
			<FansView
				style={[{ flex: 0.4, marginRight: 18 }]}
				position="relative"
			>
				<FypText
					fontSize={14}
					lineHeight={19}
					style={tw.style(
						"absolute left-5 top-[11px] text-fans-black dark:text-fans-white z-10",
					)}
				>
					MIN
				</FypText>
				<RoundTextInput
					placeholder="Time"
					value={localPriceItem.price.toString()}
					onChangeText={(text: string) =>
						onTextChanged(text, "price")
					}
					onBlur={handleBlur}
					customStyles="pl-14 bg-fans-grey-f0 dark:bg-fans-grey-43 border-0 text-[18px] leading-[26px]"
				/>
			</FansView>
			<FansView
				style={[{ flex: 0.4, marginRight: 10 }]}
				position="relative"
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
					value={localPriceItem.duration.toString()}
					onChangeText={(text: string) =>
						onTextChanged(text, "duration")
					}
					onBlur={handleBlur}
					customStyles="pl-[38px] bg-fans-grey-f0 dark:bg-fans-grey-43 border-0 text-[18px] leading-[26px]"
				/>
			</FansView>
			<FansView flexDirection="row" style={[{ flex: 0.2 }]}>
				<FansSwitch
					value={priceItem.active}
					onValueChange={(value: boolean) =>
						onChange({ ...priceItem, active: value })
					}
					justifyContent="justify-end"
				/>
				<FansView margin={{ l: 18 }}>
					<FansView
						flexDirection="row"
						justifyContent="start"
						alignItems="center"
						gap={20}
						padding={{ y: 16 }}
						pressableProps={{
							onPress: onDelete,
						}}
					>
						<FansView width={11.87} height={14.76}>
							{!active && (
								<Trash2Svg color={tw.color("fans-red")} />
							)}
						</FansView>
					</FansView>
				</FansView>
			</FansView>
		</FansView>
	);
};

const PricesForm = () => {
	const { state, dispatch } = useAppContext();
	const { video } = state.profile.settings;

	const { pricesDuration } = video;
	const [newPrice, setNewPrice] = useState<PriceItem>({
		price: 0,
		duration: 0,
		active: true,
	});

	useEffect(() => {
		fetchProfileSettings();
	}, []);

	const handleInputChange = async (
		index: number,
		updatedPriceItem: PriceItem,
	) => {
		const newPrices = [...pricesDuration];
		newPrices[index] = updatedPriceItem;
		const updatedSettings = {
			...state.profile.settings,
			video: {
				...state.profile.settings.video,
				pricesDuration: newPrices,
			},
		};

		const response = await updateVideoSettings(updatedSettings);

		if (response.ok) {
			fetchProfileSettings();
		}
	};

	const handleDelete = async (index: number) => {
		const updatedPrices = [...video.pricesDuration];
		updatedPrices.splice(index, 1);

		const updatedSettings = {
			...state.profile.settings,
			video: {
				...state.profile.settings.video,
				pricesDuration: updatedPrices,
			},
		};

		const response = await updateVideoSettings(updatedSettings);

		if (response.ok) {
			fetchProfileSettings();
		}
	};

	const fetchProfileSettings = async () => {
		const response = await getUserSettings();
		if (response.ok) {
			const profileSettings = response.data;

			dispatch.setProfile({
				type: ProfileActionType.updateSettings,
				data: profileSettings,
			});
		}
	};

	const handleAddDuration = async () => {
		if (newPrice.price !== 0 && newPrice.duration !== 0) {
			const updatedPrices = [...video.pricesDuration, newPrice];

			const updatedSettings = {
				...state.profile.settings,
				video: {
					...video,
					pricesDuration: updatedPrices,
				},
			};

			const response = await updateVideoSettings({
				video: updatedSettings.video,
			});

			if (response.ok) {
				setNewPrice({ price: 0, duration: 0, active: true });
				fetchProfileSettings();
			}
		}
	};

	return (
		<FansView flex="1" padding={{ x: 10 }}>
			{pricesDuration.map((price, index) => (
				<FansView key={index}>
					<Line
						priceItem={price}
						onChange={(updatedPriceItem) =>
							handleInputChange(index, updatedPriceItem)
						}
						onDelete={() => handleDelete(index)}
					/>

					<FansView height={35} padding={17}>
						<FansDivider />
					</FansView>
				</FansView>
			))}
			<Line
				priceItem={newPrice}
				onChange={(updatedPriceItem) => setNewPrice(updatedPriceItem)}
				onDelete={() =>
					setNewPrice({ price: 0, duration: 0, active: false })
				}
				active
			/>
			<FansGap height={27.4} />
			<FansView flex="1" justifyContent="center">
				<RoundButton
					variant={RoundButtonType.OUTLINE_PRIMARY}
					onPress={handleAddDuration}
					disabled={newPrice.price === 0 || newPrice.duration === 0}
				>
					Add duration
				</RoundButton>
			</FansView>
		</FansView>
	);
};

export default PricesForm;
