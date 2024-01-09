import { FypNullableView } from "@components/common/base";
import { FansText, FansView } from "@components/controls";
import { useAppContext } from "@context/useAppContext";
import tw from "@lib/tailwind";
import React, { useEffect, useState } from "react";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";
import SuggestProfile from "../../posts/suggestProfiles/suggestProfile";

const SuggestedCreators = () => {
	const { state } = useAppContext();

	const { suggestedCreators } = state.common;

	const [width, setWidth] = useState(0);
	const [page, setPage] = useState(0);
	const [pages, setPages] = useState(0);

	const offset = useSharedValue(0);

	const animatedStyles = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateX: withTiming(offset.value * width * -1, {
						duration: 500,
					}),
				},
			],
		};
	});

	const onPaginate = (index: number) => {
		offset.value = index;
		setPage(index);
	};

	useEffect(() => {
		setPages(Math.ceil(suggestedCreators.length / 3));
	}, [suggestedCreators]);

	return (
		<FansView>
			<FypNullableView visible={suggestedCreators.length > 0}>
				<FansText
					fontSize={20}
					lineHeight={27}
					style={tw.style(
						"font-semibold mb-3.5 text-fans-black dark:text-fans-white",
					)}
				>
					Suggested for you
				</FansText>
				<FansView
					position="relative"
					height={400}
					style={tw.style("overflow-hidden")}
					onLayout={(e) => {
						setWidth(e.nativeEvent.layout.width);
					}}
				>
					<Animated.View
						style={[
							tw.style("absolute top-0 flex-row"),
							animatedStyles,
						]}
					>
						{[...Array(pages)].map((el, index) => (
							<FypNullableView visible={width > 0} key={index}>
								<FansView gap={10} width={width}>
									{suggestedCreators
										.slice(index * 3, (index + 1) * 3)
										.map((creator) => (
											<SuggestProfile
												key={creator.id}
												data={creator}
											/>
										))}
								</FansView>
							</FypNullableView>
						))}
					</Animated.View>
				</FansView>
				<FansView
					margin={{ t: 22 }}
					flexDirection="row"
					alignItems="center"
					justifyContent="center"
					gap={8}
				>
					{[...Array(pages)].map((el, index) => (
						<FansView
							key={index}
							width={8}
							height={8}
							borderRadius={8}
							style={tw.style(
								index === page
									? "w-3 h-3 bg-fans-black dark:bg-fans-white"
									: "bg-fans-grey dark:bg-fans-grey-43",
							)}
							pressableProps={{
								onPress: () => onPaginate(index),
							}}
						></FansView>
					))}
				</FansView>
			</FypNullableView>
		</FansView>
	);
};

export default SuggestedCreators;
