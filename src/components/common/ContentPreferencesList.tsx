import { FypText } from "@components/common/base";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import React from "react";
import { Image } from "react-native";

export interface Option {
	id: string;
	title: string;
	iconToRender: JSX.Element;
	iconColor: string;
}

interface ContentPreferencesListProps {
	availableOptionIds: string[]; // List of IDs to display
}

export const ContentPreferencesList: React.FC<ContentPreferencesListProps> = ({
	availableOptionIds,
}) => {
	const options = [
		{
			id: "Shoutout",
			title: "Shoutout",
			iconToRender: (
				<Image
					source={require("@assets/images/preferences/shoutout.png")}
					resizeMode="contain"
					style={tw.style(
						"w-[50px] h-[50px] md:w-[55px] md:h-[55px]",
					)}
				/>
			),
		},
		{
			id: "Advice",
			title: "Advice",
			iconToRender: (
				<Image
					source={require("@assets/images/preferences/advice.png")}
					resizeMode="contain"
					style={tw.style(
						"w-[54px] h-[54px] md:w-[64px] md:h-[64px]",
					)}
				/>
			),
		},
		{
			id: "Performance",
			title: "Performance",
			iconToRender: (
				<Image
					source={require("@assets/images/preferences/performance.png")}
					resizeMode="contain"
					style={tw.style(
						"w-[56px] h-[34px] md:w-[66px] md:h-[40px]",
					)}
				/>
			),
		},
		{
			id: "Adult",
			title: "18+ Adult",
			iconToRender: (
				<Image
					source={require("@assets/images/preferences/adult.png")}
					resizeMode="contain"
					style={tw.style(
						"w-[46px] h-[51px] md:w-[58px] md:h-[58px]",
					)}
				/>
			),
		},
		{
			id: "Endorsements",
			title: "Endorsements",
			iconToRender: (
				<Image
					source={require("@assets/images/preferences/endorsements.png")}
					resizeMode="contain"
					style={tw.style(
						"w-[41px] h-[46px] md:w-[64px] md:h-[55px]",
					)}
				/>
			),
		},
		{
			id: "Roast",
			title: "Roast",
			iconToRender: (
				<Image
					source={require("@assets/images/preferences/roast.png")}
					resizeMode="contain"
					style={tw.style(
						"w-[61px] h-[44px] md:w-[66px] md:h-[48px]",
					)}
				/>
			),
		},
	];

	const filteredOptions = options.filter((option) =>
		availableOptionIds.includes(option.id),
	);
	return (
		<FansView
			flexDirection="row"
			gap={{ xs: 20, md: 40 }}
			justifyContent="center"
		>
			{filteredOptions.map((option) => (
				<FansView
					key={option.id}
					gap={{ xs: 6, md: 15 }}
					alignItems="center"
				>
					<FansView
						width={{ xs: 67, md: 75 }}
						height={{ xs: 67, md: 75 }}
						alignItems="center"
						justifyContent="center"
						borderRadius={75}
					>
						{option.iconToRender}
					</FansView>
					<FypText fontSize={16} lineHeight={21} textAlign="center">
						{option.title}
					</FypText>
				</FansView>
			))}
		</FansView>
	);
};
