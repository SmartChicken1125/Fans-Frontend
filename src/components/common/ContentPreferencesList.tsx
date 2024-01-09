import Adult from "@assets/svgs/common/Adult";
import Advice from "@assets/svgs/common/Advice";
import Consultation from "@assets/svgs/common/Consultation";
import Performance from "@assets/svgs/common/Performance";
import SexualContent from "@assets/svgs/common/SexualContent";
import { FypText } from "@components/common/base";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import React from "react";

const options = [
	{
		id: "Consultation",
		title: "Consultation",
		iconToRender: <Consultation />,
		iconColor: "#edfaea",
	},
	{
		id: "Advice",
		title: "Advice",
		iconToRender: <Advice />,
		iconColor: "#e8f6ff",
	},
	{
		id: "Performance",
		title: "Performance",
		iconToRender: <Performance />,
		iconColor: "#f6edff",
	},
	{
		id: "Adult",
		title: "18+ Adult",
		iconToRender: <Adult />,
		iconColor: "#fdebf9",
	},
	{
		id: "Sexual",
		title: "18+ Sexual",
		iconToRender: <SexualContent />,
		iconColor: "#fff3e9",
	},
	{
		id: "Spirituality",
		title: "Spirituality",
		iconToRender: <Consultation />,
		iconColor: "#fffcdb",
	},
];

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
	const filteredOptions = options.filter((option) =>
		availableOptionIds.includes(option.id),
	);
	return (
		<FansView flexDirection="row" gap={{ xs: 20, md: 40 }}>
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
						style={tw.style(`bg-[${option.iconColor}99]`)}
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
