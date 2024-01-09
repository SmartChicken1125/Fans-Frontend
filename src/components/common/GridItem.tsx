import { CheckSvg } from "@assets/svgs/common";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import React, { ReactNode } from "react";
import { FypText, FypNullableView, FypSvg } from "./base";

interface GridItemProps {
	title: string;
	selected: boolean;
	empty?: boolean;
	onPress: () => void;
	iconToRender: ReactNode;
	iconColor?: string;
}

const GridItem: React.FC<GridItemProps> = ({
	title,
	selected,
	onPress,
	empty,
	iconToRender,
	iconColor,
}) => {
	if (empty) {
		return (
			<FansView
				flex="1"
				alignItems="center"
				justifyContent="center"
				borderRadius={7}
				padding={{ t: 38, b: 20, x: 16 }}
			></FansView>
		);
	}
	return (
		<FansView
			style={tw.style(
				"border",
				selected
					? "border-fans-purple"
					: "border-fans-grey-f0 dark:border-fans-grey-43",
			)}
			flex="1"
			alignItems="center"
			justifyContent="center"
			borderRadius={7}
			padding={{ t: 38, b: 20, x: 16 }}
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

			<FansView
				width={90}
				height={90}
				borderRadius={90}
				alignItems="center"
				justifyContent="center"
				style={[
					tw.style("mx-auto"),
					{ backgroundColor: `${iconColor}99` },
				]}
			>
				<FansView>{iconToRender}</FansView>
			</FansView>
			<FypText fontSize={16} margin={{ t: 18 }}>
				{title}
			</FypText>
		</FansView>
	);
};

export default GridItem;
