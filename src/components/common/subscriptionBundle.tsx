import { FypText } from "@components/common/base";
import tw from "@lib/tailwind";
import React, { FC } from "react";
import { View, Pressable, PressableProps } from "react-native";

interface Props extends PressableProps {
	title: string;
	value: string;
	optionalText?: string;
	variant?: "outlined" | "contained";
}

const SubscriptionBundle: FC<Props> = (props) => {
	const { title, value, optionalText, variant, ...others } = props;

	return (
		<Pressable
			style={tw.style(
				"border border-fans-purple pl-[21px] pr-[18px] h-[42px] rounded-[28px] flex-row items-center justify-between",
				{
					"bg-fans-purple": variant === "contained",
				},
			)}
			{...others}
		>
			<View style={tw.style("flex-row items-center")}>
				<FypText
					fontSize={19}
					lineHeight={26}
					fontWeight={700}
					style={tw.style(
						variant === "contained"
							? "text-white"
							: "text-fans-purple",
					)}
				>
					{title}
				</FypText>

				{optionalText && (
					<FypText
						fontSize={16}
						lineHeight={21}
						style={tw.style(
							variant === "contained"
								? "text-white"
								: "text-fans-purple",
						)}
					>
						{` ${optionalText}`}
					</FypText>
				)}
			</View>

			<FypText
				style={tw.style(
					variant === "contained" ? "text-white" : "text-fans-purple",
				)}
				fontSize={15}
				lineHeight={20}
			>
				{value}
			</FypText>
		</Pressable>
	);
};

export default SubscriptionBundle;
