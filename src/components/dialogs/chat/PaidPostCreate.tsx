import { Close1Svg } from "@assets/svgs/common";
import BottomSheetWrapper from "@components/common/bottomSheetWrapper";
import {
	FansGap,
	FansSvg,
	FansText,
	FansView,
	FansTextInput3,
	FansButton2,
} from "@components/controls";
import tw from "@lib/tailwind";
import { IPickerMedia } from "@usertypes/types";
import useDocumentPicker from "@utils/useDocumentPicker";
import React, { FC, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";

interface Props {
	open: boolean;
	onClose: () => void;
	onSubmit: (price: string, previewFiles: IPickerMedia[]) => void;
}

const PaidPostCreateSheet: FC<Props> = (props) => {
	const { open, onClose, onSubmit } = props;

	const { useImagePicker } = useDocumentPicker();

	const [price, setPrice] = useState("0");
	const [previewFiles, setPreviewFiles] = useState<IPickerMedia[]>([]);

	const handlePressPhoto = async (index?: number) => {
		const result = await useImagePicker(true);
		if (result.ok) {
			setPreviewFiles((currentImages) => {
				const updatedImages =
					index !== undefined
						? currentImages.filter((_, i) => i !== index)
						: currentImages;
				return [...updatedImages, ...result.data];
			});
		} else {
			Toast.show({
				type: "error",
				text1: result?.message ?? "",
			});
		}
	};

	return (
		<BottomSheetWrapper open={open} onClose={onClose}>
			<View style={tw.style("flex-row items-center justify-between")}>
				<FansText
					style={tw.style("flex-1 text-center")}
					fontFamily="inter-bold"
					fontSize={17}
				>
					Message price
				</FansText>
				<TouchableOpacity onPress={onClose}>
					<FansView
						width={30}
						height={30}
						style={tw.style(
							"absolute top-[20px] right-[20px] align-self-end mr-4",
						)}
						alignItems="center"
						backgroundColor={{ color: "black", opacity: 30 }}
						borderRadius="full"
						justifyContent="center"
					>
						<FansSvg
							width={11.46}
							height={11.45}
							svg={Close1Svg}
							color1="white"
						/>
					</FansView>
				</TouchableOpacity>
			</View>

			<View style={tw.style("p-4")}>
				<FansText fontFamily="inter-bold" style={tw.style("mb-4")}>
					Price
				</FansText>
				<FansTextInput3
					style={tw.style("p-2 rounded")}
					placeholder="$5"
					keyboardType="numeric"
					onChangeText={setPrice}
					value={price}
				/>

				<FansGap height={30} />

				<FansText fontFamily="inter-bold" style={tw.style("mb-4")}>
					Free preview (optional)
				</FansText>
				<FansButton2
					style={tw.style("rounded-full")}
					backgroundColor="transparent"
					textColor="purple"
					title="Add preview"
					onPress={() => handlePressPhoto()}
				/>

				<FansGap height={30} />

				<FansButton2
					style={tw.style("rounded-full")}
					title="Save"
					onPress={() => onSubmit(price, previewFiles)}
				/>
			</View>
		</BottomSheetWrapper>
	);
};

export default PaidPostCreateSheet;
