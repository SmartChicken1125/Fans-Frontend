import { SearchSvg } from "@assets/svgs/common";
import { FansDivider } from "@components/controls";
import tw from "@lib/tailwind";
import { IRecentSearchGroup } from "@usertypes/types";
import React, { FC } from "react";
import { View, Text } from "react-native";
import RecentSearch from "./recentSearch";

interface Props {
	data: IRecentSearchGroup;
}

const RecentSearchGroup: FC<Props> = (props) => {
	const { data } = props;

	return (
		<View style={tw.style("px-[18px]")}>
			<View style={tw.style("flex-row items-center h-15 mb-2")}>
				<SearchSvg width={19.99} height={20.17} color="#707070" />
				<Text
					style={tw.style(
						"text-[17px] leading-[22px] text-black ml-4",
					)}
				>
					{data.title}
				</Text>
			</View>

			<View style={tw.style("")}>
				{data.searches.map((search) => (
					<View key={search.id}>
						<FansDivider />
						<RecentSearch data={search} />
					</View>
				))}
				<FansDivider />
			</View>
		</View>
	);
};

export default RecentSearchGroup;
