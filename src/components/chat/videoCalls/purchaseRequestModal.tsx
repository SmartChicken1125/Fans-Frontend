import { CloseSvg, Clock2Svg, GiveawaySvg } from "@assets/svgs/common";
import UserAvatar from "@components/avatar/UserAvatar";
import {
	FypSvg,
	FypLinearGradientView,
	FypText,
} from "@components/common/base";
import PaymentMethodDropdown from "@components/common/paymentMethodDropdown";
import { FansView, FansDivider, FansIconButton } from "@components/controls";
import tw from "@lib/tailwind";
import React, { FC, useState, useEffect } from "react";
import { Modal, ScrollView } from "react-native";

interface Props {
	open: boolean;
	handleClose: () => void;
	handleSubmit: () => void;
	data: {
		open: boolean;
		amount: number;
		paymentProfileId: string;
		type: "time" | "tributeFee";
	};
}

const PurchaseRequestModal: FC<Props> = (props) => {
	const { open, handleClose, handleSubmit, data } = props;
	const [payment, setPayment] = useState("");
	const [amount, setAmount] = useState(0);

	useEffect(() => {
		setAmount(data.amount);
	}, [open, data.amount]);

	return (
		<Modal transparent visible={open}>
			<FansView
				width="full"
				height="full"
				position="relative"
				alignItems="center"
				justifyContent="center"
				style={tw.style("bg-fans-black/30")}
				touchableOpacityProps={{
					activeOpacity: 1,
					onPress: handleClose,
				}}
			>
				<FansView
					touchableOpacityProps={{ activeOpacity: 1 }}
					style={tw.style(
						"w-full md:w-[450px]",
						"h-auto max-h-9/10",
						"rounded-[15px] px-[14px] md:px-0",
					)}
				>
					<FypLinearGradientView
						colors={["#d885ff", "#1d21e5"]}
						start={[0, 0]}
						end={[0, 1]}
						padding={5}
						borderRadius={15}
						style={tw.style("w-full")}
						position="relative"
					>
						<FansView
							borderRadius={15}
							style={tw.style("bg-fans-black-1d")}
						>
							<ScrollView>
								<FansView
									position="relative"
									padding={{ x: 16, t: 26, b: 14 }}
								>
									<FansIconButton
										size={25}
										backgroundColor="bg-fans-white/20"
										onPress={handleClose}
										style={tw.style(
											"absolute top-[14px] right-3",
										)}
									>
										<FypSvg
											svg={CloseSvg}
											width={11}
											height={11}
											color="fans-white"
										/>
									</FansIconButton>
									<FansView
										width={95}
										height={95}
										position="relative"
										margin={{ b: 23 }}
										style={tw.style("mx-auto")}
									>
										<UserAvatar size="95px" />
										<FypLinearGradientView
											colors={["#d885ff", "#1d21e5"]}
											start={[1, 0]}
											end={[0, 1]}
											width={42}
											height={42}
											borderRadius={42}
											alignItems="center"
											justifyContent="center"
											position="absolute"
											style={tw.style(
												"border-[4px] border-fans-grey-53",
												"right-[-4px] bottom-[-10.5px]",
											)}
										>
											{data.type === "time" ? (
												<FypSvg
													svg={Clock2Svg}
													width={19}
													height={19}
													color="fans-white"
												/>
											) : (
												<FypSvg
													svg={GiveawaySvg}
													width={18}
													height={18}
													color="fans-white"
												/>
											)}
										</FypLinearGradientView>
									</FansView>
									<FypText
										fontSize={23}
										lineHeight={31}
										fontWeight={700}
										textAlign="center"
										margin={{ b: 18 }}
										style={tw.style("text-fans-white")}
									>
										{data.type === "time"
											? "Jane has requested a time increase!"
											: "Jane has sent a tribute fee!"}
									</FypText>
									{data.type === "time" ? (
										<FansView
											width={115}
											height={77}
											borderRadius={7}
											justifyContent="center"
											margin={{ b: 22 }}
											style={tw.style(
												"border-[2px] border-fans-purple mx-auto",
											)}
										>
											<FypText
												fontSize={16}
												fontWeight={500}
												lineHeight={21}
												textAlign="center"
												style={tw.style(
													"text-fans-white",
												)}
											>
												{`${amount} min`}
											</FypText>
											<FypText
												fontSize={19}
												lineHeight={26}
												fontWeight={600}
												textAlign="center"
												style={tw.style(
													"text-fans-purple",
												)}
											>
												{`+$ ${amount}`}
											</FypText>
										</FansView>
									) : (
										<FypText
											fontSize={42}
											lineHeight={56}
											textAlign="center"
											fontWeight={400}
											style={tw.style("text-fans-purple")}
										>{`$${amount}`}</FypText>
									)}

									<FansView>
										<FypText
											fontSize={16}
											fontWeight={500}
											textAlign="center"
											lineHeight={21}
											style={tw.style("text-fans-white")}
										>
											you will be charged $10.82
										</FypText>
										<FypText
											fontSize={15}
											lineHeight={21}
											textAlign="center"
											style={tw.style(
												"text-fans-grey-b1",
											)}
										>
											$10 + $0.20 Fee + $0.60 Tax
										</FypText>
									</FansView>
									<FansDivider
										style={tw.style(
											"my-7 border-fans-white/20",
										)}
									/>
									<FansView margin={{ b: 22 }}>
										<FypText
											fontSize={17}
											lineHeight={22}
											fontWeight={600}
											margin={{ b: 15 }}
											style={tw.style("text-fans-white")}
										>
											Payment method
										</FypText>
										<PaymentMethodDropdown
											options={[]}
											value={payment}
											onChange={setPayment}
											handleAddMethod={() => {}}
											style={tw.style(
												"border-fans-white/20",
											)}
											textStyle={tw.style(
												"text-fans-white",
											)}
										/>
									</FansView>
									<FansView
										margin={{ b: 14 }}
										pressableProps={{
											onPress: handleSubmit,
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
												style={tw.style(
													"text-fans-white",
												)}
											>
												{`Purchase for $${amount}`}
											</FypText>
										</FypLinearGradientView>
									</FansView>
									<FypText
										fontSize={17}
										fontWeight={600}
										lineHeight={22}
										textAlign="center"
										onPress={handleClose}
										style={tw.style("text-fans-white")}
									>
										Reject offer
									</FypText>
								</FansView>
							</ScrollView>
						</FansView>
					</FypLinearGradientView>
				</FansView>
			</FansView>
		</Modal>
	);
};

export default PurchaseRequestModal;
