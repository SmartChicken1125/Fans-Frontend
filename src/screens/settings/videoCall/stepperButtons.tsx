import RoundButton from "@components/common/RoundButton";
import { FansGap } from "@components/controls";
import { useAppContext } from "@context/useAppContext";
import { RoundButtonType } from "@usertypes/commonEnums";
import React from "react";
import { View } from "react-native";

interface VideoStepperButtonsProps {
	currentStep: number;
	totalSteps: number;
	handlePrevStep: () => void;
	handleNextStep: () => void;
	handleEnableVideoCalls: () => void;
}

const StepperButtons: React.FC<VideoStepperButtonsProps> = ({
	currentStep,
	totalSteps,
	handlePrevStep,
	handleNextStep,
	handleEnableVideoCalls,
}) => {
	const { state } = useAppContext();
	const { video } = state.profile.settings;
	const { meetingDurations, timeframes } = video;

	const getNextDisabled = () => {
		switch (currentStep) {
			case 0:
				return meetingDurations.length === 0;
			case 1:
				return timeframes.length < 3;
			default:
				return false;
		}
	};

	console.log(video);

	return (
		<View>
			{currentStep !== 0 && (
				<RoundButton
					variant={RoundButtonType.OUTLINE_PRIMARY}
					onPress={handlePrevStep}
				>
					Previous
				</RoundButton>
			)}
			<FansGap height={24.5} />
			{currentStep !== totalSteps - 1 ? (
				<RoundButton
					disabled={getNextDisabled()}
					onPress={handleNextStep}
				>
					Next
				</RoundButton>
			) : (
				<RoundButton onPress={handleEnableVideoCalls}>
					Enable Video Calls
				</RoundButton>
			)}
		</View>
	);
};

export default StepperButtons;
