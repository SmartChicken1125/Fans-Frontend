import { FypNullableView } from "@components/common/base";
import tw from "@lib/tailwind";
import { manipulateAsync } from "expo-image-manipulator";
import React, { useEffect } from "react";
import { Platform, StatusBar, View } from "react-native";
import { RecoilRoot, useRecoilState } from "recoil";
import { ControlBar } from "./controlBar";
import { EditingWindow } from "./editingWindow";
import {
	EditorContext,
	ImageData,
	TransformOperations,
	editingModeState,
	imageDataState,
	readyState,
} from "./store";

export interface ImageEditorProps {
	visible: boolean;
	onCloseEditor: () => void;
	imageUri: string | undefined;
	fixedCropAspectRatio?: number;
	minimumCropDimensions?: {
		width: number;
		height: number;
	};
	onEditingComplete: (result: ImageData) => void;
	lockAspectRatio?: boolean;
	allowedTransformOperations?: TransformOperations[];
}

function ImageEditorCore(props: ImageEditorProps) {
	const {
		minimumCropDimensions = { width: 0, height: 0 },
		fixedCropAspectRatio: fixedAspectRatio = 1.6,
		lockAspectRatio = false,
		allowedTransformOperations,
	} = props;

	const [, setImageData] = useRecoilState(imageDataState);
	const [, setReady] = useRecoilState(readyState);
	const [, setEditingMode] = useRecoilState(editingModeState);

	// Initialize the image data when it is set through the props
	useEffect(() => {
		const initialize = async () => {
			if (props.imageUri) {
				const enableEditor = () => {
					setReady(true);
				};
				// Platform check
				if (Platform.OS === "web") {
					const img = document.createElement("img");
					img.onload = () => {
						setImageData({
							uri: props.imageUri ?? "",
							height: img.height,
							width: img.width,
						});
						enableEditor();
					};
					img.src = props.imageUri;
				} else {
					const { width: pickerWidth, height: pickerHeight } =
						await manipulateAsync(props.imageUri, []);
					setImageData({
						uri: props.imageUri,
						width: pickerWidth,
						height: pickerHeight,
					});
					enableEditor();
				}
			}
		};
		initialize();
	}, [props.imageUri]);

	const onCloseEditor = () => {
		props.onCloseEditor();
	};

	useEffect(() => {
		// Reset the state of things and only render the UI
		// when this state has been initialized
		if (!props.visible) {
			setReady(false);
		}
		// Check if the mode is set to crop only if this is the case then set the editingMode
		// to crop
		setEditingMode("crop");
	}, [props.visible]);

	return (
		<EditorContext.Provider
			value={{
				minimumCropDimensions,
				lockAspectRatio,
				fixedAspectRatio,
				allowedTransformOperations,
				onCloseEditor,
				onEditingComplete: props.onEditingComplete,
			}}
		>
			<StatusBar hidden={props.visible} />
			<ImageEditorView {...props} />
		</EditorContext.Provider>
	);
}

export function ImageEditorView(props: ImageEditorProps) {
	const [ready, setReady] = useRecoilState(readyState);

	return (
		<FypNullableView visible={ready}>
			<View style={tw.style("flex-1 bg-fans-black-2e relative")}>
				<ControlBar />
				<EditingWindow />
			</View>
		</FypNullableView>
	);
}

export function ImageEditor(props: ImageEditorProps) {
	return (
		<RecoilRoot>
			<ImageEditorCore {...props} />
		</RecoilRoot>
	);
}
