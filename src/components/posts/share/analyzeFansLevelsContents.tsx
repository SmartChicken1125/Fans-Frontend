import { SearchSvg } from "@assets/svgs/common";
import RoundTextInput from "@components/common/RoundTextInput";
import { FypText, FypSvg } from "@components/common/base";
import { FansDivider } from "@components/controls";
import { IndividualFan, OverviewFansLevel } from "@components/posts/common";
import { defaultAnalyzeFans } from "@constants/common";
import { getAnalyzeFans, getFansUsers } from "@helper/endpoints/post/apis";
import { FansUsersRespBody } from "@helper/endpoints/post/schemas";
import tw from "@lib/tailwind";
import { IAnalyzeFans, IFansUser } from "@usertypes/types";
import React, { useEffect, useState } from "react";
import { View, ScrollView, NativeScrollEvent } from "react-native";

const SCROLL_SIZE = 10;

const AnalyzeFansLevelsContents = () => {
	const [overViewData, setOverViewData] =
		useState<IAnalyzeFans[]>(defaultAnalyzeFans);
	const [searchKey, setSearchKey] = useState("");
	const [inLoadingMore, setInLoadingMore] = useState(false);
	const [fanUsers, setFanUsers] = useState<FansUsersRespBody>({
		fans: [],
		page: 1,
		size: SCROLL_SIZE,
		total: 0,
	});

	const fetchAnalyzeFans = async () => {
		const resp = await getAnalyzeFans();
		if (resp.ok) {
			setOverViewData(resp.data.data);
		}
	};

	const getOverviewDetail = (data: IAnalyzeFans) => {
		switch (data.from) {
			case 1:
				return {
					color: "#23c9b1",
					percent: Math.floor((data.fans * 100) / 200),
				};
			case 21:
				return {
					color: "#24a2ff",
					percent: Math.floor((data.fans * 100) / 200),
				};
			case 41:
				return {
					color: "#a854f5",
					percent: Math.floor((data.fans * 100) / 200),
				};
			case 61:
				return {
					color: "#e53ec6",
					percent: Math.floor((data.fans * 100) / 200),
				};
			case 81:
				return {
					color: "#f98c28",
					percent: Math.floor((data.fans * 100) / 200),
				};
			default:
				return {
					color: "#23c9b1",
					percent: Math.floor((data.fans * 100) / 200),
				};
		}
	};

	const fetchFanUsers = async (page: number) => {
		const filterObject = {
			page: page,
			size: SCROLL_SIZE,
			query: searchKey,
		};

		const resp = await getFansUsers(filterObject);
		setInLoadingMore(false);
		if (resp.ok) {
			setFanUsers({
				...resp.data,
				fans:
					resp.data.page === 1
						? resp.data.fans
						: [...fanUsers.fans, ...resp.data.fans],
			});
		}
	};

	const onScrollView = (nativeEvent: NativeScrollEvent) => {
		const paddingToBottom = 20;
		const isScrollEnd =
			nativeEvent.layoutMeasurement.height +
				nativeEvent.contentOffset.y >=
			nativeEvent.contentSize.height - paddingToBottom;
		if (
			isScrollEnd &&
			!inLoadingMore &&
			fanUsers.total > SCROLL_SIZE * fanUsers.page
		) {
			setInLoadingMore(true);
			fetchFanUsers(fanUsers.page + 1);
		}
	};

	useEffect(() => {
		fetchAnalyzeFans();
	}, []);

	useEffect(() => {
		fetchFanUsers(1);
	}, [searchKey]);

	return (
		<View>
			<View>
				<FypText
					fontSize={17}
					lineHeight={22}
					margin={{ b: 14 }}
					fontWeight={600}
					style={tw.style("text-fans-black dark:text-fans-white")}
				>
					Overview
				</FypText>

				<View style={tw.style("gap-y-[14px]")}>
					{overViewData.map((cell) => (
						<OverviewFansLevel
							key={cell.from}
							percent={getOverviewDetail(cell).percent}
							color={getOverviewDetail(cell).color}
							fans={cell.fans}
							levels={`${cell.from}-${cell.to}`}
						/>
					))}
				</View>
			</View>

			<FansDivider
				style={tw.style(
					"mb-6 mt-[34px]",
					overViewData.length === 0 && "hidden",
				)}
			/>

			<View>
				<FypText
					fontSize={17}
					lineHeight={22}
					margin={{ b: 14 }}
					fontWeight={600}
					style={tw.style("text-fans-black dark:text-fans-white")}
				>
					Individual fans
				</FypText>

				<RoundTextInput
					value={searchKey}
					placeholder="Search fans"
					onChangeText={(val) => setSearchKey(val)}
					icon={
						<FypSvg
							svg={SearchSvg}
							width={13.14}
							height={13.26}
							color="fans-black dark:fans-white"
						/>
					}
					customStyles="pl-11"
				/>

				<ScrollView
					style={tw.style("max-h-[480px]")}
					onScroll={({ nativeEvent }) => onScrollView(nativeEvent)}
					scrollEventThrottle={16}
					showsVerticalScrollIndicator
					showsHorizontalScrollIndicator={false}
				>
					<View style={tw.style("mt-3")}>
						{fanUsers.fans.map((user) => (
							<IndividualFan key={user.id} data={user} />
						))}
					</View>
				</ScrollView>
			</View>
		</View>
	);
};

export default AnalyzeFansLevelsContents;
