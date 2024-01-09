import { Trash2Svg } from "@assets/svgs/common";
import RoundButton from "@components/common/RoundButton";
import {
	FansDivider,
	FansGap,
	FansSwitch,
	FansTextInputWithLabelInside,
	FansView,
} from "@components/controls";
import { ProfileActionType, useAppContext } from "@context/useAppContext";
import {
	getUserSettings,
	updateCameoSettings,
	updateVideoSettings,
} from "@helper/endpoints/profile/apis";
import tw from "@lib/tailwind";
import { RoundButtonType } from "@usertypes/commonEnums";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

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
	const lineStyles = active ? {} : {};

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

	return (
		<View style={styles.previewContainer}>
			<View style={[styles.box, { flex: 0.4, marginRight: 18 }]}>
				<FansTextInputWithLabelInside
					label="MIN"
					placeholder="Time"
					value={localPriceItem.price.toString()}
					onChangeText={(text: string) =>
						onTextChanged(text, "price")
					}
					onBlur={handleBlur} // Call handleBlur when input focus is lost
				/>
			</View>
			<View style={[styles.box, { flex: 0.4, marginRight: 10 }]}>
				<FansTextInputWithLabelInside
					label="$"
					placeholder="Price"
					value={localPriceItem.duration.toString()}
					onChangeText={(text: string) =>
						onTextChanged(text, "duration")
					}
					onBlur={handleBlur} // Call handleBlur when input focus is lost
				/>
			</View>
			<View style={[styles.box, { flex: 0.2, flexDirection: "row" }]}>
				<FansSwitch
					value={priceItem.active}
					onValueChange={(value: boolean) =>
						onChange({ ...priceItem, active: value })
					}
					justifyContent="justify-end"
				/>
				<View style={{ marginLeft: 18 }}>
					<TouchableOpacity
						style={tw.style(
							"flex-row justify-start items-center gap-5 py-4",
						)}
						onPress={onDelete}
					>
						<FansView width={11.87} height={14.76}>
							{!active && (
								<Trash2Svg color={tw.color("fans-red")} />
							)}
						</FansView>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

const Step1ValuesGrid = () => {
	const { state, dispatch } = useAppContext();
	const { cameo } = state.profile.settings;

	const { pricesDuration } = cameo;

	const [newPrice, setNewPrice] = useState<PriceItem>({
		price: 0,
		duration: 0,
		active: false,
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
			cameo: {
				...state.profile.settings.cameo,
				pricesDuration: newPrices,
			},
		};
		const response = await updateVideoSettings(updatedSettings);

		if (response.ok) {
			fetchProfileSettings();
		}
	};

	const handleDelete = async (index: number) => {
		const updatedPrices = [...cameo.pricesDuration];
		updatedPrices.splice(index, 1);

		const updatedSettings = {
			...state.profile.settings,
			cameo: {
				...state.profile.settings.cameo,
				pricesDuration: updatedPrices,
			},
		};

		const response = await updateCameoSettings(updatedSettings);

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
			const updatedPrices = [...cameo.pricesDuration, newPrice];

			const updatedSettings = {
				...state.profile.settings,
				cameo: {
					...cameo,
					pricesDuration: updatedPrices,
				},
			};
			const response = await updateCameoSettings({
				cameo: updatedSettings.cameo,
			});

			if (response.ok) {
				setNewPrice({ price: 0, duration: 0, active: false });
				fetchProfileSettings();
			}
		}
	};

	return (
		<View style={styles.container}>
			{pricesDuration.map((price, index) => (
				<View key={index}>
					<Line
						priceItem={price}
						onChange={(updatedPriceItem) =>
							handleInputChange(index, updatedPriceItem)
						}
						onDelete={() => handleDelete(index)}
					/>

					<View style={styles.separator}>
						<FansDivider />
					</View>
				</View>
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
			<View style={styles.buttonContainer}>
				<RoundButton
					variant={RoundButtonType.OUTLINE_PRIMARY}
					style={styles.button}
					onPress={handleAddDuration}
				>
					Add duration
				</RoundButton>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	line: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	separator: {
		height: 35,
		padding: 17,
	},
	buttonContainer: {
		flex: 1,
		justifyContent: "center",
	},
	button: {},
	container: {
		flex: 1,
		paddingHorizontal: 10,
	},
	box: {
		flex: 1,
	},
	boxLabel: {
		minWidth: 80,
		padding: 8,
		borderRadius: 4,
		marginTop: 8,
	},
	label: {
		marginTop: 6,
		fontSize: 16,
		fontWeight: "100",
	},
	previewContainer: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
	},
	row: {
		flex: 1,
		flexDirection: "row",
		flexWrap: "wrap",
		alignItems: "center",
		marginBottom: 10,
	},
	input: {
		borderBottomWidth: 1,
		paddingVertical: 3,
		width: 50,
		textAlign: "center",
	},
});

export default Step1ValuesGrid;
