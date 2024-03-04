import { Search1Svg, SortAscSvg, Star2Svg } from "@assets/svgs/common";
import {
	RatingStar1Svg,
	RatingStar2Svg,
	RatingStar3Svg,
	RatingStar4Svg,
	RatingStar5Svg,
} from "@assets/svgs/common/Rating";
import UserAvatar from "@components/avatar/UserAvatar";
import {
	FansChips4,
	FansGap,
	FansScreen4,
	FansSvg,
	FansText,
	FansTextInput6,
	FansView,
} from "@components/controls";
import { getReviews } from "@helper/endpoints/review/apis";
import { ReviewsRespBody } from "@helper/endpoints/review/schemas";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFeatureGates } from "@state/featureGates";
import { ProfileNavigationStacks } from "@usertypes/navigations";
import { getAgoTime } from "@utils/common";
import React, { useEffect, useState } from "react";
import { NativeScrollEvent, ScrollView } from "react-native";

const Rating = (props: { score: number }) => {
	const { score } = props;
	return (
		<>
			<FansSvg
				width={19.8}
				height={18.9}
				svg={score > 0 ? RatingStar1Svg : Star2Svg}
				color1="grey-f0"
			/>
			<FansSvg
				width={19.8}
				height={18.9}
				svg={score > 1 ? RatingStar2Svg : Star2Svg}
				color1="grey-f0"
			/>
			<FansSvg
				width={19.8}
				height={18.9}
				svg={score > 2 ? RatingStar3Svg : Star2Svg}
				color1="grey-f0"
			/>
			<FansSvg
				width={19.8}
				height={18.9}
				svg={score > 3 ? RatingStar4Svg : Star2Svg}
				color1="grey-f0"
			/>
			<FansSvg
				width={19.8}
				height={18.9}
				svg={score > 4 ? RatingStar5Svg : Star2Svg}
				color1="grey-f0"
			/>
		</>
	);
};

const SCROLL_SIZE = 10;

const ReviewsScreen = (
	props: NativeStackScreenProps<ProfileNavigationStacks, "Reviews">,
) => {
	const featureGates = useFeatureGates();

	const [strType, setTypeValue] = useState("All");
	const [searchKey, setSearchKey] = useState("");
	const [inLoadingMore, setInLoadingMore] = useState(false);
	const [reviews, setReviews] = useState<ReviewsRespBody>({
		page: 1,
		size: SCROLL_SIZE,
		total: 0,
		reviews: [],
	});

	const fetchReviews = async (page: number) => {
		const filterObject = {
			page: page,
			size: SCROLL_SIZE,
			query: searchKey,
		};

		const resp = await getReviews(filterObject);
		setInLoadingMore(false);
		if (resp.ok) {
			setReviews({
				...resp.data,
				reviews:
					resp.data.page === 1
						? resp.data.reviews
						: [...reviews.reviews, ...resp.data.reviews],
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
			reviews.total > SCROLL_SIZE * reviews.page
		) {
			setInLoadingMore(true);
			fetchReviews(reviews.page + 1);
		}
	};

	useEffect(() => {
		fetchReviews(1);
	}, [searchKey]);

	return (
		<FansScreen4 contentStyle1={{ background: "grey-f0", grow: true }}>
			<FansText fontFamily="inter-semibold" fontSize={17}>
				Reviews ({reviews.reviews.length})
			</FansText>
			<FansGap height={15} />
			<FansTextInput6
				textInputStyle={{ placeholder: "Search" }}
				iconNode={
					<FansSvg width={13.1} height={13.3} svg={Search1Svg} />
				}
			/>
			{featureGates.has("2024_02-review-type") && (
				<>
					<FansGap height={15} />
					<FansView>
						<FansChips4
							data={[
								{ text: "All" },
								{ text: "Profile" },
								{ text: "Video calls" },
								{ text: "Custom" },
							]}
							value={strType}
							onChangeValue={setTypeValue}
						/>
					</FansView>
				</>
			)}
			<FansGap height={23} />
			<FansView flexDirection="row" gap={13}>
				<FansSvg width={16.8} height={14} svg={SortAscSvg} />
				<FansText fontFamily="inter-medium" fontSize={17}>
					Oldest first
				</FansText>
			</FansView>
			<FansGap height={23} />

			<FansView
				backgroundColor="grey-f0"
				grow
				margin={{ x: -17 }}
				padding={{ x: 17, y: 19 }}
			>
				<ScrollView
					style={tw.style("max-h-[480px]")}
					onScroll={({ nativeEvent }) => onScrollView(nativeEvent)}
					scrollEventThrottle={16}
					showsVerticalScrollIndicator
					showsHorizontalScrollIndicator={false}
				>
					<FansView gap={9}>
						{reviews.reviews.map((rating, index) => {
							return (
								<FansView
									key={index}
									backgroundColor="white"
									borderRadius={15}
									padding={{ t: 17, r: 20, b: 21, l: 18 }}
								>
									<FansView flexDirection="row" gap={13}>
										<UserAvatar size="34px" />
										<FansView>
											<FansText
												fontFamily="inter-semibold"
												fontSize={16}
											>
												{rating.user.displayName}
											</FansText>
											<FansText
												color="grey-43"
												fontSize={14}
											>
												{getAgoTime(rating.createdAt)}
											</FansText>
										</FansView>
									</FansView>
									<FansGap height={24.6} />
									<FansView flexDirection="row" gap={7.4}>
										<Rating score={rating.score} />
									</FansView>
									<FansGap height={21.5} />
									<FansText color="grey-43" fontSize={16}>
										{rating.text}
									</FansText>
								</FansView>
							);
						})}
					</FansView>
				</ScrollView>
			</FansView>
		</FansScreen4>
	);
};

export default ReviewsScreen;
