import tw from "@lib/tailwind";
import { SnapPoints } from "@usertypes/commonEnums";
import React, { FC } from "react";
import { Platform, TouchableOpacity } from "react-native";
import BottomSheet from "./bottomSheet";
import DialogSheet from "./dialogSheet";

interface Props {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
	snapPoint?: SnapPoints;
	dialogWrapperStyle?: string;
	topLineStyle?: string;
	paddingBottom?: number;
	hideTopLine?: boolean;
}

const BottomSheetWrapper: FC<Props> = (props) => {
	const { open, onClose } = props;
	if (Platform.OS === "web") {
		return <DialogSheet {...props} />;
	} else if (Platform.OS === "ios" || Platform.OS === "android") {
		return (
			<>
				<BottomSheet {...props} />
				{open && (
					<TouchableOpacity
						onPress={onClose}
						style={tw.style(
							"absolute top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.5)]",
						)}
					/>
				)}
			</>
		);
	} else {
		throw new Error("Platform not supported");
	}
};

export default BottomSheetWrapper;
