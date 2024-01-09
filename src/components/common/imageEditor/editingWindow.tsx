import tw from "@lib/tailwind";
import React, { useEffect, useState } from "react";
import { Image, View, LayoutRectangle } from "react-native";
import { useRecoilState } from "recoil";
import { ImageCropOverlay } from "./imageCropOverlay";
import {
	imageDataState,
	imageBoundsState,
	imageScaleFactorState,
	editingModeState,
} from "./store";

type ImageLayout = {
	height: number;
	width: number;
} | null;

function EditingWindow() {
	//
	const [imageLayout, setImageLayout] = useState<ImageLayout>(null);

	const [imageData] = useRecoilState(imageDataState);
	const [, setImageBounds] = useRecoilState(imageBoundsState);
	const [, setImageScaleFactor] = useRecoilState(imageScaleFactorState);
	const [editingMode] = useRecoilState(editingModeState);

	// Get some readable boolean states
	const isCropping = editingMode === "crop";

	const getImageFrame = (layout: LayoutRectangle) => {
		onUpdateCropLayout(layout);
	};

	const onUpdateCropLayout = (layout: ImageLayout) => {
		// Check layout is not null
		if (layout) {
			// Find the start point of the photo on the screen and its
			// width / height from there
			const editingWindowAspectRatio = layout.height / layout.width;
			//
			const imageAspectRatio = imageData.height / imageData.width;
			const bounds = { x: 0, y: 0, width: 0, height: 0 };
			let imageScaleFactor = 1;
			// Check which is larger
			if (imageAspectRatio > editingWindowAspectRatio) {
				// Then x is non-zero, y is zero; calculate x...
				bounds.x =
					(((imageAspectRatio - editingWindowAspectRatio) /
						imageAspectRatio) *
						layout.width) /
					2;
				bounds.width = layout.height / imageAspectRatio;
				bounds.height = layout.height;
				imageScaleFactor = imageData.height / layout.height;
			} else {
				// Then y is non-zero, x is zero; calculate y...
				bounds.y =
					(((1 / imageAspectRatio - 1 / editingWindowAspectRatio) /
						(1 / imageAspectRatio)) *
						layout.height) /
					2;
				bounds.width = layout.width;
				bounds.height = layout.width * imageAspectRatio;
				imageScaleFactor = imageData.width / layout.width;
			}
			setImageBounds(bounds);
			setImageScaleFactor(imageScaleFactor);
			setImageLayout({
				height: layout.height,
				width: layout.width,
			});
		}
	};

	useEffect(() => {
		onUpdateCropLayout(imageLayout);
	}, [imageData]);

	return (
		<View style={tw.style("flex-1 bg-fans-black")}>
			<Image
				style={tw.style("flex-1")}
				source={{ uri: imageData.uri }}
				onLayout={({ nativeEvent }) =>
					getImageFrame(nativeEvent.layout)
				}
				resizeMode="contain"
			/>
			{isCropping && imageLayout != null ? <ImageCropOverlay /> : null}
		</View>
	);
}

export { EditingWindow };
