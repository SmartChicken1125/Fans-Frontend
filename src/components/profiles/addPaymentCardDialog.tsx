import {
	CloseSvg,
	ChevronLeftSvg,
	PhotoCameraSvg,
	CvcSvg,
} from "@assets/svgs/common";
import RoundButton from "@components/common/RoundButton";
import RoundTextInput from "@components/common/RoundTextInput";
import TextButton from "@components/common/TextButton";
import {
	FypModal,
	FypNullableView,
	FypText,
	FypDropdown,
	FypCountryDropdown,
	FypSvg,
	FypCheckbox,
} from "@components/common/base";
import CustomMaskInput from "@components/common/customMaskInput";
import NotificationBox from "@components/common/notificationBox";
import { FansText, FansIconButton, FansView } from "@components/controls";
import { defaultPaymentCardData } from "@constants/defaultFormData";
import { useAppContext } from "@context/useAppContext";
import {
	AUTHORIZE_NET_API_LOGIN_ID,
	AUTHORIZE_NET_CLIENT_KEY,
	AUTHORIZE_NET_ENVIRONMENT,
} from "@env";
import { addPaymentMethod } from "@helper/endpoints/subscriptions/apis";
import states from "@helper/geo/state.json";
import tw from "@lib/tailwind";
import { IPaymentCard } from "@usertypes/types";
import React, { FC, useMemo, useState, useEffect } from "react";
import { useAcceptJs } from "react-acceptjs";
import ToastMessage from "react-native-toast-message";

interface Props {
	visible: boolean;
	handleClose: () => void;
	handleToggleModal: (val: boolean) => void;
}

