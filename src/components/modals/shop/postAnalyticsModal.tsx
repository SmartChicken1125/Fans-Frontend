import {
	CloseSvg,
	Dollar5Svg,
	ShopSvg,
	CursorSvg,
	ChevronLeftSvg,
	ChatSvg,
} from "@assets/svgs/common";
import UserAvatar from "@components/avatar/UserAvatar";
import { FypSvg, FypText } from "@components/common/base";
import BottomSheetWrapper from "@components/common/bottomSheetWrapper";
import SearchTextInput from "@components/common/searchTextInput";
import { FansIconButton, FansDivider, FansView } from "@components/controls";
import { LineChart } from "@components/screens/settings/analytics";
import {
	getPaidPostEarnings,
	getPaidPostPurchasedAnalytics,
} from "@helper/endpoints/creator/apis";
import tw from "@lib/tailwind";
import { AnalyticsIPost, IUserInfo } from "@usertypes/types";
import { DateTime } from "luxon";
import React, { FC, useState, useEffect } from "react";
import { ScrollView, useWindowDimensions } from "react-native";

interface ITimeline {
	date: string;
	earnings: number;
}

interface GraphSectionProps {
	handleOpenMessage: (fanId: string) => void;
	onDismiss: () => void;
	handlePressViewFans: () => void;
	post?: AnalyticsIPost;
}

