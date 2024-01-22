import { FypText } from "@components/common/base";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { IProfile } from "@usertypes/types";
import React, { FC } from "react";
import { Modal } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";
import ChatSection from "./chatSection";

interface Props {
	open: boolean;
	handleClose: () => void;
	profile: IProfile;
}

const MobileChatModal: FC<Props> = (props) => {
	const { open, handleClose, profile } = props;

	const positionY = useSharedValue(0);

	const panGesture = Gesture.Pan()
		.onBegin((e) => {
			positionY.value = e.translationY;
		})
		.onEnd((e) => {
			if (positionY.value < e.translationY) {
				handleClose();
			}
		});

	return (
		<Modal
			transparent
			visible={open}
			style={tw.style("bg-fans-transparent")}
		>
			<FansView
				width="full"
				height="full"
				position="relative"
				style={tw.style("bg-fans-black/30")}
				touchableOpacityProps={{
					activeOpacity: 1,
					onPress: handleClose,
				}}
			>
				<FansView
					position="absolute"
					width="full"
					left={0}
					bottom={0}
					touchableOpacityProps={{ activeOpacity: 1 }}
					style={tw.style("h-9/10 bg-fans-black/50 rounded-t-[7px]")}
				>
					<FansView height={40}>
						<GestureDetector gesture={panGesture}>
							<FansView padding={{ t: 16, b: 20 }}>
								<FansView
									width={38}
									height={4}
									borderRadius={4}
									style={tw.style("bg-fans-white/20 mx-auto")}
								></FansView>
							</FansView>
						</GestureDetector>
					</FansView>
					<FansView flex="1">
						<FypText
							fontSize={19}
							lineHeight={26}
							fontWeight={700}
							textAlign="center"
							style={tw.style("text-fans-white")}
						>
							Chat
						</FypText>
						<FansView flex="1" padding={{ x: 18, b: 40 }}>
							<ChatSection profile={profile} />
						</FansView>
					</FansView>
				</FansView>
			</FansView>
		</Modal>
	);
};

export default MobileChatModal;
