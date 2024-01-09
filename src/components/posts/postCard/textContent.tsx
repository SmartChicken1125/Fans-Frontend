import { FansText, FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { IFypPostContent } from "@usertypes/components";
import React from "react";

const TextContent: IFypPostContent = (props) => {
	const { data } = props;

	return (
		<FansView>
			<FansView
				style={tw.style(
					"p-6 mt-3 md:mt-7.5 bg-fans-purple-f6 dark:bg-fans-purple-47",
				)}
			>
				<FansText
					fontSize={16}
					lineHeight={21}
					style={tw.style("text-fans-black dark:text-fans-white")}
				>
					{data.caption}
				</FansText>
			</FansView>
		</FansView>
	);
};

export default TextContent;
