import React, { FC } from "react";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

interface Props {
	children: React.ReactNode;
	gestureCallback: (isHover: boolean) => void;
}

const HoverGesture: FC<Props> = (props) => {
	const { children, gestureCallback } = props;
	const hover = Gesture.Hover()
		.onBegin(() => {
			gestureCallback(true);
		})
		.onEnd(() => {
			gestureCallback(false);
		});
	return <GestureDetector gesture={hover}>{children}</GestureDetector>;
};

export default HoverGesture;
