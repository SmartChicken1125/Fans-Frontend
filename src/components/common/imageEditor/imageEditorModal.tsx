import React, { FC } from "react";
import { Modal } from "react-native";
import { ImageEditor, ImageEditorProps } from "./imageEditor";

const ImageEditorModal: FC<ImageEditorProps> = (props) => {
	return (
		<Modal visible={props.visible}>
			<ImageEditor {...props} />
		</Modal>
	);
};

export default ImageEditorModal;
