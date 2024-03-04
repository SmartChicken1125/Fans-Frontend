import {
	AddressSvg,
	ChevronRightSvg,
	OutlinedInfoSvg,
} from "@assets/svgs/common";
import FormControl from "@components/common/FormControl";
import RoundTextInput, {
	RoundTextInput3,
} from "@components/common/RoundTextInput";
import {
	FypCollapsible,
	FypCountryDropdown,
	FypText,
	FypStepper,
	FypNullableView,
	FypRadio,
	FypButton2,
	FypSvg,
	FypDropdown,
} from "@components/common/base";
import CustomRadio from "@components/common/customRadio";
import CustomTopNavBar from "@components/common/customTopNavBar";
import AppLayout from "@components/common/layout";
import { FansDivider, FansGap, FansView } from "@components/controls";
import {
	createPayPalPayoutMethod,
	fetchPayoutMethod,
	updatePayoutMethod,
} from "@helper/endpoints/payout/apis";
import states from "@helper/geo/state.json";
import tw from "@lib/tailwind";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
	ProfileNavigationStacks,
	SettingsReferralProgramNativeStackParams,
} from "@usertypes/navigations";
import { IStripeForm } from "@usertypes/types";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState, FC, useMemo, Fragment } from "react";
import { Dimensions, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const steps = ["Residential_Address", "Link_Bank_Account"];

interface IFormData {
	firstName: string;
	lastName: string;
	companyName: string;
	setUpMethod: string;
	payoutOption: "" | "Revolut" | "Payoneer" | "DirectDeposit" | "IBanSwift";
	revolutInfo: string;
	payoneerInfo: string;
	bankRoutingNumber: string;
	bankAccountNumber: string;
	ibanNumber: string;
	swiftCode: string;
}

interface IBankForm {
	setUpMethod: string;
	isUsCityzen?: boolean;
	paidMethod: string;
	paypalEmail: string;
	cPaypalEmail: string;
	country: string;
}

interface LinkBankAccountTabProps {
	formData: IFormData;
	onChangeForm: (name: string, value: string) => void;
}

const LinkBankAccountTab: FC<LinkBankAccountTabProps> = (props) => {
	const { formData, onChangeForm } = props;
	const { isGreen = false } = useLocalSearchParams();

	return (
		<FansView>
			<FypStepper currentStep={1} steps={steps} />
			<FansGap height={{ xs: 32, md: 44 }} />
			<FypText
				fontSize={{ xs: 23, md: 27 }}
				fontWeight={600}
				lineHeight={{ xs: 31, md: 36 }}
				fontFamily="inter-v"
				textAlign="center"
			>
				Link bank account
			</FypText>
			<FansGap height={35} />
			<FansView margin={{ b: 24 }}>
				<FypText
					fontSize={19}
					lineHeight={26}
					fontWeight={600}
					color="black"
					margin={{ b: 26 }}
					fontFamily="inter-v"
				>
					Business status
				</FypText>
				<FansView margin={{ b: 24 }}>
					<FypText
						fontSize={17}
						lineHeight={22}
						fontWeight={600}
						margin={{ b: 10 }}
						fontFamily="inter-v"
					>
						How are you set up?
					</FypText>
					<FansView
						flexDirection="row"
						alignItems="center"
						padding={{ y: 14 }}
					>
						<CustomRadio
							label="I am an individual"
							onPress={() =>
								onChangeForm("setUpMethod", "Individual")
							}
							checked={formData.setUpMethod === "Individual"}
							bgColor={
								isGreen
									? "bg-fans-green dark:bg-fans-green-29"
									: "bg-fans-purple"
							}
						/>
					</FansView>
					<FansDivider style={tw.style("h-[1px] my-[6px]")} />
					<FansView
						flexDirection="row"
						alignItems="center"
						padding={{ y: 14 }}
					>
						<CustomRadio
							label="I am or represent a corporation"
							onPress={() =>
								onChangeForm("setUpMethod", "Corporation")
							}
							checked={formData.setUpMethod === "Corporation"}
							bgColor={
								isGreen
									? "bg-fans-green dark:bg-fans-green-29"
									: "bg-fans-purple"
							}
						/>
					</FansView>
				</FansView>

				<FansView>
					<FypText
						fontSize={19}
						lineHeight={26}
						fontWeight={600}
						margin={{ b: 26 }}
						fontFamily="inter-v"
					>
						Payout method
					</FypText>
					<FansView>
						<FypText
							fontSize={17}
							lineHeight={22}
							fontWeight={600}
							margin={{ b: 15 }}
							fontFamily="inter-v"
						>
							Name
						</FypText>
						<FypNullableView
							visible={formData.setUpMethod === "Individual"}
						>
							<RoundTextInput
								placeholder="First name"
								value={formData.firstName}
								onChangeText={(val) =>
									onChangeForm("firstName", val)
								}
							/>
							<FansGap height={10} />
							<RoundTextInput
								placeholder="Last name"
								value={formData.lastName}
								onChangeText={(val) =>
									onChangeForm("lastName", val)
								}
							/>
						</FypNullableView>
						<FypNullableView
							visible={formData.setUpMethod === "Corporation"}
						>
							<RoundTextInput
								placeholder="Company name"
								value={formData.companyName}
								onChangeText={(val) =>
									onChangeForm("companyName", val)
								}
							/>
						</FypNullableView>
					</FansView>
				</FansView>

				<FansGap height={32} />

				<FansView>
					<FypText
						fontSize={17}
						lineHeight={22}
						fontWeight={600}
						margin={{ b: 12 }}
						fontFamily="inter-v"
					>
						Bank information
					</FypText>
					<FypText
						fontSize={16}
						lineHeight={21}
						fontFamily="inter-v"
						style={tw.style(
							"text-fans-grey-48 dark:text-fans-grey-b1",
						)}
					>
						Select your payout option, we support all major banks,
						Revolut, and Payoneer. Please make sure you provide
						accurate information to avoid delays in your payouts
					</FypText>
					<FansGap height={32} />

					<FansView>
						<FansGap height={14} />
						<FypRadio
							checked={formData.payoutOption === "Revolut"}
							label="Revolut"
							onPress={() =>
								onChangeForm("payoutOption", "Revolut")
							}
						/>
						<FansGap height={14} />
						<FypCollapsible
							collapsed={formData.payoutOption !== "Revolut"}
						>
							<FansGap height={10} />
							<FypText
								fontSize={16}
								lineHeight={21}
								fontFamily="inter-v"
								style={tw.style(
									"text-fans-grey-48 dark:text-fans-grey-b1",
								)}
							>
								Enter your Revolut link or Username to receive a
								payout to your Revolut wallet
							</FypText>
							<FansGap height={20} />
						</FypCollapsible>
					</FansView>
					<FansDivider />
					<FansView>
						<FansGap height={14} />
						<FypRadio
							checked={formData.payoutOption === "Payoneer"}
							label="Payoneer"
							onPress={() =>
								onChangeForm("payoutOption", "Payoneer")
							}
						/>
						<FansGap height={14} />
						<FypCollapsible
							collapsed={formData.payoutOption !== "Payoneer"}
						>
							<FansGap height={10} />
							<FypText
								fontSize={16}
								lineHeight={21}
								fontFamily="inter-v"
								style={tw.style(
									"text-fans-grey-48 dark:text-fans-grey-b1",
								)}
							>
								Enter your Payoneer email to receive a payout to
								your Payoneer account
							</FypText>
							<FansGap height={20} />
						</FypCollapsible>
					</FansView>
					<FansDivider />
					<FansView>
						<FansGap height={14} />
						<FypRadio
							checked={formData.payoutOption === "DirectDeposit"}
							label={`Direct deposit:\nAccount and routing number`}
							onPress={() =>
								onChangeForm("payoutOption", "DirectDeposit")
							}
						/>
						<FansGap height={14} />
						<FypCollapsible
							collapsed={
								formData.payoutOption !== "DirectDeposit"
							}
						>
							<FansGap height={10} />
							<FypText
								fontSize={16}
								lineHeight={21}
								fontFamily="inter-v"
								style={tw.style(
									"text-fans-grey-48 dark:text-fans-grey-b1",
								)}
							>
								Commonly used in the United States for direct
								deposits
							</FypText>
							<FansGap height={20} />
						</FypCollapsible>
					</FansView>
					<FansDivider />
					<FansView>
						<FansGap height={14} />
						<FypRadio
							checked={formData.payoutOption === "IBanSwift"}
							label="IBAN/SWIFT Codes"
							onPress={() =>
								onChangeForm("payoutOption", "IBanSwift")
							}
						/>
						<FansGap height={14} />
						<FypCollapsible
							collapsed={formData.payoutOption !== "IBanSwift"}
						>
							<FansGap height={10} />
							<FypText
								fontSize={16}
								lineHeight={21}
								fontFamily="inter-v"
								style={tw.style(
									"text-fans-grey-48 dark:text-fans-grey-b1",
								)}
							>
								Essential for international wire transfers
							</FypText>
							<FansGap height={20} />
						</FypCollapsible>
					</FansView>

					<FansGap height={30} />

					<FypCollapsible
						collapsed={formData.payoutOption !== "Revolut"}
					>
						<FormControl
							label="Revolut information"
							placeholder="Revolut link or username"
							value={formData.revolutInfo}
							onChangeText={(val: string) =>
								onChangeForm("revolutInfo", val)
							}
						/>
					</FypCollapsible>
					<FypCollapsible
						collapsed={formData.payoutOption !== "Payoneer"}
					>
						<FormControl
							label="Payoneer information"
							placeholder="Payoneer email"
							value={formData.payoneerInfo}
							onChangeText={(val: string) =>
								onChangeForm("payoneerInfo", val)
							}
						/>
					</FypCollapsible>
					<FypCollapsible
						collapsed={formData.payoutOption !== "DirectDeposit"}
					>
						<FypText fontSize={17} fontWeight={600} lineHeight={22}>
							Bank information
						</FypText>
						<FansGap height={15} />
						<RoundTextInput
							placeholder="Bank routing number"
							value={formData.bankRoutingNumber}
							onChangeText={(val: string) =>
								onChangeForm("bankRoutingNumber", val)
							}
						/>
						<FansGap height={10} />
						<RoundTextInput
							placeholder="Bank account number"
							value={formData.bankAccountNumber}
							onChangeText={(val: string) =>
								onChangeForm("bankAccountNumber", val)
							}
						/>
					</FypCollapsible>
					<FypCollapsible
						collapsed={formData.payoutOption !== "IBanSwift"}
					>
						<FormControl
							label="IBAN information"
							placeholder="IBAN number"
							value={formData.ibanNumber}
							onChangeText={(val: string) =>
								onChangeForm("ibanNumber", val)
							}
						/>
						<FansGap height={30} />
						<FormControl
							label="SWIFT information"
							placeholder="SWIFT code"
							value={formData.swiftCode}
							onChangeText={(val: string) =>
								onChangeForm("swiftCode", val)
							}
						/>
					</FypCollapsible>
					<FansGap height={40} />
					<FansView>
						<FypButton2
							style={tw.style("bg-fans-purple")}
							textStyle={tw.style("text-fans-white")}
						>
							Confirm
						</FypButton2>
						<FypButton2 textStyle={tw.style("text-fans-purple")}>
							Go back
						</FypButton2>
					</FansView>
				</FansView>
			</FansView>
		</FansView>
	);
};

interface ManualFormProps {
	onGoToNext: () => void;
}

const ManualForm: FC<ManualFormProps> = (props) => {
	const { onGoToNext } = props;
	const [country, setCountry] = useState<string>();
	const [state, setState] = useState<string>();
	const [city, setCity] = useState("");
	const [street, setStreet] = useState("");
	const [apt, setApt] = useState("");
	const [zip, setZip] = useState("");

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

	const handleSubmit = () => {
		onGoToNext();
	};

	return (
		<FansView>
			<FypStepper currentStep={0} steps={steps} />
			<FansGap height={32} />
			<FypText
				fontSize={23}
				fontWeight={600}
				lineHeight={31}
				textAlign="center"
				fontFamily="inter-v"
			>
				Residential address
			</FypText>
			<FansGap height={40} />

			<FansView>
				<FypText
					fontSize={17}
					fontWeight={600}
					lineHeight={22}
					margin={{ b: 15 }}
					fontFamily="inter-v"
				>
					What's your payout country?
				</FypText>
				<FypCountryDropdown
					data={[]}
					value={country}
					onSelect={(val) => setCountry(val as string)}
				/>
			</FansView>

			<FansGap height={34} />

			<FypCollapsible collapsed={country === ""}>
				<FypText
					fontSize={17}
					fontWeight={600}
					lineHeight={22}
					margin={{ b: 15 }}
					fontFamily="inter-v"
				>
					State
				</FypText>
				<FypDropdown
					data={stateOptions}
					value={state}
					onSelect={(val) => setState(val as string)}
					placeholder="Select State"
					search
				/>
				<FansGap height={32} />
			</FypCollapsible>

			<FansView>
				<FypText
					fontSize={17}
					fontWeight={600}
					lineHeight={22}
					margin={{ b: 15 }}
					fontFamily="inter-v"
				>
					Address
				</FypText>
				<RoundTextInput3
					label="City"
					value={city}
					onChangeText={setCity}
				/>
				<FansGap height={10} />
				<RoundTextInput3
					label="Street address"
					value={street}
					onChangeText={setStreet}
				/>
				<FansGap height={10} />
				<RoundTextInput3
					label="Apt, Suite, Bldg #"
					optionalLabel="(Optional. Enter if applicable)"
					value={apt}
					onChangeText={setApt}
				/>
				<FansGap height={10} />
				<RoundTextInput3
					label="ZIP code"
					value={zip}
					onChangeText={setZip}
				/>
			</FansView>
			<FansGap height={34} />
			<FypButton2
				style={tw.style("bg-fans-purple")}
				textStyle={tw.style("text-fans-white")}
				pressableProps={{
					onPress: handleSubmit,
				}}
			>
				Next
			</FypButton2>
		</FansView>
	);
};

interface SearchAddressFormProps {
	onSelect: (val: string) => void;
	handleBack: () => void;
}

const SearchAddressForm: FC<SearchAddressFormProps> = (props) => {
	const { onSelect, handleBack } = props;
	const [searchText, setSearchText] = useState("");

	const handleCancel = () => {
		handleBack();
	};

	return (
		<FansView>
			<FansView flexDirection="row" alignItems="center" gap={24}>
				<FansView flex="1" position="relative">
					<FansView
						width={16}
						height={19}
						position="absolute"
						left={17}
						top={12}
					>
						<FypSvg
							svg={AddressSvg}
							width={16}
							height={19}
							color="fans-black dark:fans-white"
						/>
					</FansView>
					<RoundTextInput
						value={searchText}
						onChangeText={setSearchText}
						customStyles="pl-11"
					/>
				</FansView>
				<FypText
					fontSize={17}
					lineHeight={22}
					onPress={handleCancel}
					fontFamily="inter-v"
				>
					Cancel
				</FypText>
			</FansView>
			<FansGap height={32} />

			{[1, 2, 3, 4].map((el) => (
				<Fragment key={el}>
					<FansView
						flexDirection="row"
						alignItems="center"
						pressableProps={{
							onPress: () => onSelect(`${el}`),
						}}
					>
						<FansView flex="1">
							<FypText
								fontSize={18}
								fontWeight={600}
								lineHeight={24}
								fontFamily="inter-v"
								margin={{ b: 1 }}
								numberOfLines={1}
							>
								1113
							</FypText>
							<FypText
								fontSize={15}
								lineHeight={21}
								numberOfLines={1}
								fontFamily="inter-v"
								style={tw.style(
									"text-fans-grey-48 dark:text-fans-grey-b1",
								)}
							>
								West pluan street, ...
							</FypText>
						</FansView>

						<FypSvg
							svg={ChevronRightSvg}
							height={16}
							width={10}
							color="fans-grey-48 dark:fans-grey-b1"
						/>
					</FansView>
					<FansGap height={18} />
					<FansDivider />
					<FansGap height={18} />
				</Fragment>
			))}

			<FansGap height={40} />

			<FypText
				fontSize={17}
				fontWeight={600}
				color="purple"
				fontFamily="inter-v"
				textAlign="center"
				onPress={handleCancel}
			>
				I don't see my address here
			</FypText>
		</FansView>
	);
};

interface ResidentialAddressTabProps {
	onGoToNext: () => void;
}

const ResidentialAddressTab: FC<ResidentialAddressTabProps> = (props) => {
	const { onGoToNext } = props;
	const [tab, setTab] = useState<"main" | "manual" | "select">("main");

	const [address, setAddress] = useState("");
	const [apt, setApt] = useState("");

	const handleContinue = () => {
		if (address !== "") {
			onGoToNext();
		}
	};

	const handleSelectAddress = (val: string) => {
		setAddress(val);
		setTab("main");
	};

	return (
		<FansView flex="1">
			<FypNullableView visible={tab === "main"}>
				<FypStepper currentStep={0} steps={steps} />
				<FansGap height={32} />
				<FypText
					fontSize={23}
					fontWeight={600}
					lineHeight={31}
					textAlign="center"
					fontFamily="inter-v"
				>
					Residential address
				</FypText>
				<FansGap height={40} />
				<FansView
					height={42}
					alignItems="center"
					flexDirection="row"
					borderRadius={42}
					gap={12}
					padding={{ x: 16 }}
					style={tw.style("bg-fans-grey-f0 dakr:bg-fans-grey-43")}
					pressableProps={{
						onPress: () => setTab("select"),
					}}
				>
					<FypSvg
						svg={AddressSvg}
						width={16}
						height={19}
						color="fans-black dark:fans-white"
					/>
					<FypText
						fontSize={18}
						lineHeight={24}
						fontFamily="inter-v"
						style={tw.style(
							"text-fans-grey-48 dark:text-fans-grey-b1",
						)}
					>
						{address === "" ? "Enter address" : address}
					</FypText>
				</FansView>

				{address === "" ? (
					<Fragment>
						<FansGap height={15} />
						<FypText
							fontSize={17}
							lineHeight={22}
							fontWeight={600}
							textAlign="center"
							fontFamily="inter-v"
							color="purple"
							onPress={() => setTab("manual")}
						>
							Add manually
						</FypText>
					</Fragment>
				) : (
					<Fragment>
						<FansGap height={27} />
						<RoundTextInput3
							label="Apt, Suite, Bldg #"
							value={apt}
							onChangeText={setApt}
						/>
						<FansGap height={10} />

						<FansView
							padding={{ x: 18, t: 16, b: 19 }}
							borderRadius={15}
							style={tw.style("bg-fans-purple-f6")}
						>
							<FypText
								fontSize={16}
								lineHeight={21}
								fontFamily="interr-v"
								textAlign="center"
							>
								<FypSvg
									svg={OutlinedInfoSvg}
									width={15}
									height={15}
									color="fans-grey-48"
								/>
								{"  "}
								Apt/Suite # is Optional
							</FypText>
							<FypText
								fontSize={16}
								lineHeight={21}
								fontFamily="interr-v"
								textAlign="center"
							>
								Enter if applicable and click continue
							</FypText>
						</FansView>
					</Fragment>
				)}

				<FypButton2
					style={tw.style(
						"mt-auto",
						address !== ""
							? "bg-fans-purple"
							: "bg-fans-grey-de dark:bg-fans-grey-50",
					)}
					textStyle={tw.style("text-fans-white")}
					pressableProps={{
						onPress: handleContinue,
					}}
				>
					Continue
				</FypButton2>
			</FypNullableView>
			<FypNullableView visible={tab === "manual"}>
				<ManualForm onGoToNext={onGoToNext} />
			</FypNullableView>
			<FypNullableView visible={tab === "select"}>
				<SearchAddressForm
					onSelect={handleSelectAddress}
					handleBack={() => setTab("main")}
				/>
			</FypNullableView>
		</FansView>
	);
};

const PayoutSetupScreen = () => {
	const navigation =
		useNavigation<
			NativeStackNavigationProp<
				| ProfileNavigationStacks
				| SettingsReferralProgramNativeStackParams
			>
		>();
	const { id, isGreen = false } = useLocalSearchParams();
	const insets = useSafeAreaInsets();

	const [step, setStep] = useState(steps[0]);
	const [bankForm, setBankForm] = useState<IBankForm>({
		setUpMethod: "",
		isUsCityzen: undefined,
		paidMethod: "Bank",
		paypalEmail: "",
		cPaypalEmail: "",
		country: "US",
	});
	const [stripeForm, setStripeForm] = useState<IStripeForm>({
		firstName: "",
		lastName: "",
		address1: "",
		address2: "",
		city: "",
		state: "",
		zip: "",
		bankRoutingNumber: "",
		bankAccountNumber: "",
	});
	const [formData, setFormData] = useState<IFormData>({
		firstName: "",
		lastName: "",
		companyName: "",
		setUpMethod: "",
		payoutOption: "",
		revolutInfo: "",
		payoneerInfo: "",
		bankRoutingNumber: "",
		bankAccountNumber: "",
		ibanNumber: "",
		swiftCode: "",
	});

	useEffect(() => {
		const fetchPayoutMethodData = async () => {
			try {
				if (!id) return;

				const response = await fetchPayoutMethod(
					{ id: id as string },
					{ id: id as string },
				);

				if (response.ok) {
					setBankForm({
						setUpMethod: response.data.entityType,
						isUsCityzen: response.data.usCitizenOrResident,
						country: response.data.country,
						paidMethod: response.data.provider,
						paypalEmail: response.data.paypalEmail || "",
						cPaypalEmail: response.data.paypalEmail || "",
					});
					if (response.data.bankInfo) {
						setStripeForm(response.data.bankInfo);
					}
				}
			} catch (error) {
				Toast.show({
					type: "error",
					text1: "Could not fetch payout method",
				});
			}
		};

		fetchPayoutMethodData();
	}, []);

	const onPaypalPayoutMethod = async () => {
		if (!bankForm.paypalEmail) {
			Toast.show({
				type: "error",
				text1: "PayPal email is required.",
			});
			return;
		}

		if (bankForm.paypalEmail !== bankForm.cPaypalEmail) {
			Toast.show({
				type: "error",
				text1: "PayPal emails do not match.",
			});
			return;
		}

		if (id) {
			try {
				const response = await updatePayoutMethod(
					{
						paypalEmail: bankForm.paypalEmail,
						country: bankForm.country,
						entityType: bankForm.setUpMethod,
						usCitizenOrResident: !!bankForm.isUsCityzen,
					},
					{ id: id as string },
				);

				if (response.ok) {
					Toast.show({
						type: "success",
						text1: "PayPal payout method updated",
					});
					navigation.navigate("GetPaid", { refresh: true });
				} else {
					Toast.show({
						type: "error",
						text1: response.data.message,
					});
				}
			} catch (error) {
				Toast.show({
					type: "error",
					text1: "Could not update PayPal payout method",
				});
			}
		} else {
			try {
				const response = await createPayPalPayoutMethod({
					paypalEmail: bankForm.paypalEmail,
					country: bankForm.country,
					entityType: bankForm.setUpMethod,
					usCitizenOrResident: !!bankForm.isUsCityzen,
				});

				if (response.ok) {
					Toast.show({
						type: "success",
						text1: "PayPal payout method added",
					});
					navigation.navigate("GetPaid", { refresh: true });
				} else {
					Toast.show({
						type: "error",
						text1: response.data.message,
					});
				}
			} catch (error) {
				Toast.show({
					type: "error",
					text1: "Could not add PayPal payout method",
				});
			}
		}
	};

	const onDepositPayoutMethod = async () => {
		if (!stripeForm.firstName) {
			Toast.show({
				type: "error",
				text1: "First name is required.",
			});
			return;
		}

		if (!stripeForm.lastName) {
			Toast.show({
				type: "error",
				text1: "Last name is required.",
			});
			return;
		}

		if (!stripeForm.address1) {
			Toast.show({
				type: "error",
				text1: "Address 1 is required.",
			});
			return;
		}

		if (!stripeForm.city) {
			Toast.show({
				type: "error",
				text1: "City is required.",
			});
			return;
		}

		if (!stripeForm.state) {
			Toast.show({
				type: "error",
				text1: "State is required.",
			});
			return;
		}

		if (!stripeForm.zip) {
			Toast.show({
				type: "error",
				text1: "ZIP is required.",
			});
			return;
		}

		if (!stripeForm.bankRoutingNumber) {
			Toast.show({
				type: "error",
				text1: "Bank routing number is required.",
			});
			return;
		}

		if (!stripeForm.bankAccountNumber) {
			Toast.show({
				type: "error",
				text1: "Bank account number is required.",
			});
			return;
		}

		if (id) {
			try {
				const response = await updatePayoutMethod(
					{
						bankInfo: stripeForm,
						country: bankForm.country,
						entityType: bankForm.setUpMethod,
						usCitizenOrResident: !!bankForm.isUsCityzen,
					},
					{ id: id as string },
				);

				if (response.ok) {
					Toast.show({
						type: "success",
						text1: "Bank payout method updated",
					});
					navigation.navigate("GetPaid", { refresh: true });
				} else {
					Toast.show({
						type: "error",
						text1: response.data.message,
					});
				}
			} catch (error) {
				Toast.show({
					type: "error",
					text1: "Could not update PayPal payout method",
				});
			}
		} else {
			try {
				const response = await createPayPalPayoutMethod({
					bankInfo: stripeForm,
					country: bankForm.country,
					entityType: bankForm.setUpMethod,
					usCitizenOrResident: !!bankForm.isUsCityzen,
				});

				if (response.ok) {
					Toast.show({
						type: "success",
						text1: "Bank payout method added",
					});
					navigation.navigate("GetPaid", { refresh: true });
				} else {
					Toast.show({
						type: "error",
						text1: response.data.message,
					});
				}
			} catch (error) {
				Toast.show({
					type: "error",
					text1: "Could not add Bank payout method",
				});
			}
		}
	};

	const onPayoutMethod = async () => {
		if (bankForm.setUpMethod === "") {
			Toast.show({
				type: "error",
				text1: "Set up must select.",
			});
			return;
		}
		if (bankForm.isUsCityzen === undefined) {
			Toast.show({
				type: "error",
				text1: "Your citizenship must select.",
			});
			return;
		}
		if (bankForm.isUsCityzen && bankForm.country !== "US") {
			Toast.show({
				type: "error",
				text1: "US citizens must select 'US' as their country.",
			});
			return;
		}

		if (!bankForm.isUsCityzen && bankForm.country === "US") {
			Toast.show({
				type: "error",
				text1: "Only US citizens or residents can select 'US' as their country.",
			});
			return;
		}

		switch (bankForm.paidMethod) {
			case "PayPal":
				onPaypalPayoutMethod();
				break;
			case "Bank":
				onDepositPayoutMethod();
				break;
		}
	};

	const onChangeForm = (name: string, value: string) => {
		setFormData({
			...formData,
			[name]: value,
		});
	};

	return (
		<AppLayout
			title="Edit Profile | FYP.Fans"
			description="FYP.Fans allows creators to make an income doing what they love!"
		>
			<FansView flex="1">
				<ScrollView
					style={tw.style("flex-1")}
					contentContainerStyle={[tw.style("flex-1")]}
				>
					<CustomTopNavBar
						title="Payout setup"
						onClickLeft={() => navigation.goBack()}
						onClickRight={onPayoutMethod}
						rightLabel="Next"
						rightLabelColor={isGreen ? "fans-green" : "fans-purple"}
					/>
					<FansView
						padding={{
							x: 18,
						}}
						style={[
							tw.style("w-full md:max-w-[710px] md:mx-auto"),
							{
								minHeight:
									Dimensions.get("window").height -
									(tw.prefixMatch("md") ? 105 : 52),
							},
						]}
					>
						<FansGap height={{ xs: 28, md: 45 }} />
						<FypNullableView
							visible={step === "Residential_Address"}
						>
							<ResidentialAddressTab
								onGoToNext={() => setStep("Link_Bank_Account")}
							/>
						</FypNullableView>
						<FypNullableView visible={step === "Link_Bank_Account"}>
							<LinkBankAccountTab
								formData={formData}
								onChangeForm={onChangeForm}
							/>
						</FypNullableView>
						<FansGap height={insets.bottom + 35} />
					</FansView>
				</ScrollView>
			</FansView>
		</AppLayout>
	);
};

export default PayoutSetupScreen;
