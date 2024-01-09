import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import React, { FC } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LayoutRightContents from "./rightContents";

interface Props {
	children?: React.ReactNode;
	paddingTop?: number;
	hideRightSection?: boolean;
	settingsLayout?: boolean;
}

const ContentsContainer: FC<Props> = (props) => {
	const { children, paddingTop, hideRightSection, settingsLayout } = props;

	const insets = useSafeAreaInsets();

	return (
		<FansView flexDirection="row" flex="1">
			<FansView
				style={tw.style(
					`flex-1 md:border-r items-center md:px-[18px]`,
					"border-fans-grey-f0 dark:border-fans-grey-43",
					settingsLayout && "md:pl-10 md:pr-35",
					hideRightSection && "md:border-r-0",
				)}
			>
				<FansView
					position="relative"
					flex="1"
					width="full"
					style={tw.style(
						"bg-fans-white dark:bg-fans-black-1d",
						settingsLayout ? "" : "2lg:max-w-[710px]",
					)}
				>
					<FansView
						flex="1"
						position="relative"
						padding={{ t: paddingTop ? paddingTop : insets.top }}
						style={tw.style("bg-fans-white dark:bg-fans-black-1d")}
					>
						{children}
					</FansView>
				</FansView>
			</FansView>
			<LayoutRightContents hide={hideRightSection} />
		</FansView>
	);
};

export default ContentsContainer;
