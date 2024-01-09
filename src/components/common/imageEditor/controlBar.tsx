import { FypButton } from "@components/common/base";
import tw from "@lib/tailwind";
import React, { useContext, useEffect } from "react";
import { View } from "react-native";
import { useRecoilState } from "recoil";
import { EditorContext, editingModeState, imageDataState } from "./store";
import { usePerformCrop } from "./usePerformCrop";

function ControlBar() {
	//
	const [editingMode, setEditingMode] = useRecoilState(editingModeState);
	const [imageData] = useRecoilState(imageDataState);
	const { onCloseEditor, onEditingComplete } = useContext(EditorContext);

	const performCrop = usePerformCrop();

	const onFinishEditing = async () => {
		await performCrop();
	};

	const onPressBack = () => {
		onCloseEditor();
	};

	// Complete the editing process if we are in crop only mode after the editingMode gets set
	// back to operation select (happens internally in usePerformCrop) - can't do it in onFinishEditing
	// else it gets stale state - may need to refactor the hook as this feels hacky
	useEffect(() => {
		if (imageData.uri && editingMode === "operation-select") {
			onEditingComplete(imageData);
			onCloseEditor();
		}
	}, [imageData, editingMode]);

	return (
		<View
			style={tw.style(
				"flex-row items-center w-full justify-between px-3 absolute z-10 top-4",
			)}
		>
			<FypButton
				textStyle={tw.style("text-fans-purple font-semibold")}
				onPress={onPressBack}
			>
				Cancel
			</FypButton>
			<FypButton
				textStyle={tw.style("text-fans-purple font-semibold")}
				onPress={onFinishEditing}
			>
				Done
			</FypButton>
		</View>
	);
}

export { ControlBar };
