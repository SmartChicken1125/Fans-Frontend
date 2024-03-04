import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import React, { FC } from "react";
import { ScrollView } from "react-native";

interface Props {
	children: React.ReactNode;
}

const ScreenWrapper: FC<Props> = (props) => {
	const { children } = props;

	return (
		<FansView
			flexDirection="row"
			style={tw.style("h-screen md:h-[600px] xl:h-[770px]")}
		>
			<FansView
				position="relative"
				style={tw.style("hidden md:flex w-[600px] xl:w-[770px]")}
			></FansView>
			<ScrollView
				style={tw.style(
					"md:border-l border-fans-grey dark:border-fans-grey-43",
				)}
				contentContainerStyle={{
					flex: 1,
				}}
			>
				<FansView style={[tw.style("px-5 xl:px-10 pt-10 pb-10")]}>
					{children}
				</FansView>
			</ScrollView>
		</FansView>
	);
};

export default ScreenWrapper;
