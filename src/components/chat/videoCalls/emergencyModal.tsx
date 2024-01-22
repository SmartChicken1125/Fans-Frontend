import { CallSvg } from "@assets/svgs/common";
import { RoundTextInput2 } from "@components/common/RoundTextInput";
import { FypSvg, FypText, FypLink } from "@components/common/base";
import { FansView, FansDivider } from "@components/controls";
import tw from "@lib/tailwind";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React, { FC, useState } from "react";
import { Modal } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";

interface Props {
	open: boolean;
	handleClose: () => void;
	handleSubmit: (text: string) => void;
}

const EmergencyModal: FC<Props> = (props) => {
	const { open, handleClose, handleSubmit } = props;
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

	const [description, setDescription] = useState("");

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
						<FansView
							flex="1"
							style={tw.style("md:pt-5 px-[18px] pb-5")}
						>
							<FypText
								fontSize={19}
								lineHeight={26}
								fontWeight={700}
								textAlign="center"
								margin={{ b: 32 }}
								style={tw.style("text-fans-white")}
							>
								SOS emergency
							</FypText>
							<FypText
								fontSize={16}
								lineHeight={21}
								textAlign="center"
								margin={{ b: 22 }}
								style={tw.style("text-fans-white")}
							>
								If you are in immediate danger, please{" "}
								<FypLink
									fontSize={16}
									lineHeight={21}
									fontWeight={600}
									style={tw.style("text-fans-red")}
								>
									dial 911
								</FypLink>{" "}
								or your local emergency number.
							</FypText>
							<FansView
								height={42}
								borderRadius={42}
								flexDirection="row"
								alignItems="center"
								justifyContent="center"
								style={tw.style("bg-fans-red")}
								gap={8}
							>
								<FypSvg
									svg={CallSvg}
									width={13}
									height={14}
									color="fans-white"
								/>
								<FypText
									fontSize={19}
									lineHeight={26}
									fontWeight={700}
									style={tw.style("text-fans-white")}
								>
									Call 911
								</FypText>
							</FansView>
							<FansDivider
								style={tw.style("mt-7 mb-6 bg-fans-white/20")}
							/>
							<FypText
								fontSize={16}
								lineHeight={21}
								textAlign="center"
								margin={{ b: 24 }}
								style={tw.style("text-fans-white")}
							>
								If you are not in immediate danger but require
								prompt assistance, please complete the form
								below
							</FypText>
							<RoundTextInput2
								value={description}
								onChangeText={setDescription}
								placeholder="Describe the situation"
								multiline
								numberOfLines={4}
								maxLength={1000}
								customStyles="py-3 px-5 rounded-[7px] h-[128px] bg-fans-white/20 text-fans-white"
							/>
							<FansView
								height={42}
								borderRadius={42}
								alignItems="center"
								justifyContent="center"
								margin={{ t: 22 }}
								style={tw.style("bg-fans-purple")}
								pressableProps={{
									onPress: () => handleSubmit(description),
								}}
							>
								<FypText
									fontSize={19}
									lineHeight={26}
									fontWeight={700}
									style={tw.style("text-fans-white")}
								>
									Submit
								</FypText>
							</FansView>
						</FansView>
					</BlurView>
				</FansView>
			</FansView>
		</Modal>
	);
};

export default EmergencyModal;
