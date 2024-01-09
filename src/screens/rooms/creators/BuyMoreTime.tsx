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

interface BuyMoreTimeProps {
	isVisible: boolean;
	onClose: () => void;
	userName: string;
	value: string;
	time: string;
}

const BuyMoreTime: React.FC<BuyMoreTimeProps> = ({
	isVisible,
	onClose,
	userName,
	time,
	value,
}) => {
	const { state, dispatch } = useAppContext();
	const profile = state.profile;

	const FYP_FEE = 0.2;
	const FYP_TAX = 0.2;

	const onAddMethod = () => {
		console.log("onAddMethod");
	};
	const onChange = () => {
		console.log("onChange");
	};

	const handlePurchaseOffer = () => {
		console.log("handlePurchaseOffer");
		onClose();
	};

	const handleRejectOffer = () => {
		console.log("handleRejectOffer");
		onClose();
	};

	const totalCost = parseFloat(value) + parseFloat(value) * FYP_FEE + FYP_TAX;

	const renderPaymentFooter = () => {
		return (
			<FansView>
				<FansView style={tw.style("flex")}>
					<FansText fontFamily="inter-semibold" fontSize={17}>
						Payment method
					</FansText>
					<FansGap height={15} />
					<PaymentMethodDropdown
						options={[]}
						value={"12"}
						onChange={onChange}
						handleAddMethod={onAddMethod}
					/>
					<FansGap height={15} />
					<RoundButton
						onPress={handlePurchaseOffer}
						customStyles={"mt-[10px] md:mt-[18px]"}
					>
						Purchase for ${totalCost.toFixed(2)}
					</RoundButton>
					<FansGap height={15} />
					<View style={tw.style("px-[18px] md:px-0")}>
						<TouchableOpacity
							style={tw.style(
								"w-full flex flex-row items-center justify-center py-2 ",
							)}
							onPress={handleRejectOffer}
						>
							<FansText
								textAlign="center"
								fontFamily="inter-semibold"
								fontSize={17}
								color="purple"
							>
								Reject offer
							</FansText>
						</TouchableOpacity>
					</View>
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
									{userName} has requested a time increase!
								</FansText>
								<FansGap height={12} />
								<FansView style={styles.roundedRectangle}>
									<FansText
										textAlign="center"
										fontFamily="inter-semibold"
										fontSize={16}
									>
										{time}
									</FansText>
									<FansText
										textAlign="center"
										fontFamily="inter-semibold"
										fontSize={23}
										color="purple"
									>{`+$${value}`}</FansText>
								</FansView>
								<FansGap height={22} />
								<FansText
									fontFamily="inter-semibold"
									textAlign="center"
									fontSize={16}
								>
									You will be charged ${totalCost.toFixed(2)}
								</FansText>
								<FansText
									textAlign="center"
									fontSize={16}
									color="grey-70"
								>
									${value} + $
									{(parseFloat(value) * FYP_FEE).toFixed(2)}{" "}
									Fee + {FYP_TAX.toFixed(2)} Tax
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
		height: "75%",
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

export default BuyMoreTime;