export const GraphSection: FC<GraphSectionProps> = (props) => {
	const { post, onDismiss, handlePressViewFans } = props;
	const { height } = useWindowDimensions();
	const [timeline, setTimeline] = useState<ITimeline[]>([]);
	const [period, setPeriod] = useState("today");
	const [duration, setDuration] = useState("Today");
	const [earnings, setEarnings] = useState(0);
	const [purchases, setPurchases] = useState(0);

	useEffect(() => {
		if (!post?.id) return;

		const fetchPaidPostEarnings = async () => {
			let startDate: DateTime | undefined;
			let endDate: DateTime | undefined;

			switch (duration) {
				case "Today":
					startDate = DateTime.local();
					endDate = DateTime.local();
					break;
				case "1W":
					startDate = DateTime.local().minus({ weeks: 1 });
					endDate = DateTime.local();
					break;
				case "1M":
					startDate = DateTime.local().minus({ months: 1 });
					endDate = DateTime.local();
					break;
				case "3M":
					startDate = DateTime.local().minus({ months: 3 });
					endDate = DateTime.local();
					break;
				case "6M":
					startDate = DateTime.local().minus({ months: 6 });
					endDate = DateTime.local();
					break;
				case "1Y":
					startDate = DateTime.local().minus({ years: 1 });
					endDate = DateTime.local();
					break;
				case "All":
					break;
			}

			const resp = await getPaidPostEarnings({
				postId: post.id,
				startDate: startDate?.toISO() ?? undefined,
				endDate: endDate?.toISO() ?? undefined,
			});
			if (resp.ok) {
				setPeriod(resp.data.period);
				setEarnings(resp.data.earnings);
				setPurchases(resp.data.purchases);
				setTimeline(resp.data.timeline);
			}
		};

		fetchPaidPostEarnings();
	}, [post, duration]);

	return (
		<ScrollView
			style={tw.style(
				!tw.prefixMatch("md") && `max-h-[${height * 0.8}px]`,
			)}
		>
			<FansView
				style={tw.style("md:pt-5 px-[18px] md:px-8 pb-1 md:pb-9")}
			>
				<FansView
					position="relative"
					style={tw.style("mb-6 md:mb-5 md:px-8")}
				>
					<FypText
						fontSize={{ xs: 19, md: 23 }}
						lineHeight={{ xs: 26, md: 31 }}
						fontWeight={700}
						textAlign="center"
					>
						{post?.title}
					</FypText>
					<FansIconButton
						backgroundColor="bg-fans-black/30 dark:bg-fans-white/30"
						size={30}
						onPress={onDismiss}
						style={[
							tw.style("absolute right-0 top-1/2 hidden md:flex"),
							{ transform: [{ translateY: -15 }] },
						]}
					>
						<FypSvg
							svg={CloseSvg}
							width={12}
							height={12}
							color="fans-white dark:fans-black"
						/>
					</FansIconButton>
				</FansView>
				<FansDivider style={tw.style("mb-[34px] hidden md:flex")} />
				<FansView
					style={tw.style(
						"flex-col md:flex-row md:justify-content-between gap-3 md:gap-0",
						"mb-11 md:mb-2",
					)}
				>
					<FansView position="relative" flex="1">
						<FypText
							fontSize={23}
							lineHeight={26}
							fontWeight={600}
							style={tw.style("md:mb-[3px]")}
						>
							{tw.prefixMatch("md")
								? `Total${"\n"}revenue`
								: "Total revenue"}
						</FypText>
						<FypText
							fontSize={34}
							lineHeight={46}
							fontWeight={600}
							style={tw.style(
								"text-fans-green dark:text-fans-green-29",
							)}
						>
							${earnings}
						</FypText>
						<FypSvg
							svg={Dollar5Svg}
							width={21}
							height={23}
							color="fans-black dark:fans-white"
							style={tw.style("absolute top-2 right-0 md:hidden")}
						/>
						<FansDivider style={tw.style("md:hidden mt-4")} />
					</FansView>
					<FansView position="relative" flex="1">
						<FypText
							fontSize={23}
							lineHeight={26}
							fontWeight={600}
							style={tw.style("md:mb-[3px]")}
						>
							{tw.prefixMatch("md")
								? `Total${"\n"}purchases`
								: "Total purchases"}
						</FypText>
						<FypText
							fontSize={34}
							lineHeight={46}
							fontWeight={600}
							style={tw.style(
								"text-fans-green dark:text-fans-green-29",
							)}
						>
							{purchases}
						</FypText>
						<FypSvg
							svg={ShopSvg}
							width={21}
							height={26}
							color="fans-black dark:fans-white"
							style={tw.style("absolute top-2 right-0 md:hidden")}
						/>
						<FansDivider style={tw.style("md:hidden mt-4")} />
					</FansView>
					{/* <FansView position="relative" flex="1">
						<FypText
							fontSize={23}
							lineHeight={26}
							fontWeight={600}
							style={tw.style("md:mb-[3px]")}
						>
							{tw.prefixMatch("md")
								? `Click through${"\n"}rate`
								: "Click through rate"}
						</FypText>
						<FypText
							fontSize={34}
							lineHeight={46}
							fontWeight={600}
							style={tw.style(
								"text-fans-green dark:text-fans-green-29",
							)}
						>
							54
						</FypText>
						<FypSvg
							svg={CursorSvg}
							width={21}
							height={26}
							color="fans-black dark:fans-white"
							style={tw.style("absolute top-2 right-0 md:hidden")}
						/>
					</FansView> */}
				</FansView>
				<FansView margin={{ b: 32 }}>
					<LineChart
						timeline={timeline}
						duration={duration}
						setDuration={setDuration}
						period={period}
						labelTheme="black"
					/>
				</FansView>
				<FansView
					height={34}
					gap={12}
					flexDirection="row"
					alignItems="center"
					borderRadius={34}
					justifyContent="center"
					style={tw.style(
						"w-full md:w-[310px] md:mx-auto border",
						"border-fans-green dark:border-fans-green-29",
					)}
					pressableProps={{
						onPress: handlePressViewFans,
					}}
				>
					<FypSvg
						svg={ShopSvg}
						width={10}
						height={12}
						color="fans-green dark:fans-green-29"
					/>
					<FypText
						fontSize={17}
						lineHeight={22}
						fontWeight={600}
						style={tw.style(
							"text-fans-green dark:text-fans-green-29",
						)}
					>
						View purchased
					</FypText>
				</FansView>
			</FansView>
		</ScrollView>
	);
};

