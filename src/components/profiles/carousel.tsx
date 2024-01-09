import { ChevronLeftSvg, ChevronRightSvg } from "@assets/svgs/common";
import { FypLinearGradientView, FypSvg } from "@components/common/base";
import { FansIconButton } from "@components/controls";
import { cdnURL } from "@helper/Utils";
import tw from "@lib/tailwind";
import React, { FC, Fragment, useRef, useState } from "react";
import { Image, Platform, View, useWindowDimensions } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import type { ICarouselInstance } from "react-native-reanimated-carousel";
import Carousel from "react-native-reanimated-carousel";

interface Props {
	images: string[];
}

const ProfileCarousel: FC<Props> = (props) => {
	const { images } = props;

	const carouselRef = useRef<ICarouselInstance>(null);
	const [imgIndex, setImgIndex] = useState(0);

	const [width, setWidth] = useState(0);
	const offset = useSharedValue(0);
	const { width: screenWidth } = useWindowDimensions();

	const customSpringStyles = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateX: withSpring(offset.value * width * -1, {
						damping: 90,
						stiffness: 90,
					}),
				},
			],
		};
	});

	const handlePrev = () => {
		if (Platform.OS === "ios" || Platform.OS === "android") {
			carouselRef.current?.prev();
		} else {
			setImgIndex(imgIndex - 1);
			offset.value = offset.value - 1;
		}
	};

	const handleNext = () => {
		if (Platform.OS === "ios" || Platform.OS === "android") {
			carouselRef.current?.next();
		} else {
			setImgIndex(imgIndex + 1);
			offset.value = offset.value + 1;
		}
	};

	return (
		<Fragment>
			{images.length === 0 ? (
				<FypLinearGradientView
					colors={["#8a49f1", "#d885ff"]}
					position="relative"
					borderRadius={{ b: 15 }}
					style={tw.style("h-[210px] md:h-[230px]")}
				/>
			) : (
				<View
					style={tw.style(
						"relative h-[210px] md:h-[230px] rounded-b-[15px]",
					)}
					onLayout={(e) => {
						setWidth(e.nativeEvent.layout.width);
					}}
				>
					{Platform.OS === "web" && width > 0 ? (
						<View
							style={[
								tw.style("relative h-full"),
								{ overflow: "hidden" },
							]}
						>
							<Animated.View
								style={[
									tw.style("absolute flex-row top-0"),
									customSpringStyles,
								]}
							>
								{images.map((uri, index) => (
									<Image
										source={{
											uri: cdnURL(uri),
										}}
										key={index}
										style={[
											tw.style(
												"h-[210px] md:h-[230px] rounded-b-[15px]",
											),
											{
												width: width,
											},
										]}
									/>
								))}
							</Animated.View>
						</View>
					) : null}
					{(Platform.OS === "ios" || Platform.OS === "android") && (
						<Carousel
							loop={false}
							ref={carouselRef}
							width={screenWidth}
							height={210}
							style={tw.style("h-full")}
							autoPlay={false}
							data={images}
							scrollAnimationDuration={1000}
							onScrollEnd={(index) => setImgIndex(index)}
							renderItem={({ item, index }) => (
								<View style={tw.style("h-full")} key={index}>
									<Image
										source={{
											uri: cdnURL(item),
										}}
										style={tw.style(
											"w-full h-full rounded-b-[15px]",
										)}
									/>
								</View>
							)}
						/>
					)}
					{images.length > 1 && imgIndex !== 0 ? (
						<FansIconButton
							size={25}
							onPress={handlePrev}
							backgroundColor="bg-fans-black/30 dark:bg-fans-white/30"
							style={tw.style(
								"absolute right-15 bottom-[18px] z-10",
							)}
						>
							<FypSvg
								svg={ChevronLeftSvg}
								height={15.28}
								width={9.14}
								color="fans-white dark:fans-black"
							/>
						</FansIconButton>
					) : null}

					{images.length > 1 && imgIndex !== images.length - 1 ? (
						<FansIconButton
							size={25}
							onPress={handleNext}
							backgroundColor="bg-fans-black/30 dark:bg-fans-white/30"
							style={tw.style(
								"absolute right-[18px] bottom-[18px] z-10",
							)}
						>
							<FypSvg
								svg={ChevronRightSvg}
								height={15.28}
								width={9.14}
								color="fans-white dark:fans-black"
							/>
						</FansIconButton>
					) : null}
				</View>
			)}
		</Fragment>
	);
};

export default ProfileCarousel;
