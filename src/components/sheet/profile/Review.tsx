import { Star2Svg } from "@assets/svgs/common";
import { RatingStar1Svg } from "@assets/svgs/common/Rating";
import UserAvatar from "@components/avatar/UserAvatar";
import {
	FansButton3,
	FansGap,
	FansSheet2,
	FansSvg,
	FansText,
	FansTextInput6,
	FansView,
} from "@components/controls";
import { postReview } from "@helper/endpoints/review/apis";
import { useFeatureGates } from "@state/featureGates";
import { FansSheetProps, IFansSheet } from "@usertypes/components";
import React, { useState } from "react";

const ReviewSheet: IFansSheet = (props) => {
	const { onClose, onSubmit } = props;
	const featureGates = useFeatureGates();

	const [indexTip, setTipIndex] = useState(0);
	const [numRating, setRatingValue] = useState(0);

	const props_: FansSheetProps = {
		height: { xs: featureGates.has("2024_02-review-payment") ? 563 : 460 },
		sheetStyle: { alignItems: "stretch" },
		...props,
	};

	const handlePressSubmit = async () => {
		await postReview({
			creatorId: props.profile?.id ?? "",
			score: numRating,
			text: "review",
			tip: [0, 1, 5, 0][indexTip],
		});
		onSubmit("");
		onClose();
	};

	return (
		<FansSheet2 {...props_}>
			<FansGap height={15} />
			<FansView alignSelf="center">
				<FansText fontFamily="inter-bold" fontSize={19}>
					Review {props.profile?.displayName}'s profile
				</FansText>
			</FansView>
			<FansGap height={18} />
			<FansView alignSelf="center">
				<UserAvatar size="86px" image={props.profile?.avatar} />
			</FansView>
			<FansGap height={29.2} />
			<FansView alignSelf="center" flexDirection="row" gap={13.7}>
				<FansView
					touchableOpacityProps={{ onPress: () => setRatingValue(1) }}
				>
					<FansSvg
						width={36.5}
						height={35}
						svg={numRating > 0 ? RatingStar1Svg : Star2Svg}
						color1="grey-de"
					/>
				</FansView>
				<FansView
					touchableOpacityProps={{ onPress: () => setRatingValue(2) }}
				>
					<FansSvg
						width={36.5}
						height={35}
						svg={numRating > 1 ? RatingStar1Svg : Star2Svg}
						color1="grey-de"
					/>
				</FansView>
				<FansView
					touchableOpacityProps={{ onPress: () => setRatingValue(3) }}
				>
					<FansSvg
						width={36.5}
						height={35}
						svg={numRating > 2 ? RatingStar1Svg : Star2Svg}
						color1="grey-de"
					/>
				</FansView>
				<FansView
					touchableOpacityProps={{ onPress: () => setRatingValue(4) }}
				>
					<FansSvg
						width={36.5}
						height={35}
						svg={numRating > 3 ? RatingStar1Svg : Star2Svg}
						color1="grey-de"
					/>
				</FansView>
				<FansView
					touchableOpacityProps={{ onPress: () => setRatingValue(5) }}
				>
					<FansSvg
						width={36.5}
						height={35}
						svg={numRating > 4 ? RatingStar1Svg : Star2Svg}
						color1="grey-de"
					/>
				</FansView>
			</FansView>
			<FansGap height={26} />
			<FansTextInput6
				height={97}
				viewStyle={{ borderRadius: 15, padding: { y: 14 } }}
				textInputStyle={{
					multiline: true,
					placeholder: "Leave a review...",
				}}
			/>
			<FansGap height={39.2} />
			{featureGates.has("2024_02-review-payment") && (
				<>
					<FansText fontFamily="inter-semibold" fontSize={17}>
						Do you want to leave a tip?
					</FansText>
					<FansGap height={14.7} />
					<FansView flexDirection="row" justifyContent="between">
						{["No tip", "$1 USD", "$5 USD", "Other"].map(
							(value, index) => {
								const isActive = indexTip === index;
								return (
									<FansView
										width={84}
										height={42}
										touchableOpacityProps={{
											onPress: () => setTipIndex(index),
										}}
										alignItems="center"
										border={isActive ? 2.3 : 1}
										borderColor={
											isActive ? "purple-a8" : "grey-f0"
										}
										borderRadius={15}
										justifyContent="center"
									>
										<FansText fontSize={16}>
											{value}
										</FansText>
									</FansView>
								);
							},
						)}
					</FansView>
					<FansGap height={34} />
				</>
			)}
			<FansButton3 title="Submit" onPress={handlePressSubmit} />
		</FansSheet2>
	);
};

export default ReviewSheet;
