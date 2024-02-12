import {
	CloseSvg,
	Dollar5Svg,
	ShopSvg,
	CursorSvg,
	ChatSvg,
	ArrowUpSvg,
} from "@assets/svgs/common";
import UserAvatar from "@components/avatar/UserAvatar";
import {
	FypSvg,
	FypText,
	FypLinearGradientView,
} from "@components/common/base";
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

interface AnalyticItemProps {
	title: string;
	value: string;
	icon: React.ReactNode;
}

const AnalyticItem: FC<AnalyticItemProps> = (props) => {
	const { title, value, icon } = props;
	return (
		<FansView position="relative" flex="1">
			<FypText
				fontSize={23}
				lineHeight={26}
				fontWeight={600}
				style={tw.style(
					"md:mb-[3px] text-fans-grey-48 dark:text-fans-grey-b1",
				)}
			>
				{title}
			</FypText>
			<FansView
				flexDirection="row"
				alignItems="center"
				gap={12}
				margin={{ b: 8 }}
			>
				{icon}
				<FypText
					fontSize={34}
					lineHeight={46}
					fontWeight={600}
					style={tw.style("text-fans-green dark:text-fans-green-29")}
				>
					{value}
				</FypText>
			</FansView>
			<FansView flexDirection="row" alignItems="center">
				<FypSvg
					svg={ArrowUpSvg}
					width={13}
					height={11}
					color="fans-green"
				/>
				<FypText
					fontSize={16}
					lineHeight={21}
					style={tw.style("text-fans-green ml-2")}
				>
					$0.8 (0.5%)
				</FypText>
				<FansView
					width={4}
					height={4}
					borderRadius={4}
					margin={{ l: 16, r: 8 }}
					style={tw.style("bg-fans-grey-48 dark:bg-fans-grey-b1")}
				></FansView>
				<FypText
					fontSize={14}
					lineHeight={19}
					style={tw.style("text-fans-grey-48 dark:text-fans-grey-b1")}
				>
					Past day
				</FypText>
			</FansView>
		</FansView>
	);
};

const HeaderSection = () => {
	const onDismiss = () => {};

	return (
		<FansView>
			<FansView position="relative" padding={{ y: 20 }}>
				<FypText
					fontSize={{ xs: 19, md: 23 }}
					lineHeight={{ xs: 26, md: 31 }}
					fontWeight={700}
					textAlign="center"
					numberOfLines={2}
					style={tw.style("w-4/5 mx-auto")}
				>
					Summer photoshoot: Poll time with Elizabeth!
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
			<FansDivider style={tw.style("hidden md:flex mb-[34px]")} />
			<FansView
				style={tw.style(
					"flex-col md:flex-row md:justify-content-between md:gap-0",
				)}
			>
				<AnalyticItem
					title={
						tw.prefixMatch("md")
							? `Total${"\n"}revenue`
							: "Total revenue"
					}
					value="$0"
					icon={
						<FypSvg
							svg={Dollar5Svg}
							width={21}
							height={23}
							color="fans-green"
							style={tw.style("md:hidden")}
						/>
					}
				/>
				<FansDivider style={tw.style("md:hidden mt-4 mb-3")} />
				<AnalyticItem
					title={
						tw.prefixMatch("md")
							? `Total${"\n"}purchases`
							: "Total purchases"
					}
					value="54"
					icon={
						<FypSvg
							svg={ShopSvg}
							width={21}
							height={26}
							color="fans-green"
							style={tw.style("md:hidden")}
						/>
					}
				/>
				<FansDivider style={tw.style("md:hidden mt-4 mb-3")} />
				<AnalyticItem
					title={
						tw.prefixMatch("md")
							? `Click through${"\n"}rate`
							: "Click through rate"
					}
					value="54"
					icon={
						<FypSvg
							svg={CursorSvg}
							width={21}
							height={26}
							color="fans-green"
							style={tw.style("md:hidden")}
						/>
					}
				/>
			</FansView>
		</FansView>
	);
};

interface ITimeline {
	date: string;
	earnings: number;
}

interface GraphSectionProps {
	post?: AnalyticsIPost;
}

export const GraphSection: FC<GraphSectionProps> = (props) => {
	const { post } = props;
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
		<FansView style={tw.style("pt-8 md:pt-12 pb-8 md:pb-16")}>
			<LineChart
				timeline={timeline}
				duration={duration}
				setDuration={setDuration}
				period={period}
				labelTheme="black"
			/>
		</FansView>
	);
};

interface FansSectionProps {
	handleOpenMessage: (fanId: string) => void;

	post?: AnalyticsIPost;
}

export const FansSection: FC<FansSectionProps> = (props) => {
	const { post, handleOpenMessage } = props;
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
		<FansView padding={{ y: 18 }}>
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
								<UserAvatar size="34px" image={fan.avatar} />
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
								<FypLinearGradientView
									colors={["#24A2FF", "#23C9B1", "#89F276"]}
									start={[0, 1]}
									end={[1, 0]}
									alignItems="center"
									justifyContent="center"
									borderRadius={26}
									margin={{ t: 7 }}
									height={26}
									padding={{ x: 13 }}
									style={tw.style("min-w-[55px]")}
								>
									<FypText
										fontSize={14}
										fontWeight={600}
										style={tw.style("text-fans-white")}
									>
										$100
									</FypText>
								</FypLinearGradientView>
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

	const { height } = useWindowDimensions();
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
			<ScrollView
				style={tw.style(
					!tw.prefixMatch("md") && `max-h-[${height * 0.8}px]`,
				)}
			>
				<FansView style={tw.style("px-[18px] md:px-[34px]")}>
					<HeaderSection />
					<FansView
						margin={{ t: 35 }}
						padding={{ b: 14 }}
						flexDirection="row"
						alignItems="center"
						justifyContent="center"
						style={tw.style(
							"gap-[90px] md:gap-[180px] border-b border-fans-grey-f0 dark:border-fans-grey-43",
						)}
					>
						<FansView
							position="relative"
							pressableProps={{
								onPress: () => setTab("graph"),
							}}
						>
							<FypText
								fontSize={17}
								fontWeight={tab === "graph" ? 600 : 500}
								style={tw.style(
									tab === "graph"
										? "text-fans-black dark:text-fans-white"
										: "text-fans-grey-48 dark:text-fans-grey-b1",
								)}
							>
								Graph
							</FypText>
							{tab === "graph" ? (
								<FansView
									position="absolute"
									width="full"
									height={2}
									left={0}
									bottom={-15}
									style={tw.style("bg-fans-green")}
									borderRadius={2}
								></FansView>
							) : null}
						</FansView>
						<FansView
							position="relative"
							pressableProps={{
								onPress: () => setTab("fans"),
							}}
						>
							<FypText
								fontSize={17}
								fontWeight={tab === "fans" ? 600 : 500}
								style={tw.style(
									tab === "fans"
										? "text-fans-black dark:text-fans-white"
										: "text-fans-grey-48 dark:text-fans-grey-b1",
								)}
							>
								Purchases
							</FypText>
							{tab === "fans" ? (
								<FansView
									position="absolute"
									width="full"
									height={2}
									left={0}
									bottom={-15}
									borderRadius={2}
									style={tw.style("bg-fans-green")}
								></FansView>
							) : null}
						</FansView>
					</FansView>
					{tab === "graph" ? (
						<GraphSection post={post} />
					) : (
						<FansSection
							post={post}
							handleOpenMessage={handleOpenMessage}
						/>
					)}
				</FansView>
			</ScrollView>
		</BottomSheetWrapper>
	);
};

export default PostAnalyticsModal;
