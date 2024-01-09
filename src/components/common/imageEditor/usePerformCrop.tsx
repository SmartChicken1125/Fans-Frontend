import { manipulateAsync } from "expo-image-manipulator";
import { Alert, Platform } from "react-native";
import { useRecoilState } from "recoil";
import {
	accumulatedPanState,
	cropSizeState,
	editingModeState,
	imageBoundsState,
	imageDataState,
	imageScaleFactorState,
} from "./store";

export const usePerformCrop = () => {
	const [accumulatedPan] = useRecoilState(accumulatedPanState);
	const [imageBounds] = useRecoilState(imageBoundsState);
	const [imageScaleFactor] = useRecoilState(imageScaleFactorState);
	const [cropSize] = useRecoilState(cropSizeState);
	const [imageData, setImageData] = useRecoilState(imageDataState);
	const [, setEditingMode] = useRecoilState(editingModeState);
	const onPerformCrop = async () => {
		try {
			// Calculate cropping bounds
			const croppingBounds = {
				originX: Math.round(
					(accumulatedPan.x - imageBounds.x) * imageScaleFactor,
				),
				originY: Math.round(
					(accumulatedPan.y - imageBounds.y) * imageScaleFactor,
				),
				width: Math.round(cropSize.width * imageScaleFactor),
				height: Math.round(cropSize.height * imageScaleFactor),
			};
			// Set the editor state to processing and perform the crop
			// setProcessing(true);
			const cropResult = await manipulateAsync(imageData.uri, [
				{ crop: croppingBounds },
			]);
			// Check if on web - currently there is a weird bug where it will keep
			// the canvas from ImageManipualtor at originX + width and so we'll just crop
			// the result again for now if on web - TODO write github issue!
			if (Platform.OS === "web") {
				const webCorrection = await manipulateAsync(cropResult.uri, [
					{ crop: { ...croppingBounds, originX: 0, originY: 0 } },
				]);
				const { uri, width, height } = webCorrection;
				setImageData({ uri, width, height });
			} else {
				const { uri, width, height } = cropResult;
				setImageData({ uri, width, height });
			}
			setEditingMode("operation-select");
		} catch (error) {
			// If there's an error dismiss the the editor and alert the user
			Alert.alert("An error occurred while editing.");
		}
	};
	return onPerformCrop;
};
