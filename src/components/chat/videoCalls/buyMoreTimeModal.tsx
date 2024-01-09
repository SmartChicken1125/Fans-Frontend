import { OutlinedInfoSvg } from "@assets/svgs/common";
import {
	FypSvg,
	FypLinearGradientView,
	FypText,
	FypLink,
} from "@components/common/base";
import PaymentMethodDropdown from "@components/common/paymentMethodDropdown";
import { FansView, FansDivider } from "@components/controls";
import tw from "@lib/tailwind";
import { useRouter } from "expo-router";
import React, { FC, useState } from "react";
import { Modal, ScrollView } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";

interface Props {
	open: boolean;
	handleClose: () => void;
	handleSubmit: (time: number, paymentProfileId: string) => void;
}

const BuyMoreTimeModal: FC<Props> = (props) => {
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

	const [time, setTime] = useState(0);
	const [payment, setPayment] = useState("");

	const handlePressTerms = () => {
		router.push("/terms");
	};

	const handlePressPay = () => {
		handleSubmit(time, payment);
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
					style={tw.style(
						"w-full md:w-[450px]",
						"h-9/10 md:h-auto md:max-h-9/10",
						"rounded-t-[7px] md:rounded-[15px] md:rounded-t-[15px]",
						"bg-fans-white dark:bg-fans-black-1d",
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
										"bg-fans-grey-70/40 dark:bg-fans-grey-b1/40 mx-auto",
									)}
								></FansView>
							</FansView>
						</GestureDetector>
					</FansView>
					<FansView flex="1" style={tw.style("md:pt-5")}>
						<ScrollView>
							<FansView padding={{ x: 18, b: 30 }}>
								<FypText
									fontSize={19}
									lineHeight={26}
									fontWeight={700}
									textAlign="center"
									margin={{ b: 34 }}
								>
									Buy more time
								</FypText>
								<FansView
									flexDirection="row"
									alignItems="center"
									flexWrap="wrap"
									margin={{ x: -6 }}
									width="full"
								>
									{[15, 30, 45, 60].map((el) => (
										<FansView
											key={el}
											padding={3}
											style={tw.style("w-1/3")}
										>
											<FansView
												height={77}
												borderRadius={7}
												justifyContent="center"
												style={tw.style(
													"border",
													time === el
														? "border-fans-purple border-[2px]"
														: "border-fans-grey-f0 dark:border-fans-grey-43",
												)}
												pressableProps={{
													onPress: () => setTime(el),
												}}
											>
												<FypText
													fontSize={16}
													fontWeight={500}
													textAlign="center"
													lineHeight={21}
												>
													{`${el} min`}
												</FypText>
												<FypText
													fontSize={19}
													fontWeight={600}
													textAlign="center"
													lineHeight={26}
													style={tw.style(
														"text-fans-purple",
													)}
												>
													{`$${el}`}
												</FypText>
											</FansView>
										</FansView>
									))}
								</FansView>
								<FansDivider
									style={tw.style("mt-6 mb-[18px]")}
								/>
								<FansView>
									<FypText
										fontSize={17}
										lineHeight={22}
										fontWeight={600}
										margin={{ b: 14 }}
									>
										Total
									</FypText>
									<FypText
										fontSize={16}
										lineHeight={21}
										margin={{ b: 5 }}
										style={tw.style(
											"text-fans-grey-70 dark:text-fans-grey-b1",
										)}
									>
										$15.00 USD + $1.50 Platform fee
									</FypText>
									<FypText
										fontSize={21}
										fontWeight={600}
										lineHeight={28}
										margin={{ b: 18 }}
									>
										$16.50
									</FypText>
									<FansView flexDirection="row">
										<FansView
											flexDirection="row"
											alignItems="center"
											borderRadius={30}
											gap={7}
											padding={{ l: 12, r: 23, y: 6 }}
											style={tw.style(
												"bg-fans-purple-f6 dark:bg-fans-purple-47",
											)}
										>
											<FypSvg
												svg={OutlinedInfoSvg}
												width={13}
												height={13}
												color="fans-purple"
											/>
											<FypText
												fontSize={13}
												lineHeight={17}
												fontWeight={700}
												style={tw.style(
													"text-fans-purple",
												)}
											>
												ONLY CHARGED IF ACCEPTED
											</FypText>
										</FansView>
									</FansView>
								</FansView>
								<FansDivider
									style={tw.style("mt-[26px] mb-5")}
								/>
								<FansView margin={{ b: 22 }}>
									<FypText
										fontSize={17}
										lineHeight={22}
										fontWeight={600}
										margin={{ b: 15 }}
									>
										Payment method
									</FypText>
									<PaymentMethodDropdown
										options={[]}
										value={payment}
										onChange={setPayment}
										handleAddMethod={() => {}}
									/>
								</FansView>

								<FansView
									margin={{ b: 18 }}
									pressableProps={{
										onPress: handlePressPay,
									}}
								>
									<FypLinearGradientView
										colors={["#1d21e5", "#d885ff"]}
										height={42}
										borderRadius={42}
										alignItems="center"
										justifyContent="center"
									>
										<FypText
											fontSize={19}
											lineHeight={26}
											fontWeight={700}
											style={tw.style("text-fans-white")}
										>
											Pay $16.50
										</FypText>
									</FypLinearGradientView>
								</FansView>
								<FypText
									fontSize={12}
									lineHeight={21}
									textAlign="center"
									style={tw.style(
										"text-fans-grey-70 dark:text-fans-grey-b1",
									)}
								>
									By moving forward, you agree to our{" "}
									<FypLink
										fontSize={12}
										lineHeight={21}
										style={tw.style("text-fans-purple")}
										onPress={handlePressTerms}
									>
										Terms of Use.
									</FypLink>
								</FypText>
							</FansView>
						</ScrollView>
					</FansView>
				</FansView>
			</FansView>
		</Modal>
	);
};

export default BuyMoreTimeModal;