const AddPaymentCardDialog: FC<Props> = (props) => {
	const { visible, handleClose, handleToggleModal } = props;
	const { dispatch } = useAppContext();

	const [isConfirm, setConfirm] = useState(false);
	const [country, setCountry] = useState("");
	const [state, setState] = useState("");

	const [formData, setFormData] = useState<IPaymentCard>(
		defaultPaymentCardData,
	);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [showError, setShowError] = useState(false);
	const [errorText, setErrorText] = useState("");

	const stateOptions = useMemo(
		() =>
			states
				.filter((s) => s.countryCode === country)
				.sort((a, b) => a.name.localeCompare(b.name))
				.map((el) => ({
					data: el.name,
					label: el.name,
				})),
		[country],
	);

	const handleBack = () => {
		handleClose();
	};

	const onChangeForm = (name: string, value: string) => {
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const { dispatchData } = useAcceptJs({
		environment: AUTHORIZE_NET_ENVIRONMENT,
		authData: {
			apiLoginID: AUTHORIZE_NET_API_LOGIN_ID,
			clientKey: AUTHORIZE_NET_CLIENT_KEY,
		},
	});

	const handleAuthorizeNet = async () => {
		type AuthorizeNetError = {
			messages: {
				message: [{ text: string }];
			};
		};

		const { cardNumber, cardName, expireDate, cvc } = formData;

		const firstName = cardName.split(" ")[0];
		const lastName = cardName.split(" ")[1];

		if (!firstName || !lastName) {
			ToastMessage.show({
				type: "error",
				text1: "Please enter your full name",
			});
			return;
		}

		setIsSubmitted(true);
		// dispatch.setModal({
		// 	type: ModalActionType.showModal,
		// 	data: { id: ADD_PAYMENT_CARD_DIALOG_ID, show: false },
		// });
		handleToggleModal(false);
		dispatch.setShowLoading();
		try {
			const response = await dispatchData({
				cardData: {
					cardNumber: cardNumber.replace(/\s/g, ""),
					fullName: cardName,
					cardCode: cvc,
					month: expireDate.replace(/\s/g, "").split("/")[0],
					year: expireDate.replace(/\s/g, "").split("/")[1],
				},
			});

			if (response.messages.resultCode === "Error") {
				dispatch.setHideLoading();
				handleOpen();
				// ToastMessage.show({
				// 	type: "error",
				// 	text1: response.messages.message[0].text,
				// });
				setErrorText(response.messages.message[0].text);
				setShowError(true);
			} else {
				const paymentMethod = await addPaymentMethod({
					opaqueDataValue: response.opaqueData.dataValue,
					customerInformation: {
						firstName: firstName,
						lastName: lastName,
						country,
						state,
						address: formData.street,
						city: formData.city,
						zip: formData.zip,
					},
				});
				dispatch.setHideLoading();
				handleOpen();
				if (paymentMethod.ok) {
					ToastMessage.show({
						type: "success",
						text1: "Payment method added successfully",
					});
					handleBack();
				} else {
					// ToastMessage.show({
					// 	type: "error",
					// 	text1: paymentMethod.data.message,
					// });
					setErrorText(paymentMethod.data.message);
					setShowError(true);
				}
			}
		} catch (error) {
			const typedError = error as AuthorizeNetError;
			dispatch.setHideLoading();
			handleOpen();
			// ToastMessage.show({
			// 	type: "error",
			// 	text1:
			// 		typedError.messages.message[0].text || "An error occurred",
			// });
			setErrorText(
				typedError.messages.message[0].text || "An error occurred",
			);
			setShowError(true);
		}
	};

	const handleOpen = () => {
		// dispatch.setModal({
		// 	type: ModalActionType.showModal,
		// 	data: { id: ADD_PAYMENT_CARD_DIALOG_ID, show: true },
		// });
		handleToggleModal(true);
	};

	const newPaymentMethod = async () => {
		setShowError(false);
		setErrorText("");
		if (!isConfirm) {
			setErrorText("Need to confirm you're at least 18 years old");
			setShowError(true);
			return;
		}
		if (
			country === "" ||
			state === "" ||
			(Object.keys(formData) as (keyof typeof formData)[]).find(
				(key) =>
					formData[key] === "" && !["country", "state"].includes(key),
			)
		) {
			setErrorText("Please enter required fields.");
			setShowError(true);
			return;
		}
		await handleAuthorizeNet();
	};

	useEffect(() => {
		setCountry("");
		setState("");
		setConfirm(false);
		setShowError(false);
		setErrorText("");
		setIsSubmitted(false);
		setFormData(defaultPaymentCardData);
	}, [visible]);

	return (
		<FypModal
			visible={visible}
			onDismiss={() => {}}
			width={{ xs: "full", lg: 600 }}
		>
			<FansView position="relative" padding={{ x: 18, t: 13, b: 14 }}>
				<FansView
					flexDirection="row"
					alignItems="center"
					justifyContent="between"
					margin={{ b: 32 }}
				>
					<FansIconButton
						size={13}
						backgroundColor="bg-fans-white dark:bg-fans-black-1d"
						onPress={handleClose}
					>
						<FypSvg
							svg={ChevronLeftSvg}
							width={13}
							height={13}
							color="fans-grey-70 dark:fans-grey-b1"
						/>
					</FansIconButton>
					<FansText
						fontSize={19}
						lineHeight={26}
						style={tw.style("font-bold")}
					>
						Add card
					</FansText>
					<FansIconButton
						size={25}
						backgroundColor="bg-fans-black/30 dark:bg-fans-white/30"
						onPress={handleClose}
					>
						<CloseSvg size={10} color="#fff" />
					</FansIconButton>
				</FansView>
				<FansView margin={{ b: 32 }}>
					<FansText
						fontSize={17}
						lineHeight={22}
						style={tw.style("font-semibold mb-[15px]")}
					>
						Address
					</FansText>
					<FansView position="relative" margin={{ b: 10 }}>
						<FypCountryDropdown
							data={[]}
							value={country}
							onSelect={(val) => setCountry(val as string)}
						/>
					</FansView>
					{(!country || stateOptions.length > 0) && (
						<FansView margin={{ b: 10 }}>
							<FypDropdown
								data={stateOptions}
								value={state}
								onSelect={(val) => setState(val as string)}
								placeholder="Select State"
								search
							/>
						</FansView>
					)}
					<RoundTextInput
						placeholder="Street"
						customStyles="mb-[10px]"
						value={formData.street}
						onChangeText={(val) => onChangeForm("street", val)}
						hasError={isSubmitted && formData.street === ""}
						maxLength={100}
					/>
					<RoundTextInput
						placeholder="City"
						customStyles="mb-[10px]"
						value={formData.city}
						onChangeText={(val) => onChangeForm("city", val)}
						hasError={isSubmitted && formData.city === ""}
						maxLength={100}
					/>
					<RoundTextInput
						placeholder="Zip"
						value={formData.zip}
						onChangeText={(val) => onChangeForm("zip", val)}
						hasError={isSubmitted && formData.zip === ""}
						maxLength={100}
					/>
				</FansView>

				<FansView margin={{ b: 32 }}>
					<FansText
						fontSize={17}
						lineHeight={22}
						style={tw.style("font-semibold mb-[15px]")}
					>
						Card details
					</FansText>

					<RoundTextInput
						placeholder="Name on the card"
						customStyles="mb-[10px]"
						value={formData.cardName}
						onChangeText={(val) => onChangeForm("cardName", val)}
						hasError={isSubmitted && formData.cardName === ""}
						maxLength={100}
					/>
					<FansView margin={{ b: 10 }} position="relative">
						<CustomMaskInput
							placeholder="1234 1234 1234 1234"
							customStyles="pr-11"
							value={formData.cardNumber}
							onChangeText={(val) =>
								onChangeForm("cardNumber", val)
							}
							hasError={isSubmitted && formData.cardNumber === ""}
							type="creditCard"
						/>
						<PhotoCameraSvg
							width={16}
							height={14.43}
							color="#a854f5"
							style={tw.style(
								"absolute right-[13px] top-[13.8px]",
							)}
						/>
					</FansView>

					<FansView flexDirection="row" gap={14}>
						<FansView flex="1">
							<CustomMaskInput
								placeholder="MM / YY"
								value={formData.expireDate}
								onChangeText={(val) =>
									onChangeForm("expireDate", val)
								}
								hasError={
									isSubmitted && formData.expireDate === ""
								}
								type="monthYear"
							/>
						</FansView>
						<FansView flex="1" position="relative">
							<RoundTextInput
								placeholder="CVC"
								value={formData.cvc}
								onChangeText={(val) => onChangeForm("cvc", val)}
								hasError={isSubmitted && formData.cvc === ""}
								helperText="Invalid value"
								keyboardType="numeric"
								customStyles="pr-11"
							/>
							<CvcSvg
								width={17.13}
								height={13.08}
								color="#707070"
								style={tw.style(
									"absolute right-[13px] top-[14px]",
								)}
							/>
						</FansView>
					</FansView>
				</FansView>
				<NotificationBox style={tw.style("mb-10")}>
					<FansText
						style={tw.style(
							"text-base leading-[21px] text-fans-purple text-center",
						)}
					>
						🔒 Secure Checkout{"\n"} Please note that we do not
						store or process any credit/debit card information on
						our site. All payment transactions are securely handled
						through Authorize.Net, a Visa solution company.
					</FansText>
				</NotificationBox>

				<FansView
					flexDirection="row"
					margin={{ b: showError ? 16 : 34 }}
					alignItems={"center"}
				>
					<FypCheckbox
						checked={isConfirm}
						onPress={() => setConfirm(!isConfirm)}
					/>
					<FansText
						fontSize={16}
						lineHeight={21}
						style={tw.style("ml-[18px]")}
						onPress={() => setConfirm(!isConfirm)}
					>
						Confirm you're at least 18 years old and the age of
						majority in your place of residence
					</FansText>
				</FansView>

				<FypNullableView visible={showError}>
					<FypText
						fontSize={14}
						lineHeight={17}
						color="red"
						style={tw.style("mb-4")}
					>
						{errorText}
					</FypText>
				</FypNullableView>

				<RoundButton onPress={newPaymentMethod}>
					Add payment method
				</RoundButton>

				<TextButton onPress={handleClose}>Cancel</TextButton>
			</FansView>
		</FypModal>
	);
};

export default AddPaymentCardDialog;
