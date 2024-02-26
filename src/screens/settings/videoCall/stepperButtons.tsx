import RoundButton from "@components/common/RoundButton";
import { FansView } from "@components/controls";
import { RoundButtonType } from "@usertypes/commonEnums";
import React, { FC } from "react";

interface StepperButtonsProps {
	currentStep: number;
	totalSteps: number;
	handlePrevStep: () => void;
	handleNextStep: () => void;
	handleEnableVideoCalls: () => void;
	nextDisabled: boolean;
	inProgress: boolean;
}

const StepperButtons: FC<StepperButtonsProps> = ({
	currentStep,
	totalSteps,
	handlePrevStep,
	handleNextStep,
	handleEnableVideoCalls,
	nextDisabled,
	inProgress,
}) => {
	return (
		<FansView gap={24}>
			{currentStep !== 0 && (
				<RoundButton
					variant={RoundButtonType.OUTLINE_PRIMARY}
					onPress={handlePrevStep}
				>
					Previous
				</RoundButton>
			)}
			{currentStep !== totalSteps - 1 ? (
				<RoundButton
					loading={inProgress}
					disabled={nextDisabled}
					onPress={handleNextStep}
				>
					Next
				</RoundButton>
			) : (
				<RoundButton
					loading={inProgress}
					onPress={handleEnableVideoCalls}
				>
					Enable Video Calls
				</RoundButton>
			)}
		</FansView>
	);
};

export default StepperButtons;
