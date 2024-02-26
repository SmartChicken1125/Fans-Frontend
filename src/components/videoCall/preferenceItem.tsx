import { CheckSvg } from "@assets/svgs/common";
import { FypText, FypNullableView, FypSvg } from "@components/common/base";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import React, { FC } from "react";

interface PreferenceItemProps {
	title: string;
	selected: boolean;
	onPress: () => void;
	iconToRender: React.ReactNode;
}

const PreferenceItem: FC<PreferenceItemProps> = (props) => {
	const { title, selected, onPress, iconToRender } = props;
	return (
		<FansView
			style={tw.style(
				"border",
				selected
					? "border-fans-purple border-[2px]"
					: "border-fans-grey-f0 dark:border-fans-grey-43",
			)}
			width="full"
			height={{ xs: 136, md: 186 }}
			alignItems="center"
			justifyContent="center"
			borderRadius={15}
			position="relative"
			touchableOpacityProps={{
				onPress: onPress,
			}}
		>
			<FansView
				width={20}
				height={20}
				borderRadius={20}
				alignItems="center"
				justifyContent="center"
				position="absolute"
				top={10}
				right={10}
				style={tw.style(
					selected
						? "bg-fans-purple"
						: "border border-fans-grey dark:border-fans-grey-43",
				)}
			>
				<FypNullableView visible={selected}>
					<FypSvg
						svg={CheckSvg}
						width={12}
						height={10}
						color="fans-white"
					/>
				</FypNullableView>
			</FansView>

			<FansView alignItems="center" margin={{ t: -20 }}>
				{iconToRender}
			</FansView>
			<FypText
				fontSize={16}
				margin={{ t: 18 }}
				fontWeight={600}
				textAlign="center"
				style={tw.style("absolute bottom-4 md:bottom-5 left-0 w-full")}
			>
				{title}
			</FypText>
		</FansView>
	);
};

export default PreferenceItem;
