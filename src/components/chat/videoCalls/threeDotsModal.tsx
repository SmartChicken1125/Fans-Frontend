import {
	BlockSvg,
	EmergencySvg,
	ReportSvg,
	UserSvg,
} from "@assets/svgs/common";
import { FypSvg } from "@components/common/base";
import { FansView } from "@components/controls";
import { MenuItem } from "@components/posts/common";
import tw from "@lib/tailwind";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React, { FC } from "react";
import { Modal } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";

interface Props {
	open: boolean;
	handleClose: () => void;
	handlePressEmergency: () => void;
	handlePressReport: () => void;
}

const ThreeDotsModal: FC<Props> = (props) => {
	const { open, handleClose, handlePressEmergency, handlePressReport } =
		props;
	const router = useRouter();
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

	const handleViewProfile = () => {
		router.replace("/profile");
	};

	const handleBlock = () => {
		handleClose();
	};

	return (
		<Modal transparent visible={open}>
			<FansView
				width="full"
				height="full"
				position="relative"
				alignItems="center"
				style={tw.style(
					"bg-fans-black/30 justify-end md:justify-center",
				)}
				touchableOpacityProps={{
					activeOpacity: 1,
					onPress: handleClose,
				}}
			>
				<FansView
					touchableOpacityProps={{ activeOpacity: 1 }}
					style={tw.style("w-full md:w-[450px]", "h-auto max-h-9/10")}
				>
					<BlurView
						intensity={55}
						tint="dark"
						style={tw.style(
							"rounded-t-[7px] md:rounded-[15px] md:rounded-t-[15px] flex-1",
						)}
					>
						<FansView height={40} style={tw.style("md:hidden")}>
							<GestureDetector gesture={panGesture}>
								<FansView padding={{ t: 16, b: 20 }}>
									<FansView
										width={38}
										height={4}
										borderRadius={4}
										style={tw.style(
											"bg-fans-white/20 mx-auto",
										)}
									></FansView>
								</FansView>
							</GestureDetector>
						</FansView>
						<FansView flex="1" style={tw.style("md:pt-5")}>
							<MenuItem
								title="View profile"
								labelClass="text-fans-white"
								icon={
									<FypSvg
										svg={UserSvg}
										width={23}
										height={23}
										color="fans-white"
									/>
								}
								onPress={handleViewProfile}
							/>
							<MenuItem
								title="Block"
								icon={
									<FypSvg
										svg={BlockSvg}
										width={25}
										height={25}
										color="fans-red"
									/>
								}
								onPress={handleBlock}
								labelClass="text-fans-red"
							/>
							<MenuItem
								title="Report"
								icon={
									<FypSvg
										svg={ReportSvg}
										width={25}
										height={23}
										color="fans-red"
									/>
								}
								onPress={handlePressReport}
								labelClass="text-fans-red"
							/>
							<MenuItem
								title="SOS emergency"
								icon={
									<FypSvg
										svg={EmergencySvg}
										width={25}
										height={25}
										color="fans-red"
									/>
								}
								onPress={handlePressEmergency}
								labelClass="text-fans-red"
							/>
						</FansView>
					</BlurView>
				</FansView>
			</FansView>
		</Modal>
	);
};

export default ThreeDotsModal;
