import { CloseSvg, EditSvg, VisaSvg } from "@assets/svgs/common";
import RoundButton from "@components/common/RoundButton";
import { FypText, FypSvg } from "@components/common/base";
import PaymentMethodDropdown from "@components/common/paymentMethodDropdown";
import {
	FansDivider,
	FansGap,
	FansIconButton,
	FansView,
} from "@components/controls";
import { ANIMATION_LOADING_DIALOG_ID } from "@constants/modal";
import { ModalActionType, useAppContext } from "@context/useAppContext";
import {
	getPaymentMethod,
	getPaymentMethods,
	unsubscribe,
	updatePaymentMethod,
} from "@helper/endpoints/subscriptions/apis";
import tw from "@lib/tailwind";
import { RoundButtonType } from "@usertypes/commonEnums";
import { IPaymentMethod, Subscription } from "@usertypes/types";
import { useRouter } from "expo-router";
import React, { FC, useEffect, useState } from "react";
import { View } from "react-native";
import { Modal, Portal } from "react-native-paper";
import Toast from "react-native-toast-message";
import AvatarWithStatus from "../AvatarWithStatus";

interface Props {
	visible: boolean;
	handleClose: () => void;
	subscription: Subscription;
	onDeleteSubscription: (subscription: Subscription) => void;
}

const PaymentMethodModal: FC<Props> = (props) => {
	const { visible, handleClose, subscription, onDeleteSubscription } = props;

	const { dispatch } = useAppContext();

	const router = useRouter();

	const [editMode, setEditMode] = useState(false);
	const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);
	const [payment, setPayment] = useState<IPaymentMethod>();
	const [selectedPaymentMethod, setSelectedPaymentMethod] =
		useState<IPaymentMethod>();

	useEffect(() => {
		const fetchData = async () => {
			if (!visible) return;

			const [paymentMethodData, paymentMethodsData] = await Promise.all([
				getPaymentMethod({ id: subscription.id }),
				getPaymentMethods(),
			]);

			if (paymentMethodData.ok) {
				setSelectedPaymentMethod(paymentMethodData.data);
			}

			if (paymentMethodsData.ok) {
				setPaymentMethods(paymentMethodsData.data);
			}
		};

		fetchData();
	}, [visible]);

	const handleAddMethod = () => {
		handleClose();
		router.push({
			pathname: "profile",
			params: {
				screen: "AddCard",
				returnPopup: "UpdatePaymentMethodSubscriptions",
				subscriptionId: subscription.id,
			},
		});
	};

	const onUpdatePaymentMethod = async () => {
		if (!payment) return;

		const updatePaymentMethodData = await updatePaymentMethod({
			id: subscription.id,
			customerPaymentProfileId: payment.customerPaymentProfileId,
		});
		if (updatePaymentMethodData.ok) {
			Toast.show({
				type: "success",
				text1: "Success",
				text2: "Payment method updated",
			});
			setSelectedPaymentMethod(payment);
			handleClose();
		} else {
			Toast.show({
				type: "error",
				text1: updatePaymentMethodData.data.message,
			});
		}
	};

	const showLoading = () => {
		dispatch.setModal({
			type: ModalActionType.showModal,
			data: { id: ANIMATION_LOADING_DIALOG_ID, show: true },
		});
	};

	const hideLoading = () => {
		dispatch.setModal({
			type: ModalActionType.showModal,
			data: { id: ANIMATION_LOADING_DIALOG_ID, show: false },
		});
	};

	useEffect(() => {
		setEditMode(false);
	}, [visible]);

	return (
		<Portal>
			<Modal
				visible={visible}
				onDismiss={handleClose}
				contentContainerStyle={tw.style(
					"bg-fans-white dark:bg-fans-black-1d rounded-[15px] mx-[18px] md:max-w-150 md:mx-auto md:w-full",
				)}
			>
				<FansGap height={29} />
				<View style={tw.style("flex-row justify-center")}>
					<AvatarWithStatus avatar="" size={79} />
				</View>
				<FansGap height={19} />
				<FansDivider ver1 />
				<FansGap height={18} />
				<FypText fontSize={19} fontWeight={700} textAlign="center">
					Payment method
				</FypText>
				{editMode ? (
					<View
						style={tw.style(
							"relative pt-6 px-[18px] pb-5 rounded-[15px]",
						)}
					>
						<FansIconButton
							size={25}
							backgroundColor="bg-fans-black/30 dark:bg-fans-white/30"
							style={tw.style("absolute top-[14px] right-[14px]")}
							onPress={() => setEditMode(false)}
						>
							<FypSvg
								svg={CloseSvg}
								width={10}
								height={10}
								color="fans-white dark:fans-black-1d"
							/>
						</FansIconButton>

						<FypText
							fontSize={17}
							lineHeight={22}
							margin={{ b: 15 }}
						>
							Change payment method
						</FypText>
						<FansView margin={{ b: 20 }}>
							<PaymentMethodDropdown
								options={paymentMethods}
								handleAddMethod={handleAddMethod}
								value={payment?.customerPaymentProfileId ?? ""}
								onChange={(_, method) => setPayment(method)}
							/>
						</FansView>
						<RoundButton onPress={onUpdatePaymentMethod}>
							Update Method
						</RoundButton>
					</View>
				) : (
					<View>
						<View style={tw.style("mx-[18px] pt-6")}>
							<View
								style={tw.style("flex-row items-center mb-8")}
							>
								<VisaSvg size={46} />
								<View style={tw.style("ml-3")}>
									<FypText
										fontSize={19}
										lineHeight={26}
										fontWeight={600}
									>
										VISA ending{" "}
										{selectedPaymentMethod?.cardNumber ||
											"Loading..."}
									</FypText>
									<FypText
										fontSize={16}
										lineHeight={21}
										margin={{ t: -3 }}
										style={tw.style(
											"text-fans-dark-grey dark:text-fans-grey-b1",
										)}
									>
										Expires{" "}
										{selectedPaymentMethod?.expirationDate ||
											"Loading..."}
									</FypText>
								</View>
								<FansIconButton
									size={34}
									backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
									style={tw.style("ml-auto")}
									onPress={() => setEditMode(true)}
								>
									<FypSvg
										svg={EditSvg}
										width={16}
										height={17}
										color="fans-black dark:fans-white"
									/>
								</FansIconButton>
							</View>
							<View style={tw.style("pb-5")}>
								<RoundButton
									variant={RoundButtonType.OUTLINE_RED}
									onPress={() =>
										onDeleteSubscription(subscription)
									}
								>
									Cancel subscription
								</RoundButton>
							</View>
						</View>
					</View>
				)}
			</Modal>
		</Portal>
	);
};

export default PaymentMethodModal;
