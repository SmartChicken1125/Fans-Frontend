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
import CustomTopNavBar from "@components/common/customTopNavBar";
import AppLayout from "@components/common/layout";
import { FansDivider, FansGap, FansView } from "@components/controls";
import { useAppContext } from "@context/useAppContext";
import { createOrUpdatePayoutMethod } from "@helper/endpoints/payout/apis";
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
	country: string;
	state: string;
	city: string;
	street: string;
	apt: string;
	zip: string;
	firstName: string;
	lastName: string;
	company: string;
	entityType: string;
	payoutMethod: "" | "Revolut" | "Payoneer" | "DirectDeposit" | "IBAN";
	revolut: string;
	payoneer: string;
	routingNumber: string;
	accountNumber: string;
	iban: string;
	swift: string;
}

interface IBankForm {
	entityType: string;
	isUsCityzen?: boolean;
	paidMethod: string;
	paypalEmail: string;
	cPaypalEmail: string;
	country: string;
}

interface LinkBankAccountTabProps {
	formData: IFormData;
	onChangeForm: (name: string, value: string) => void;
	onSubmit: () => void;
}

const LinkBankAccountTab: FC<LinkBankAccountTabProps> = (props) => {
	const { formData, onChangeForm, onSubmit } = props;
	const { isGreen = false } = useLocalSearchParams();

	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleConfirm = () => {
		setIsSubmitted(true);
		onSubmit();
	};

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
						<FypRadio
							label="I am an individual"
							onPress={() =>
								onChangeForm("entityType", "Individual")
							}
							checked={formData.entityType === "Individual"}
							hasError={isSubmitted && !formData.entityType}
						/>
					</FansView>
					<FansDivider style={tw.style("h-[1px] my-[6px]")} />
					<FansView
						flexDirection="row"
						alignItems="center"
						padding={{ y: 14 }}
					>
						<FypRadio
							label="I am or represent a corporation"
							onPress={() =>
								onChangeForm("entityType", "Corporation")
							}
							checked={formData.entityType === "Corporation"}
							hasError={isSubmitted && !formData.entityType}
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
					<FypNullableView visible={formData.entityType !== ""}>
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
								visible={formData.entityType === "Individual"}
							>
								<RoundTextInput
									placeholder="First name"
									value={formData.firstName}
									onChangeText={(val) =>
										onChangeForm("firstName", val)
									}
									hasError={
										isSubmitted &&
										formData.entityType === "Individual" &&
										!formData.firstName
									}
								/>
								<FansGap height={10} />
								<RoundTextInput
									placeholder="Last name"
									value={formData.lastName}
									onChangeText={(val) =>
										onChangeForm("lastName", val)
									}
									hasError={
										isSubmitted &&
										formData.entityType === "Individual" &&
										!formData.lastName
									}
								/>
							</FypNullableView>
							<FypNullableView
								visible={formData.entityType === "Corporation"}
							>
								<RoundTextInput
									placeholder="Company name"
									value={formData.company}
									onChangeText={(val) =>
										onChangeForm("company", val)
									}
									hasError={
										isSubmitted &&
										formData.entityType === "Corporation" &&
										!formData.company
									}
								/>
							</FypNullableView>
						</FansView>
					</FypNullableView>
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
							checked={formData.payoutMethod === "Revolut"}
							label="Revolut"
							onPress={() =>
								onChangeForm("payoutMethod", "Revolut")
							}
							hasError={isSubmitted && !formData.payoutMethod}
						/>
						<FansGap height={14} />
						<FypCollapsible
							collapsed={formData.payoutMethod !== "Revolut"}
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
							checked={formData.payoutMethod === "Payoneer"}
							label="Payoneer"
							onPress={() =>
								onChangeForm("payoutMethod", "Payoneer")
							}
							hasError={isSubmitted && !formData.payoutMethod}
						/>
						<FansGap height={14} />
						<FypCollapsible
							collapsed={formData.payoutMethod !== "Payoneer"}
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
							checked={formData.payoutMethod === "DirectDeposit"}
							label={`Direct deposit:\nAccount and routing number`}
							onPress={() =>
								onChangeForm("payoutMethod", "DirectDeposit")
							}
							hasError={isSubmitted && !formData.payoutMethod}
						/>
						<FansGap height={14} />
						<FypCollapsible
							collapsed={
								formData.payoutMethod !== "DirectDeposit"
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
							checked={formData.payoutMethod === "IBAN"}
							label="IBAN/SWIFT Codes"
							onPress={() => onChangeForm("payoutMethod", "IBAN")}
							hasError={isSubmitted && !formData.payoutMethod}
						/>
						<FansGap height={14} />
						<FypCollapsible
							collapsed={formData.payoutMethod !== "IBAN"}
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
						collapsed={formData.payoutMethod !== "Revolut"}
					>
						<FormControl
							label="Revolut information"
							placeholder="Revolut link or username"
							value={formData.revolut}
							onChangeText={(val: string) =>
								onChangeForm("revolut", val)
							}
							hasError={isSubmitted && !formData.revolut}
						/>
					</FypCollapsible>
					<FypCollapsible
						collapsed={formData.payoutMethod !== "Payoneer"}
					>
						<FormControl
							label="Payoneer information"
							placeholder="Payoneer email"
							value={formData.payoneer}
							onChangeText={(val: string) =>
								onChangeForm("payoneer", val)
							}
							hasError={isSubmitted && !formData.payoneer}
						/>
					</FypCollapsible>
					<FypCollapsible
						collapsed={formData.payoutMethod !== "DirectDeposit"}
					>
						<FypText fontSize={17} fontWeight={600} lineHeight={22}>
							Bank information
						</FypText>
						<FansGap height={15} />
						<RoundTextInput
							placeholder="Bank routing number"
							value={formData.routingNumber}
							onChangeText={(val: string) =>
								onChangeForm("routingNumber", val)
							}
							hasError={isSubmitted && !formData.routingNumber}
						/>
						<FansGap height={10} />
						<RoundTextInput
							placeholder="Bank account number"
							value={formData.accountNumber}
							onChangeText={(val: string) =>
								onChangeForm("accountNumber", val)
							}
							hasError={isSubmitted && !formData.accountNumber}
						/>
					</FypCollapsible>
					<FypCollapsible
						collapsed={formData.payoutMethod !== "IBAN"}
					>
						<FormControl
							label="IBAN information"
							placeholder="IBAN number"
							value={formData.iban}
							onChangeText={(val: string) =>
								onChangeForm("iban", val)
							}
							hasError={isSubmitted && !formData.iban}
						/>
						<FansGap height={30} />
						<FormControl
							label="SWIFT information"
							placeholder="SWIFT code"
							value={formData.swift}
							onChangeText={(val: string) =>
								onChangeForm("swift", val)
							}
							hasError={isSubmitted && !formData.swift}
						/>
					</FypCollapsible>
					<FansGap height={40} />
					<FansView>
						<FypButton2
							style={tw.style("bg-fans-purple")}
							textStyle={tw.style("text-fans-white")}
							pressableProps={{
								onPress: handleConfirm,
							}}
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
	formData: IFormData;
	onChangeForm: (name: string, value: string) => void;
	onGoToNext: () => void;
}

const ManualForm: FC<ManualFormProps> = (props) => {
	const { formData, onChangeForm, onGoToNext } = props;

	const stateOptions = useMemo(
		() =>
			states
				.filter((s) => s.countryCode === formData.country)
				.sort((a, b) => a.name.localeCompare(b.name))
				.map((el) => ({
					data: el.name,
					label: el.name,
				})),
		[formData.country],
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
					value={formData.country}
					onSelect={(val) => onChangeForm("country", val as string)}
				/>
			</FansView>

			<FansGap height={34} />

			<FypCollapsible collapsed={formData.country === ""}>
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
					value={formData.state}
					onSelect={(val) => onChangeForm("state", val as string)}
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
					value={formData.city}
					onChangeText={(val) => onChangeForm("city", val as string)}
				/>
				<FansGap height={10} />
				<RoundTextInput3
					label="Street address"
					value={formData.street}
					onChangeText={(val) =>
						onChangeForm("street", val as string)
					}
				/>
				<FansGap height={10} />
				<RoundTextInput3
					label="Apt, Suite, Bldg #"
					optionalLabel="(Optional. Enter if applicable)"
					value={formData.apt}
					onChangeText={(val) => onChangeForm("apt", val as string)}
				/>
				<FansGap height={10} />
				<RoundTextInput3
					label="ZIP code"
					value={formData.zip}
					onChangeText={(val) => onChangeForm("zip", val as string)}
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
	formData: IFormData;
	onChangeForm: (name: string, value: string) => void;
	onGoToNext: () => void;
}

const ResidentialAddressTab: FC<ResidentialAddressTabProps> = (props) => {
	const { formData, onChangeForm, onGoToNext } = props;
	const [tab, setTab] = useState<"main" | "manual" | "select">("manual");

	const [address, setAddress] = useState("");
	const [apt, setApt] = useState("");

	const handleContinue = () => {
		onGoToNext();
	};

	const handleSelectAddress = (val: string) => {
		setAddress(val);
		setTab("main");
	};

	return (
		<FansView flex="1">
			<FypNullableView
				visible={tab === "main"}
				animated
				style={tw.style("flex-1")}
			>
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
				<ManualForm
					formData={formData}
					onChangeForm={onChangeForm}
					onGoToNext={handleContinue}
				/>
			</FypNullableView>
			<FypNullableView visible={tab === "select"} animated>
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
	const { isGreen = false } = useLocalSearchParams();
	const insets = useSafeAreaInsets();
	const { state, dispatch } = useAppContext();

	const [step, setStep] = useState(steps[0]);
	const [formData, setFormData] = useState<IFormData>({
		country: "",
		state: "",
		city: "",
		street: "",
		apt: "",
		zip: "",
		firstName: "",
		lastName: "",
		company: "",
		entityType: "",
		payoutMethod: "",
		revolut: "",
		payoneer: "",
		routingNumber: "",
		accountNumber: "",
		iban: "",
		swift: "",
	});

	const onChangeForm = (name: string, value: string) => {
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const onPayoutMethod = async () => {
		try {
			const res = await createOrUpdatePayoutMethod(formData);
			if (res.status === 200) {
				Toast.show({
					type: "success",
					text1: "Payout method updated successfully",
				});
				navigation.goBack();
			}
		} catch (error) {
			Toast.show({
				type: "error",
				text1: "Failed to update payout method",
			});
		}
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
						onClickRight={() => {}}
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
								formData={formData}
								onChangeForm={onChangeForm}
								onGoToNext={() => setStep("Link_Bank_Account")}
							/>
						</FypNullableView>
						<FypNullableView visible={step === "Link_Bank_Account"}>
							<LinkBankAccountTab
								formData={formData}
								onChangeForm={onChangeForm}
								onSubmit={onPayoutMethod}
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
