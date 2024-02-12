import { CheckSvg } from "@assets/svgs/common";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import React, { FC, Fragment } from "react";
import { FypLinearGradientView } from "./linearGradientView";
import { FypSvg } from "./svg";

interface StepPositionProps {
	currentStep: number;
	index: number;
}

const StepPosition: FC<StepPositionProps> = (props) => {
	const { index, currentStep } = props;
	const gradientColors = [
		["#1D21E5", "#673CEE"],
		["#6E3FEE", "#8848F1"],
		["#964DF3", "#A854F5"],
		["#BE6BFA", "#CE7BFD"],
	];
	const borderColors = [
		"#633AED",
		"#8447F1",
		"#A754F5",
		"#BA67F8",
		"#D885FF",
	];
	return index < currentStep ? (
		<FypLinearGradientView
			colors={gradientColors[index] ?? []}
			width={25}
			height={25}
			borderRadius={25}
			alignItems="center"
			justifyContent="center"
		>
			<FypSvg svg={CheckSvg} width={12} height={8} color="fans-white" />
		</FypLinearGradientView>
	) : (
		<FansView
			width={25}
			height={25}
			borderRadius={25}
			style={tw.style(
				currentStep === index
					? `border-[2px] border-[${borderColors[index]}]`
					: "border border-fans-purple-f1",
			)}
		></FansView>
	);
};

interface StepLinePros {
	currentStep: number;
	index: number;
}

const StepLine: FC<StepLinePros> = (props) => {
	const { currentStep, index } = props;
	const colors = [
		["#5736EC", "#8447F1"],
		["#8447F1", "#A754F5"],
		["#A854F5", "#BA67F8"],
		["#C773FC", "#D885FF"],
	];
	return currentStep > index ? (
		<FypLinearGradientView
			colors={colors[index] ?? []}
			start={[0, 0]}
			end={[1, 1]}
			flex="1"
			height={2}
		></FypLinearGradientView>
	) : (
		<FansView
			flex="1"
			height={1}
			style={tw.style("bg-fans-purple-f1")}
		></FansView>
	);
};

interface Props {
	currentStep: number;
	steps: string[];
}

const FypStepper: FC<Props> = (props) => {
	const { currentStep, steps } = props;

	return (
		<FansView
			flexDirection="row"
			alignItems="center"
			justifyContent="between"
			gap={4}
		>
			{steps.map((step, index) => (
				<Fragment key={step}>
					<StepPosition currentStep={currentStep} index={index} />
					{index !== steps.length - 1 ? (
						<StepLine currentStep={currentStep} index={index} />
					) : null}
				</Fragment>
			))}
		</FansView>
	);
};

export default FypStepper;
