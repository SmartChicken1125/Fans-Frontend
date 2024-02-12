import { FypNullableView, FypText, FypVideo } from "@components/common/base";
import { cdnURL, urlOrBlurHash } from "@helper/Utils";
import tw from "@lib/tailwind";
import { MediaType, ResizeMode } from "@usertypes/commonEnums";
import React, { FC, useEffect, useId, useState } from "react";
import { Image, Platform, Pressable, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import ArrowButton from "./arrowButton";
import Badge from "./badge";
import Indicator from "./indicator";

interface Props {
	id?: string;
	width: number;
	height: number;
	medias: Array<{ url?: string; blurhash?: string; mediaType: MediaType }>;
	resizeMode: ResizeMode;
	onClickItem?: (index: number) => void;
	showBadge?: boolean;
	defaultIndex?: number;
	useButtons?: boolean;
	watermark?: string;
}

function MediaElement({
	id,
	item,
	index,
	resizeMode,
	watermark,
	setImageWidth,
	setImageHeight,
	rightPadding,
	bottomPadding,
}: {
	id: string;
	item: { url?: string; blurhash?: string; mediaType: MediaType };
	index: number;
	resizeMode: ResizeMode;
	watermark?: string;
	setImageWidth: (width: number) => void;
	setImageHeight: (height: number) => void;
	rightPadding: number;
	bottomPadding: number;
}) {
	return (
		<>
			{item.mediaType === MediaType.Image && (
				<Image
					source={{
						uri: urlOrBlurHash(cdnURL(item.url), item.blurhash),
					}}
					style={tw.style("w-full h-full", { pointerEvents: "none" })}
					resizeMode={resizeMode}
					onLoad={(event) => {
						if (!event.nativeEvent.source) return;
						setImageWidth(event.nativeEvent.source.width);
						setImageHeight(event.nativeEvent.source.height);
					}}
				/>
			)}
			{item.mediaType === MediaType.Video && (
				<FypVideo
					id={`${id}-${index}`}
					source={{
						uri: cdnURL(item.url) ?? "",
					}}
					style={[tw.style("w-full h-full")]}
					resizeMode={resizeMode}
				/>
			)}

			{watermark && (
				<FypText
					fontSize={17}
					color="white"
					style={tw.style(
						`right-[${rightPadding}px] bottom-[${bottomPadding}px] absolute`,
						{ pointerEvents: "none" },
					)}
				>
					{watermark}
				</FypText>
			)}
		</>
	);
}

const FansCarousel: FC<Props> = (props) => {
	const {
		id,
		width,
		height,
		medias,
		resizeMode,
		onClickItem,
		showBadge,
		defaultIndex = 0,
		useButtons,
		watermark,
	} = props;
	const [imgIndex, setImgIndex] = useState(0);
	const offset = useSharedValue(0);
	const positionX = useSharedValue(0);
	const fallbackId = useId();

	const carouselStyles = useAnimatedStyle(() => {
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
		if (imgIndex === 0 || medias.length === 0) {
			return;
		}
		setImgIndex(imgIndex - 1);
		offset.value = offset.value - 1;
	};

	const handleNext = () => {
		if (imgIndex === medias.length - 1 || medias.length === 0) {
			return;
		}
		setImgIndex(imgIndex + 1);
		offset.value = offset.value + 1;
	};

	const handleGoToIndex = (index: number) => {
		setImgIndex(index);
		offset.value = index;
	};

	const panGesture = Gesture.Pan()
		.onBegin((e) => {
			positionX.value = e.translationX;
		})
		.onUpdate(() => {
			return;
		})
		.onEnd((e) => {
			if (positionX.value < e.translationX) {
				handlePrev();
			} else {
				handleNext();
			}
		});

	const longPressGesture = Gesture.Tap().onEnd((e, success) => {
		if (success && onClickItem) {
			if (medias[imgIndex].mediaType !== MediaType.Video && onClickItem) {
				onClickItem(imgIndex);
			}
		}
	});
	useEffect(() => {
		setImgIndex(defaultIndex);
		offset.value = defaultIndex;
	}, [defaultIndex]);

	const [rightPadding, setRightPadding] = useState(17);
	const [bottomPadding, setBottomPadding] = useState(20);
	const [imageWidth, setImageWidth] = useState(0);
	const [imageHeight, setImageHeight] = useState(0);

	useEffect(() => {
		if (resizeMode !== ResizeMode.CONTAIN) return;
		if (
			!(
				resizeMode === ResizeMode.CONTAIN &&
				imageWidth > 0 &&
				imageHeight > 0
			)
		)
			return;

		if (imageWidth / imageHeight > width / height) {
			setRightPadding(17);
			setBottomPadding(
				20 +
					Math.trunc(
						(height - (width * imageHeight) / imageWidth) / 2,
					),
			);
		} else {
			setRightPadding(
				17 +
					Math.trunc(
						(width - (height * imageWidth) / imageHeight) / 2,
					),
			);
			setBottomPadding(20);
		}
	}, [imageWidth, imageHeight, width, height]);

	useEffect(() => {}, [rightPadding, bottomPadding]);

	return (
		<View>
			<FypNullableView visible={Platform.OS === "web" && !useButtons}>
				<GestureDetector gesture={panGesture}>
					<View
						style={[
							tw.style("relative"),
							{ height: height, overflow: "hidden" },
						]}
					>
						<GestureDetector gesture={longPressGesture}>
							<Animated.View
								style={[
									tw.style("absolute flex-row top-0"),
									carouselStyles,
								]}
							>
								{medias.map((item, index) => (
									<View
										key={index}
										style={{ width: width, height: height }}
									>
										<MediaElement
											id={id ?? fallbackId}
											item={item}
											index={index}
											resizeMode={resizeMode}
											watermark={watermark}
											setImageWidth={setImageWidth}
											setImageHeight={setImageHeight}
											rightPadding={rightPadding}
											bottomPadding={bottomPadding}
										/>
									</View>
								))}
							</Animated.View>
						</GestureDetector>
					</View>
				</GestureDetector>
			</FypNullableView>

			<FypNullableView visible={Platform.OS === "web" && !!useButtons}>
				<View
					style={[
						tw.style("relative"),
						{ height: height, overflow: "hidden" },
					]}
				>
					<Animated.View
						style={[
							tw.style("absolute flex-row top-0"),
							carouselStyles,
						]}
					>
						{medias.map((item, index) => (
							<Pressable
								key={index}
								style={{ width: width, height: height }}
								onPress={() => {
									if (
										onClickItem &&
										item.mediaType !== MediaType.Video
									) {
										onClickItem(index);
									}
								}}
							>
								<View
									key={index}
									style={{ width: width, height: height }}
								>
									<MediaElement
										id={id ?? fallbackId}
										item={item}
										index={index}
										resizeMode={resizeMode}
										watermark={watermark}
										setImageWidth={setImageWidth}
										setImageHeight={setImageHeight}
										rightPadding={rightPadding}
										bottomPadding={bottomPadding}
									/>
								</View>
							</Pressable>
						))}
					</Animated.View>
				</View>
				<ArrowButton
					type="left"
					onPress={handlePrev}
					style={tw.style("left-4 top-1/2")}
					hide={imgIndex === 0 || medias.length === 0}
				/>
				<ArrowButton
					type="right"
					onPress={handleNext}
					style={tw.style("right-4 top-1/2")}
					hide={imgIndex === medias.length - 1 || medias.length === 0}
				/>
			</FypNullableView>
			<Indicator
				index={imgIndex}
				length={medias.length}
				onClickDot={handleGoToIndex}
			/>
			{(Platform.OS === "ios" || Platform.OS === "android") && (
				<Carousel
					loop={false}
					width={width}
					height={height}
					style={tw.style("h-full")}
					autoPlay={false}
					data={medias}
					scrollAnimationDuration={1000}
					onScrollEnd={(index) => setImgIndex(index)}
					renderItem={({ item, index }) => {
						return (
							<Pressable
								style={tw.style("w-full h-full")}
								onPress={() => {
									if (
										onClickItem &&
										item.mediaType !== MediaType.Video
									) {
										onClickItem(index);
									}
								}}
								key={index}
							>
								<MediaElement
									id={id ?? fallbackId}
									item={item}
									index={index}
									resizeMode={resizeMode}
									watermark={watermark}
									setImageWidth={setImageWidth}
									setImageHeight={setImageHeight}
									rightPadding={rightPadding}
									bottomPadding={bottomPadding}
								/>
							</Pressable>
						);
					}}
				/>
			)}
			<FypNullableView visible={!!showBadge}>
				<Badge index={imgIndex} length={medias.length} />
			</FypNullableView>
		</View>
	);
};

export default FansCarousel;
