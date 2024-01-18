import { CheckSvg } from "@assets/svgs/common";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import React, { FC } from "react";
import StepIndicator from "react-native-step-indicator";
import { FypSvg } from "./svg";

const purple = "#a854f5";
const purpleLight = "#f1e2ff";

interface Props {
	currentStep: number;
	steps: string[];
	setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

const FypStepper: FC<Props> = (props) => {
	const { currentStep, steps, setCurrentStep } = props;
	const totalSteps = steps.length;

	const stepIndicatorStyles = {
		stepIndicatorSize: 25,
		currentStepIndicatorSize: 25,
		separatorStrokeWidth: 1,
		currentStepStrokeWidth: 2,
		stepStrokeCurrentColor: purple,
		stepStrokeWidth: 1,
		stepStrokeFinishedColor: purpleLight,
		stepStrokeUnFinishedColor: purpleLight,
		separatorFinishedColor: purpleLight,
		separatorUnFinishedColor: purpleLight,
		stepIndicatorFinishedColor: purpleLight,
		stepIndicatorUnFinishedColor: "#ffffff",
		stepIndicatorCurrentColor: "#ffffff",
		stepIndicatorLabelFontSize: 0,
		currentStepIndicatorLabelFontSize: 0,
		stepIndicatorLabelCurrentColor: purpleLight,
		stepIndicatorLabelFinishedColor: "#ffffff",
		stepIndicatorLabelUnFinishedColor: "#aaaaaa",
		labelColor: "#999999",
		labelSize: 13,
		currentStepLabelColor: "#fe7013",
	};

	return (
		<FansView>
			<StepIndicator
				currentPosition={currentStep}
				labels={steps.map(() => "")}
				stepCount={totalSteps}
				customStyles={stepIndicatorStyles}
				renderStepIndicator={({ position, stepStatus }) => {
					const isFinished = stepStatus === "finished";
					return (
						<FansView
							width={25}
							height={25}
							alignItems="center"
							justifyContent="center"
							borderRadius={25}
							style={tw.style(
								isFinished
									? "bg-fans-purple-84"
									: "border border-fans-purple-84",
							)}
						>
							{isFinished ? (
								<FypSvg
									svg={CheckSvg}
									width={13}
									height={13}
									color="fans-white"
								/>
							) : null}
						</FansView>
					);
				}}
			/>
		</FansView>
	);
};

export default FypStepper;
