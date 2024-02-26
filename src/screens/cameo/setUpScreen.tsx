import { FypStepper, FypText, FypNullableView } from "@components/common/base";
import { FansScreen2, FansView, FansGap } from "@components/controls";
import { defaultCustomVideoSettingData } from "@constants/common";
import { ProfileActionType, useAppContext } from "@context/useAppContext";
import {
	getCustomVideoDurations,
	getCustomVideoSettings,
	updateCustomVideoSettings,
	getCreatorCustomVideoSettings,
} from "@helper/endpoints/cameo/apis";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SettingsCameoSetupNativeStackParams } from "@usertypes/navigations";
import { IVideoDurationForm, ICustomVideoSettings } from "@usertypes/types";
import { useNavigation } from "expo-router";
import React, { useState, useEffect } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import ContentPreferenceForm from "./contentPreferenceForm";
import DescriptionForm from "./descriptionForm";
import NotificationForm from "./notificationForm";
import PricesForm from "./priceForm";
import RequestLimitationForm from "./requestLimitationForm";
import StepperButtons from "./stepperButtons";

const steps = [
	"Prices",
	"ContentPreferences",
	"RequestLimitations",
	"Description",
	"Notification",
];

const SetUpScreen = () => {
	const navigation =
		useNavigation<
			NativeStackNavigationProp<SettingsCameoSetupNativeStackParams>
		>();
	const [currentStep, setCurrentStep] = useState(0);
	const { state, dispatch } = useAppContext();

	const totalSteps = steps.length;

	const [nextDisabled, setNextDisabled] = useState(false);
	const [durations, setDurations] = useState<IVideoDurationForm[]>([]);
	const [videoSettings, setVideoSettings] = useState<ICustomVideoSettings>(
		defaultCustomVideoSettingData,
	);

	const handleNextStep = () => {
		if (currentStep < totalSteps - 1) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handleEnableVideo = async () => {
		const resp = await updateCustomVideoSettings({
			customVideoEnabled: true,
		});
		if (resp.ok) {
			const respProfile = await getCreatorCustomVideoSettings({
				id: state.profile.id,
			});
			if (respProfile.ok) {
				dispatch.setProfile({
					type: ProfileActionType.updateSettings,
					data: {
						cameo: respProfile.data,
					},
				});
			}
			navigation.navigate("Edit");
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const fetchDurations = async () => {
		const resp = await getCustomVideoDurations();
		if (resp.ok) {
			setDurations(resp.data);
		} else {
			setDurations([]);
		}
	};

	const fetchCustomVideoSettings = async () => {
		const resp = await getCustomVideoSettings();
		if (resp.ok) {
			setVideoSettings(resp.data);
		} else {
			setDurations([]);
		}
	};

	const handleUpdateDurations = (value: IVideoDurationForm[]) => {
		setDurations(value);
	};

	const handleUpdateSettings = (value: ICustomVideoSettings) => {
		setVideoSettings(value);
	};

	useEffect(() => {
		fetchDurations();
		fetchCustomVideoSettings();
	}, []);

	useEffect(() => {
		if (currentStep === 0 && durations.length === 0) {
			setNextDisabled(true);
		} else {
			setNextDisabled(false);
		}
	}, [durations, currentStep]);

	return (
		<FansScreen2 contentStyle={{ maxWidth: 670 }}>
			<FansView style={{ marginTop: 20 }}>
				<FypStepper
					currentStep={currentStep}
					steps={steps}
					onSelect={setCurrentStep}
				/>
			</FansView>
			<View>
				<FypNullableView visible={steps[currentStep] === "Prices"}>
					<FansView padding={{ b: 180 }}>
						<FansView
							padding={{ t: 28, b: 42 }}
							maxWidth={390}
							alignSelf="center"
						>
							<FypText
								textAlign="center"
								fontSize={27}
								fontWeight={600}
								margin={{ b: 12 }}
							>
								Pricing & duration
							</FypText>
							<FypText textAlign="center" fontSize={16}>
								Select up to 10 video durations that you can
								sell for difference prices to your fans
							</FypText>
						</FansView>
						<FansView margin={{ b: 15 }}>
							<FypText fontWeight={600} fontSize={17}>
								Prices
							</FypText>
						</FansView>
						<PricesForm
							durations={durations}
							updateDurations={handleUpdateDurations}
						/>
					</FansView>
				</FypNullableView>
				<FypNullableView
					visible={steps[currentStep] === "ContentPreferences"}
				>
					<FansView padding={{ t: 34, b: 34 }}>
						<FansView margin={{ b: 40 }}>
							<FypText
								textAlign="center"
								fontWeight={600}
								fontSize={27}
								margin={{ b: 12 }}
							>
								Content preferences
							</FypText>
							<FypText textAlign="center" fontSize={16}>
								Select the types of content you are comfortable
								creating. This guides fans in their requests
							</FypText>
						</FansView>
						<ContentPreferenceForm
							videoSettings={videoSettings}
							handleUpdateSettings={handleUpdateSettings}
						/>
					</FansView>
				</FypNullableView>
				<FypNullableView
					visible={steps[currentStep] === "RequestLimitations"}
				>
					<FansView padding={{ b: 40 }}>
						<FansView margin={{ b: 42 }} padding={{ t: 34 }}>
							<FypText
								textAlign="center"
								fontWeight={600}
								fontSize={27}
								margin={{ b: 12 }}
							>
								Request limitations
							</FypText>
							<FypText textAlign="center" fontSize={16}>
								Select the amount of time you need to fulfill
								custom video orders & limit the number of orders
								you receive
							</FypText>
						</FansView>
						<RequestLimitationForm
							videoSettings={videoSettings}
							handleUpdateSettings={handleUpdateSettings}
						/>
					</FansView>
				</FypNullableView>
				<FypNullableView visible={steps[currentStep] === "Description"}>
					<FansView padding={{ t: 34 }}>
						<FypText
							textAlign="center"
							fontFamily="inter-semibold"
							fontSize={27}
							margin={{ b: 12 }}
						>
							Description (optional)
						</FypText>
						<FypText
							textAlign="center"
							fontSize={16}
							margin={{ b: 42 }}
						>
							Specify the type of responses you will provide, so
							that fans know what to expect
						</FypText>
						<DescriptionForm
							videoSettings={videoSettings}
							handleUpdateSettings={handleUpdateSettings}
						/>
					</FansView>
				</FypNullableView>
				<FypNullableView
					visible={steps[currentStep] === "Notification"}
				>
					<FansView padding={{ t: 34, b: 40 }}>
						<FypText
							textAlign="center"
							fontFamily="inter-semibold"
							fontSize={27}
							margin={{ b: 12 }}
						>
							Notification settings
						</FypText>
						<FypText
							textAlign="center"
							fontSize={16}
							margin={{ b: 42 }}
						>
							Choose when and how you want to be notified about
							updates to your requests
						</FypText>
						<NotificationForm
							videoSettings={videoSettings}
							handleUpdateSettings={handleUpdateSettings}
						/>
					</FansView>
				</FypNullableView>
			</View>
			<View>
				<StepperButtons
					currentStep={currentStep}
					totalSteps={totalSteps}
					nextDisabled={nextDisabled}
					handleNextStep={handleNextStep}
					handleEnable={handleEnableVideo}
				/>
			</View>
			<FansGap height={20} />
		</FansScreen2>
	);
};

export default SetUpScreen;
