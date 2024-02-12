import { FypStepper, FypText } from "@components/common/base";
import { FansGap, FansScreen2, FansView } from "@components/controls";
import { useAppContext, ProfileActionType } from "@context/useAppContext";
import { updateVideoCallSettings } from "@helper/endpoints/videoCalls/apis";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import ContentPreferenceForm from "./contentPreferenceForm";
import NotificationStep from "./notificationStep";
import PricesForm from "./pricesForm";
import StepperButtons from "./stepperButtons";
import TimeframeForm from "./timeframeForm";
import TitleForm from "./titleForm";

const steps = [
	"Prices",
	"Timeframes",
	"ContentPreferences",
	"Title",
	"Notification",
];

const VideoCallSetupScreen = () => {
	const [currentStep, setCurrentStep] = useState(0);
	const { state, dispatch } = useAppContext();
	const router = useRouter();

	const totalSteps = steps.length;

	const handleNextStep = () => {
		if (currentStep < totalSteps - 1) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handlePrevStep = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleEnableVideoCalls = async () => {
		const resp = await updateVideoCallSettings({ videoCallsEnabled: true });
		if (resp.ok) {
			dispatch.setProfile({
				type: ProfileActionType.updateSettings,
				data: {
					video: {
						...state.profile.settings.video,
						videoCallsEnabled: true,
					},
				},
			});
			router.push("/profile");
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	return (
		<FansScreen2 contentStyle={{ maxWidth: 670 }}>
			<FansView style={{ marginTop: 20 }}>
				<FypStepper currentStep={currentStep} steps={steps} />
			</FansView>
			<View>
				{steps[currentStep] === "Prices" ? (
					<FansView padding={{ b: 180 }}>
						<FansView padding={{ t: 28, b: 42 }}>
							<FypText
								textAlign="center"
								fontSize={27}
								fontWeight={600}
								margin={{ b: 12 }}
							>
								Pricing & duration
							</FypText>
							<FypText textAlign="center" fontSize={16}>
								Set your price for different video durations.
								Higher duration videos should be more expensive
							</FypText>
						</FansView>
						<FansView margin={{ b: 25 }}>
							<FypText
								fontWeight={600}
								fontSize={17}
								margin={{ b: 12 }}
							>
								Prices
							</FypText>
							<FypText color="grey-70" fontSize={16}>
								Create prices for different video call
								durations. Provide up to 10 time options for
								fans to buy
							</FypText>
						</FansView>
						<PricesForm />
					</FansView>
				) : null}
				{steps[currentStep] === "Timeframes" ? (
					<FansView padding={{ b: 40 }}>
						<FansView margin={{ b: 42 }} padding={{ t: 34 }}>
							<FypText
								textAlign="center"
								fontWeight={600}
								fontSize={27}
								margin={{ b: 12 }}
							>
								Availability
							</FypText>
							<FypText textAlign="center" fontSize={16}>
								Fans or clients will only be able to book
								between the selected range of dates
							</FypText>
						</FansView>
						<TimeframeForm />
					</FansView>
				) : null}
				{steps[currentStep] === "ContentPreferences" ? (
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
						<ContentPreferenceForm />
					</FansView>
				) : null}
				{steps[currentStep] === "Title" ? (
					<FansView padding={{ t: 34, b: 355 }}>
						<FypText
							textAlign="center"
							fontFamily="inter-semibold"
							fontSize={27}
							margin={{ b: 12 }}
						>
							Title & description
						</FypText>
						<FypText
							textAlign="center"
							fontSize={16}
							margin={{ b: 42 }}
						>
							Specify the type of video call you will provide, so
							that fans know what to expect
						</FypText>
						<TitleForm />
					</FansView>
				) : null}
				{steps[currentStep] === "Notification" ? (
					<NotificationStep />
				) : null}
			</View>
			<View>
				<StepperButtons
					currentStep={currentStep}
					totalSteps={totalSteps}
					handlePrevStep={handlePrevStep}
					handleNextStep={handleNextStep}
					handleEnableVideoCalls={handleEnableVideoCalls}
				/>
			</View>
			<FansGap height={20} />
		</FansScreen2>
	);
};

export default VideoCallSetupScreen;
