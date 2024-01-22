import { OutlinedInfoSvg } from "@assets/svgs/common";
import {
	FypSvg,
	FypLinearGradientView,
	FypText,
	FypLink,
} from "@components/common/base";
import PaymentMethodDropdown from "@components/common/paymentMethodDropdown";
import { FansView, FansDivider } from "@components/controls";
import { AddPaymentCardDialog } from "@components/profiles";
import { getPaymentMethods } from "@helper/endpoints/subscriptions/apis";
import tw from "@lib/tailwind";
import { IPaymentMethod } from "@usertypes/types";
import { useBlankLink } from "@utils/useBlankLink";
import { BlurView } from "expo-blur";
import { createURL } from "expo-linking";
import React, { FC, useState, Fragment, useEffect } from "react";
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
	const [openLink] = useBlankLink();
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
	const [openPaymentModal, setOpenPaymentModal] = useState(false);
	const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);

	const handlePressTerms = () => {
		const url = createURL(`/terms`);
		openLink(url);
	};

	const handlePressPay = () => {
		handleSubmit(time, payment);
	};

	const getPaymentMethodsData = async () => {
		const paymentMethodsData = await getPaymentMethods();
		if (paymentMethodsData.ok) {
			setPaymentMethods(paymentMethodsData.data);
		}
	};

	useEffect(() => {
		getPaymentMethodsData();
	}, []);

	return (
		<Fragment>
			{openPaymentModal ? (
				<AddPaymentCardDialog
					visible={openPaymentModal}
					handleClose={() => setOpenPaymentModal(false)}
					handleToggleModal={setOpenPaymentModal}
				/>
			) : (
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
							)}
						>
							<BlurView
								intensity={55}
								tint="dark"
								style={tw.style(
									"rounded-t-[7px] md:rounded-[15px] md:rounded-t-[15px] flex-1",
								)}
							>
								<FansView
									height={40}
									style={tw.style("md:hidden")}
								>
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
									<ScrollView>
										<FansView padding={{ x: 18, b: 30 }}>
											<FypText
												fontSize={19}
												lineHeight={26}
												fontWeight={700}
												textAlign="center"
												margin={{ b: 34 }}
												style={tw.style(
													"text-fans-white",
												)}
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
														style={tw.style(
															"w-1/3",
														)}
													>
														<FansView
															height={77}
															borderRadius={7}
															justifyContent="center"
															style={tw.style(
																"border",
																time === el
																	? "border-fans-purple border-[2px]"
																	: "border-fans-white/20",
															)}
															pressableProps={{
																onPress: () =>
																	setTime(el),
															}}
														>
															<FypText
																fontSize={16}
																fontWeight={500}
																textAlign="center"
																lineHeight={21}
																style={tw.style(
																	"text-fans-white",
																)}
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
												style={tw.style(
													"mt-6 mb-[18px] bg-fans-white/20",
												)}
											/>
											<FansView>
												<FypText
													fontSize={17}
													lineHeight={22}
													fontWeight={600}
													margin={{ b: 14 }}
													style={tw.style(
														"text-fans-white",
													)}
												>
													Total
												</FypText>
												<FypText
													fontSize={16}
													lineHeight={21}
													margin={{ b: 5 }}
													style={tw.style(
														"text-fans-grey-b1",
													)}
												>
													$15.00 USD + $1.50 Platform
													fee
												</FypText>
												<FypText
													fontSize={21}
													fontWeight={600}
													lineHeight={28}
													margin={{ b: 18 }}
													style={tw.style(
														"text-fans-white",
													)}
												>
													$16.50
												</FypText>
												<FansView flexDirection="row">
													<FansView
														flexDirection="row"
														alignItems="center"
														borderRadius={30}
														gap={7}
														padding={{
															l: 12,
															r: 23,
															y: 6,
														}}
														style={tw.style(
															"bg-fans-purple-47",
														)}
													>
														<FypSvg
															svg={
																OutlinedInfoSvg
															}
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
															ONLY CHARGED IF
															ACCEPTED
														</FypText>
													</FansView>
												</FansView>
											</FansView>
											<FansDivider
												style={tw.style(
													"mt-[26px] mb-5 bg-fans-white/20",
												)}
											/>
											<FansView margin={{ b: 22 }}>
												<FypText
													fontSize={17}
													lineHeight={22}
													fontWeight={600}
													margin={{ b: 15 }}
													style={tw.style(
														"text-fans-white",
													)}
												>
													Payment method
												</FypText>
												<PaymentMethodDropdown
													options={paymentMethods}
													value={payment}
													onChange={setPayment}
													handleAddMethod={() =>
														setOpenPaymentModal(
															true,
														)
													}
													style={tw.style(
														"border-fans-white/20",
													)}
													textStyle={tw.style(
														"text-fans-white",
													)}
												/>
											</FansView>

											<FansView
												margin={{ b: 18 }}
												pressableProps={{
													onPress: handlePressPay,
												}}
											>
												<FypLinearGradientView
													colors={[
														"#1d21e5",
														"#d885ff",
													]}
													height={42}
													borderRadius={42}
													alignItems="center"
													justifyContent="center"
												>
													<FypText
														fontSize={19}
														lineHeight={26}
														fontWeight={700}
														style={tw.style(
															"text-fans-white",
														)}
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
													"text-fans-grey-b1",
												)}
											>
												By moving forward, you agree to
												our{" "}
												<FypLink
													fontSize={12}
													lineHeight={21}
													style={tw.style(
														"text-fans-purple",
													)}
													onPress={handlePressTerms}
												>
													Terms of Use.
												</FypLink>
											</FypText>
										</FansView>
									</ScrollView>
								</FansView>
							</BlurView>
						</FansView>
					</FansView>
				</Modal>
			)}
		</Fragment>
	);
};

export default BuyMoreTimeModal;
