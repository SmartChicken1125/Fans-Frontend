import RoundButton from "@components/common/RoundButton";
import { FansView } from "@components/controls";
import React, { FC } from "react";

interface StepperButtonsProps {
	currentStep: number;
	totalSteps: number;
	nextDisabled: boolean;
	handleNextStep: () => void;
	handleEnable: () => void;
}

const StepperButtons: FC<StepperButtonsProps> = (props) => {
	const {
		currentStep,
		totalSteps,
		handleNextStep,
		handleEnable,
		nextDisabled,
	} = props;

	return (
		<FansView>
			{currentStep !== totalSteps - 1 ? (
				<RoundButton disabled={nextDisabled} onPress={handleNextStep}>
					Next
				</RoundButton>
			) : (
				<RoundButton onPress={handleEnable}>
					Enable custom video
				</RoundButton>
			)}
		</FansView>
	);
};

export default StepperButtons;
