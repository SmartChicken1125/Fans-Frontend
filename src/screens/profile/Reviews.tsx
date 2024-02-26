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
import { getReviews } from "@helper/endpoints/Review";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileNavigationStacks } from "@usertypes/navigations";
import { IReview } from "@usertypes/types";
import React, { useEffect, useState } from "react";

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

const ReviewsScreen = (
	props: NativeStackScreenProps<ProfileNavigationStacks, "Reviews">,
) => {
	const [strType, setTypeValue] = useState("All");
	const [objRatings, setRatings] = useState<IReview[]>([]);

	useEffect(() => {
		fetchReviews();
	}, []);

	const fetchReviews = async () => {
		const res = await getReviews();
		if (res.ok) {
			setRatings(res.data.reviews);
		}
	};

	return (
		<FansScreen4 contentStyle1={{ background: "grey-f0", grow: true }}>
			<FansText fontFamily="inter-semibold" fontSize={17}>
				Reviews ({objRatings.length})
			</FansText>
			<FansGap height={15} />
			<FansTextInput6
				textInputStyle={{ placeholder: "Search" }}
				iconNode={
					<FansSvg width={13.1} height={13.3} svg={Search1Svg} />
				}
			/>
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
				gap={9}
				grow
				margin={{ x: -17 }}
				padding={{ x: 17, y: 19 }}
			>
				{objRatings.map((rating, index) => {
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
										{rating.creator.displayName}
									</FansText>
									<FansText color="grey-43" fontSize={14}>
										a month ago
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
		</FansScreen4>
	);
};

export default ReviewsScreen;