interface FansSectionProps {
	handleOpenMessage: (fanId: string) => void;
	handlePrev: () => void;
	post?: AnalyticsIPost;
}

export const FansSection: FC<FansSectionProps> = (props) => {
	const { post, handlePrev, handleOpenMessage } = props;
	const [fans, setFans] = useState<IUserInfo[]>([]);

	const [searchQuery, setSearchQuery] = useState("");

	const handleSearch = (val: string) => {};

	useEffect(() => {
		if (!post?.id) return;

		const fetchFans = async () => {
			const resp = await getPaidPostPurchasedAnalytics({
				postId: post.id,
			});
			if (resp.ok) {
				setFans(resp.data.fans);
			}
		};

		fetchFans();
	}, [post]);

	return (
		<FansView style={tw.style("md:pt-5 px-[18px] md:px-8 pb-1 md:pb-9")}>
			<FansView position="relative" margin={{ b: 38 }}>
				<FypText
					fontSize={{ xs: 19, md: 23 }}
					lineHeight={{ xs: 26, md: 31 }}
					fontWeight={700}
					textAlign="center"
				>
					Purchased
				</FypText>
				<FansIconButton
					size={30}
					backgroundColor="bg-transparent"
					style={[
						tw.style("absolute top-1/2 left-0"),
						{ transform: [{ translateY: -15 }] },
					]}
					onPress={handlePrev}
				>
					<FypSvg
						svg={ChevronLeftSvg}
						width={7}
						height={13}
						color="fans-grey-70 dark:fans-grey-b1"
					/>
				</FansIconButton>
			</FansView>
			<SearchTextInput value={searchQuery} onChangeText={handleSearch} />
			<FansView margin={{ t: 26 }}>
				<FansView>
					{fans.map((fan) => (
						<FansView>
							<FansView
								flexDirection="row"
								alignItems="center"
								padding={{ y: 12 }}
							>
								<UserAvatar size="46px" image={fan.avatar} />
								<FypText
									fontSize={19}
									fontWeight={700}
									lineHeight={26}
									margin={{ x: 13 }}
									style={tw.style("flex-1")}
									numberOfLines={1}
								>
									{fan.username}
								</FypText>
								<FansIconButton
									size={34}
									backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
									onPress={() => handleOpenMessage(fan.id)}
								>
									<FypSvg
										svg={ChatSvg}
										width={17}
										height={17}
										color="fans-black dark:fans-white"
									/>
								</FansIconButton>
							</FansView>
							{fans.length > 1 && <FansDivider />}
						</FansView>
					))}
				</FansView>
			</FansView>
		</FansView>
	);
};

interface Props {
	visible: boolean;
	onDismiss: () => void;
	showFans?: boolean;
	post?: AnalyticsIPost;
	handleOpenMessage: (fanId: string) => void;
}

const PostAnalyticsModal: FC<Props> = (props) => {
	const { visible, onDismiss, showFans, post, handleOpenMessage } = props;

	const [tab, setTab] = useState<"graph" | "fans">("graph");

	useEffect(() => {
		setTab(showFans ? "fans" : "graph");
	}, [showFans]);

	return (
		<BottomSheetWrapper
			open={visible}
			onClose={onDismiss}
			dialogWrapperStyle="md:max-w-[700px] md:w-[700px]"
			hideTopLine={tw.prefixMatch("md")}
		>
			{tab === "graph" ? (
				<GraphSection
					onDismiss={onDismiss}
					handlePressViewFans={() => setTab("fans")}
					post={post}
					handleOpenMessage={handleOpenMessage}
				/>
			) : (
				<FansSection
					handlePrev={() => setTab("graph")}
					post={post}
					handleOpenMessage={handleOpenMessage}
				/>
			)}
		</BottomSheetWrapper>
	);
};

export default PostAnalyticsModal;
