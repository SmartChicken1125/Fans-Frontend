// BuyMoreTime.tsx
import { CloseSvg } from "@assets/svgs/common";
import AvatarWithStatus from "@components/common/AvatarWithStatus";
import RoundButton from "@components/common/RoundButton";
import PaymentMethodDropdown from "@components/common/paymentMethodDropdown";
import { FansView, FansGap, FansText, FansDivider } from "@components/controls";
import { useAppContext } from "@context/useAppContext";
import { Ionicons } from "@expo/vector-icons"; // Import the close icon from a relevant library
import tw from "@lib/tailwind";
import { Colors } from "@usertypes/enums";
import React from "react";
import {
	View,
	Modal,
	StyleSheet,
	TouchableOpacity,
	TextInput,
} from "react-native";
import { IconButton } from "react-native-paper";

interface CancelVideoProps {
	isVisible: boolean;
	onClose: () => void;
}

const CancelVideo: React.FC<CancelVideoProps> = ({ isVisible, onClose }) => {
	const { state } = useAppContext();
	const profile = state.profile;

	const handleContinueCancel = () => {
		console.log("handleContinueCancel");
		onClose();
	};

	const renderPaymentFooter = () => {
		return (
			<FansView>
				<FansView style={tw.style("flex")}>
					<RoundButton
						onPress={handleContinueCancel}
						customStyles={"mt-[10px] md:mt-[18px]"}
					>
						Continue
					</RoundButton>
				</FansView>
			</FansView>
		);
	};

	return (
		<Modal visible={isVisible} transparent>
			<View style={{ flex: 1 }}>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<IconButton
							icon={() => (
								<CloseSvg
									width={11}
									height={11}
									color={"white"}
								/>
							)}
							containerColor="rgba(0, 0, 0, 0.3);"
							style={tw.style(
								"w-6 h-6 lg:w-7.5 lg:h-7.5 ml-auto my-0 mr-0",
							)}
							onPress={onClose}
						/>
						<FansView
							style={tw.style("flex justify-center items-center")}
						>
							<FansGap height={26} />
							<AvatarWithStatus
								size={95}
								avatar={profile.avatar}
							/>
							<FansGap height={26} />
							<FansView
								style={tw.style(
									"flex justify-center items-center",
								)}
							>
								<FansText
									textAlign="center"
									fontFamily="inter-semibold"
									fontSize={23}
								>
									Your video call has been canceled
								</FansText>
								<FansGap height={12} />

								<FansGap height={22} />
								<FansText
									fontFamily="inter-semibold"
									textAlign="center"
									fontSize={16}
								>
									We will be issuing a full refund. Please
									allow 7 business days for the refund to
									process. If you require further assistance,
									please contact Support{" "}
								</FansText>

								<FansGap height={27.5} />
							</FansView>
						</FansView>
						<FansGap height={26} />
						<FansView>{renderPaymentFooter()}</FansView>
					</View>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		height: "55%",
		width: "95%",
		backgroundColor: "white",
		padding: 20,
		borderRadius: 20,
		borderColor: "#A854F5",
		borderWidth: 3,
		borderStyle: "solid",
	},
	closeButton: {
		position: "absolute",
		top: 10,
		right: 10,
	},
	roundedRectangle: {
		width: 115,
		height: 77,
		// margin: "21px 121.5px 0 120.5px",
		// padding: "16px 32px 15px 33px",
		borderRadius: 7,
		borderWidth: 2.3,
		borderColor: "#A854F5",
		justifyContent: "center",
		alignItems: "center",
	},
});

export default CancelVideo;
