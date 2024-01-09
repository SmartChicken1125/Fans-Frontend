import { FansScreen2, FansView } from "@components/controls";
import { useAppContext } from "@context/useAppContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { updateVideoSettings } from "../../helper/endpoints/profile/apis";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import VideoCallSetupStepper from "./VideoCallSetupStepper";
import VideoStepperButtons from "./VideoStepperButtons";

const CameoSetup = () => {
	// Define the state for currentStep and steps
	const [currentStep, setCurrentStep] = useState(0);
	const { state } = useAppContext();
	const router = useRouter();

	// Define the steps array
	const steps = [
		{ label: "Step 1", component: Step1 },
		{ label: "Step 2", component: Step2 },
		{ label: "Step 3", component: Step3 },
		{ label: "Step 4", component: Step4 },
		{ label: "Step 5", component: Step5 },
		// { label: "Step 6", component: Step6 },
	];

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
		const updatedSettings = {
			...state.profile.settings,
			videoCallsEnabled: true,
		};
		const response = await updateVideoSettings(updatedSettings);
		if (response.ok) router.push("/profile");
	};

	const Component = steps[currentStep].component;

	return (
		<FansScreen2>
			<FansView style={{ marginTop: 20 }}>
				<VideoCallSetupStepper
					currentStep={currentStep}
					steps={steps}
					setCurrentStep={setCurrentStep}
				/>
			</FansView>
			<View>
				<Component />
			</View>
			<View>
				<VideoStepperButtons
					currentStep={currentStep}
					totalSteps={totalSteps}
					handlePrevStep={handlePrevStep}
					handleNextStep={handleNextStep}
					handleEnableVideoCalls={handleEnableVideoCalls}
				/>
			</View>
		</FansScreen2>
	);
};

export default CameoSetup;
