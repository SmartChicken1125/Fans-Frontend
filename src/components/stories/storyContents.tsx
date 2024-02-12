import { FansText, FansView } from "@components/controls";
import LinkPreviewCard from "@components/posts/postModal/linkPreviewCard";
import { cdnURL } from "@helper/Utils";
import { getLinkPreview } from "@helper/endpoints/stories/apis";
import { LinkPreviewRespBody } from "@helper/endpoints/stories/schemas";
import tw from "@lib/tailwind";
import { IStory } from "@usertypes/types";
import { openURL } from "expo-linking";
import { useRouter } from "expo-router";
import React, { FC, useEffect, useRef, useState } from "react";
import { Image, Platform, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import type { ICarouselInstance } from "react-native-reanimated-carousel";
import Carousel from "react-native-reanimated-carousel";

interface Props {
	stories: IStory[];
	storyIndex: number;
	loading?: boolean;
	onChangeStoryIndex: (index: number) => void;
	onPrev: () => void;
	onNext: () => void;
	onClose: () => void;
}

const StoryContents: FC<Props> = (props) => {
	const {
		stories,
		onChangeStoryIndex,
		storyIndex,
		loading,
		onPrev,
		onNext,
		onClose,
	} = props;
	const carouselRef = useRef<ICarouselInstance>(null);
	const router = useRouter();

	const [width, setWidth] = useState(0);
	const [imgHeight, setImgHeight] = useState(0);

	const offset = useSharedValue(0);
	const positionX = useSharedValue(0);
	const positionY = useSharedValue(0);

	const animationStyles = useAnimatedStyle(() => {
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

	const panGesture = Gesture.Pan()
		.onBegin((e) => {
			positionX.value = e.translationX;
			positionY.value = e.translationY;
		})
		.onEnd((e) => {
			const disX = Math.abs(e.translationX - positionX.value);
			const disY = Math.abs(e.translationY - positionY.value);
			if (disX > disY) {
				if (positionX.value < e.translationX) {
					onPrev();
				} else {
					onNext();
				}
			} else {
				if (e.translationY > positionY.value) {
					onClose();
				}
			}
		});

	useEffect(() => {
		offset.value = storyIndex;
		if (Platform.OS !== "web") {
			carouselRef.current?.scrollTo({ index: storyIndex });
		}
	}, [storyIndex]);

	const [linkPreviews, setLinkPreviews] = useState<{
		[key: string]: LinkPreviewRespBody;
	}>({});

	useEffect(() => {
		(async () => {
			await Promise.all(
				stories
					.flatMap((story) => story.storyUrls)
					.map((url) => url.url)
					.filter((link) => !linkPreviews[link])
					.map(async (link) => {
						const res = await getLinkPreview({ link: link });

						const updated = linkPreviews;
						if (res.data.code) {
							updated[link] = {
								url: link,
								mediaType: "text",
								contentType: "text/html",
							};
						} else {
							updated[link] = res.data as LinkPreviewRespBody;
						}

						setLinkPreviews(updated);
					}),
			);
		})();
	}, [stories]);

	return (
		<View
			style={tw.style("flex-1 relative")}
			onLayout={(e) => {
				setImgHeight(e.nativeEvent.layout.height);
				setWidth(e.nativeEvent.layout.width);
			}}
		>
			{Platform.OS === "web" && (
				<GestureDetector gesture={panGesture}>
					<View
						style={tw.style(
							"flex-1 relative overflow-hidden md:rounded-[15px]",
						)}
					>
						<Animated.View
							style={[
								tw.style("absolute flex-row top-0 h-full"),
								animationStyles,
							]}
						>
							{stories.map((story, index) => (
								<View
									key={index}
									style={[
										{ width: width },
										tw.style("h-full"),
									]}
								>
									{storyIndex === index ? (
										<Image
											source={{
												uri: cdnURL(story.media),
											}}
											style={[
												tw.style(
													"h-full md:rounded-[15px]",
												),
											]}
										/>
									) : null}

									{storyIndex === index &&
										story.storyTexts.map((storyText) => (
											<FansView
												style={tw.style(
													"absolute left-[20px] right-[20px] top-[110px] bottom-[110px]",
												)}
											>
												<FansText
													style={[
														tw.style(
															`font-${storyText.font}`,
															"text-[28px] text-center",
															"w-full mt-auto mb-auto",
														),
														{
															color: `#${storyText.color.substring(
																2,
															)}`,
														},
													]}
												>
													{storyText.text}
												</FansText>
											</FansView>
										))}

									{storyIndex === index &&
										story.storyUrls.map((storyUrl) => (
											<TouchableOpacity
												style={tw.style(
													"absolute w-[245px] h-[85px] bg-black bg-opacity-75 rounded-[7px] left-[60px] top-[160px]",
												)}
												onPress={() => {
													openURL(storyUrl.url);
												}}
											>
												<LinkPreviewCard
													preview={
														linkPreviews[
															storyUrl.url
														] ?? {
															url: storyUrl.url,
														}
													}
													isListItem={false}
												/>
											</TouchableOpacity>
										))}

									{storyIndex === index &&
										story.storyTags.map((storyTag) => (
											<FansView
												style={tw.style(
													"absolute left-[20px] right-[20px] top-[600px]",
												)}
											>
												<TouchableOpacity
													style={tw.style(
														"ml-auto mr-auto mt-auto mb-auto",
													)}
													onPress={() =>
														router.push(
															`/${storyTag.creator.profileLink}`,
														)
													}
												>
													<FansText
														style={[
															tw.style(
																"font-inter-medium",
																`text-[${
																	tw.prefixMatch(
																		"md",
																	)
																		? "22px"
																		: "28px"
																}]`,
																"pt-[4px] pb-[8px] pl-[23px] pr-[31px]",
																"rounded-full",
															),
															{
																color: "white",
																backgroundColor: `#${storyTag.color.substring(
																	2,
																)}`,
															},
														]}
													>
														@
														{
															storyTag.creator
																.displayName
														}
													</FansText>
												</TouchableOpacity>
											</FansView>
										))}
								</View>
							))}
						</Animated.View>
					</View>
				</GestureDetector>
			)}
			{(Platform.OS === "ios" || Platform.OS === "android") && (
				<Carousel
					loop={false}
					ref={carouselRef}
					width={width}
					height={imgHeight}
					style={tw.style("h-full")}
					autoPlay={false}
					data={stories}
					scrollAnimationDuration={1000}
					onScrollEnd={(index) => onChangeStoryIndex(index)}
					renderItem={({ item, index }) => (
						<View style={tw.style("h-full")} key={index}>
							<Image
								source={{
									uri: cdnURL(item.media),
								}}
								style={tw.style("w-full h-full")}
							/>
						</View>
					)}
				/>
			)}
			<ActivityIndicator
				animating={true}
				color="#fff"
				style={[
					tw.style("absolute top-1/2 left-1/2", !loading && "hidden"),
					{
						transform: [{ translateX: -12 }, { translateY: -12 }],
					},
				]}
			/>
		</View>
	);
};

export default StoryContents;
