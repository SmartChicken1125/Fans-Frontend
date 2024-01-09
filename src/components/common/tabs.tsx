import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { ITabCell } from "@usertypes/types";
import React, { FC } from "react";
import { FypText } from "./base";

interface TabProps {
	title: string;
	onClick: () => void;
	isSelected: boolean;
}

export const Tab: FC<TabProps> = (props) => {
	const { title, onClick, isSelected } = props;

	return (
		<FansView
			flex="1"
			padding={{ y: 14 }}
			position="relative"
			touchableOpacityProps={{
				onPress: onClick,
			}}
		>
			<FypText
				textAlign="center"
				fontSize={17}
				lineHeight={22}
				fontWeight={500}
				style={tw.style(
					isSelected
						? "text-fans-black dark:text-fans-white"
						: "text-fans-grey-70 dark:text-fans-grey-b1",
				)}
			>
				{title}
			</FypText>

			<FansView
				height={2}
				width="full"
				position="absolute"
				left={0}
				bottom={-1}
				style={tw.style("bg-fans-purple", isSelected ? "" : "hidden")}
			/>
		</FansView>
	);
};

interface Props {
	tabs: ITabCell[];
	selectedTab: string;
	onChangeTab: (val: string) => void;
}

const Tabs: FC<Props> = (props) => {
	const { tabs, selectedTab, onChangeTab } = props;

	return (
		<FansView
			flexDirection="row"
			style={tw.style(
				"border-b border-fans-grey-f0 dark:border-fans-grey-43 w-full",
			)}
		>
			{tabs
				.filter((el) => !el.hide)
				.map((tab) => (
					<Tab
						title={tab.label}
						onClick={() => onChangeTab(tab.data)}
						isSelected={tab.data === selectedTab}
						key={tab.data}
					/>
				))}
		</FansView>
	);
};

export default Tabs;
