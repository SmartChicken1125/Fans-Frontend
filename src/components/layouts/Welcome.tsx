import { TitleSvg } from "@assets/svgs/common";
import { FypLinearGradientView } from "@components/common/base";
import tw from "@lib/tailwind";
import React from "react";
import { View } from "react-native";

type Props = {
	children?: React.ReactNode;
};
export default function WelcomeLayout({ children }: Props) {
	return (
		<FypLinearGradientView
			style={{
				...tw.style(
					"flex-1 relative",
					"flex items-center justify-center",
					"pl-[19px] pr-[17px] py-10",
				),
			}}
			colors={["#1D21E5", "#A854F5", "#D885FF"]}
			start={{ x: -0.5, y: 1.05 }}
			end={{ x: 1, y: 0 }}
		>
			<View style={tw`w-[70%] mx-auto pb-9`}>
				<TitleSvg width={"100%"} height={200} />
			</View>

			{children}
		</FypLinearGradientView>
	);
}
