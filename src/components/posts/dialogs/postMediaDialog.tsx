import { ChevronLeftSvg, CloseSvg, StarCheckSvg } from "@assets/svgs/common";
import AvatarWithStatus from "@components/common/AvatarWithStatus";
import { FypVideo } from "@components/common/base";
import FansCarousel, { ArrowButton } from "@components/common/carousel";
import { FansIconButton, FansText, FansView } from "@components/controls";
import { PostsActionType, useAppContext } from "@context/useAppContext";
import { cdnURL } from "@helper/Utils";
import tw from "@lib/tailwind";
import { MediaType, ResizeMode } from "@usertypes/commonEnums";
import { isDesktop } from "@utils/global";
import React, { FC, useState, useEffect } from "react";
import {
	Modal,
	Pressable,
	View,
	useWindowDimensions,
	Image,
	Dimensions,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

interface MediaItemProps {
	url: string;
	mediaType: MediaType;
}

const MediaItem: FC<MediaItemProps> = (props) => {
	const { url, mediaType } = props;

	const oldX = useSharedValue(0);
	const oldY = useSharedValue(0);
	const translateX = useSharedValue(0);
	const translateY = useSharedValue(0);
	const scaleValue = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: translateY.value,
				},
				{
					translateX: translateX.value,
				},
				{
					scale: withTiming(scaleValue.value),
				},
			],
		};
	}, [translateX.value, translateY.value, scaleValue.value]);

	const longPressGesture = Gesture.Tap().onEnd((e) => {
		scaleValue.value = scaleValue.value === 1 ? 1.3 : 1;
	});

	const panGesture = Gesture.Pan()
		.onBegin((e) => {
			translateX.value = oldX.value + e.translationX;
			translateY.value = oldY.value + e.translationY;
		})
		.onChange((e) => {
			translateX.value = oldX.value + e.translationX;
			translateY.value = oldY.value + e.translationY;
		})
		.onEnd((e) => {
			oldX.value += e.translationX;
			oldY.value += e.translationY;
		});

	return (
		<GestureDetector gesture={panGesture}>
			<GestureDetector gesture={longPressGesture}>
				<Animated.View
					style={[tw.style("h-full w-3/4"), animatedStyle]}
				>
					{mediaType === MediaType.Image ? (
						<Image
							source={{
								uri: cdnURL(url),
							}}
							resizeMode="contain"
							style={tw.style("w-full h-full")}
						/>
					) : (
						<FypVideo
							id={`${url}`}
							source={{
								uri: cdnURL(url) ?? "",
							}}
							style={[tw.style("w-full h-full")]}
							resizeMode={ResizeMode.CONTAIN}
						/>
					)}
				</Animated.View>
			</GestureDetector>
		</GestureDetector>
	);
};

interface DesktopScreenProps {
	handleClose: () => void;
	mediaUrls: string[];
	mediaType: MediaType;
}

const DesktopScreen: FC<DesktopScreenProps> = (props) => {
	const { handleClose, mediaUrls, mediaType } = props;

	const carouselX = useSharedValue(0);

	const [carouselIndex, setCarouselIndex] = useState(0);

	const carouselStyles = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateX: withSpring(carouselX.value * width * -1, {
						damping: 90,
						stiffness: 90,
					}),
				},
			],
		};
	});

	const handlePrev = () => {
		if (carouselIndex === 0 || mediaUrls.length === 0) {
			return;
		}
		setCarouselIndex(carouselIndex - 1);
		carouselX.value = carouselX.value - 1;
	};

	const handleNext = () => {
		if (carouselIndex === mediaUrls.length - 1 || mediaUrls.length === 0) {
			return;
		}
		setCarouselIndex(carouselIndex + 1);
		carouselX.value = carouselX.value + 1;
	};

	// useEffect(() => {
	// 	if (mediaUrls.length > 0 && mediaType === MediaType.Image) {
	// 		Image.getSize(cdnURL(mediaUrls[0]), (width, height) => {
	// 			console.log(`width = ${width}, height = ${height}`);
	// 		});
	// 	}
	// }, [mediaUrls, mediaType]);

	return (
		<FansView
			width="screen"
			height="screen"
			alignItems="center"
			backgroundColor={{ color: "black", opacity: 31 }}
			justifyContent="center"
		>
			<FansView width="full" height="full" position="relative">
				<FansIconButton
					size={30}
					backgroundColor="bg-fans-black/50 dark:bg-fans-white/50"
					style={tw.style("top-5 right-5 absolute z-10")}
					onPress={handleClose}
				>
					<CloseSvg size={14} color="#fff" />
				</FansIconButton>
				<Animated.View
					style={[tw.style("w-full h-full flex-row"), carouselStyles]}
				>
					{mediaUrls.map((url) => (
						<FansView
							key={url}
							width={width}
							height={height}
							alignItems="center"
							justifyContent="center"
						>
							<MediaItem url={url} mediaType={mediaType} />
						</FansView>
					))}
				</Animated.View>

				<ArrowButton
					type="left"
					onPress={handlePrev}
					style={tw.style("left-4 top-1/2")}
					hide={carouselIndex === 0 || mediaUrls.length === 0}
				/>
				<ArrowButton
					type="right"
					onPress={handleNext}
					style={tw.style("right-4 top-1/2")}
					hide={
						carouselIndex === mediaUrls.length - 1 ||
						mediaUrls.length === 0
					}
				/>
			</FansView>
		</FansView>
	);
};

const PostMediaDialog = () => {
	const { state, dispatch } = useAppContext();
	const {
		visible,
		mediaType,
		mediaUrls,
		avatar,
		displayName,
		index,
		watermark,
	} = state.posts.mediaModal;
	const { height } = useWindowDimensions();

	const [imgWidth, setImgWidth] = useState(100);

	const handleClose = () => {
		dispatch.setPosts({
			type: PostsActionType.updateMediaModal,
			data: {
				visible: false,
			},
		});
	};

	return (
		<Modal visible={visible} transparent>
			{isDesktop ? (
				<DesktopScreen
					mediaType={mediaType}
					mediaUrls={mediaUrls}
					handleClose={handleClose}
				/>
			) : (
				<FansView
					width="screen"
					height="screen"
					touchableOpacityProps={{
						activeOpacity: 1,
						onPress: handleClose,
					}}
					alignItems="center"
					backgroundColor={{ color: "black", opacity: 31 }}
					justifyContent="center"
				>
					<FansView
						width={{ xs: "full", md: 740 }}
						touchableOpacityProps={{ activeOpacity: 1 }}
						style={tw.style("max-h-full")}
					>
						<View
							style={tw.style("")}
							onLayout={(e) =>
								setImgWidth(e.nativeEvent.layout.width)
							}
							onPointerEnter={(e) => console.log(e)}
						>
							<View
								style={tw.style(
									"flex-row items-center mb-2 pl-4.5",
								)}
							>
								<Pressable
									style={tw.style("w-[15px] h-[15px] mr-5")}
									onPress={handleClose}
								>
									<ChevronLeftSvg size={15} color="#fff" />
								</Pressable>
								<AvatarWithStatus size={34} avatar={avatar} />
								<FansText
									style={tw.style("px-3.5")}
									color="white"
									fontFamily="inter-semibold"
									fontSize={16}
									lineHeight={21}
								>
									{displayName}
								</FansText>
								<StarCheckSvg width={13.66} height={13} />

								<FansIconButton
									size={30}
									backgroundColor="bg-fans-black/50 dark:bg-fans-white/50"
									style={tw.style("ml-auto mr-3 md:hidden")}
									onPress={handleClose}
								>
									<CloseSvg size={14} color="#fff" />
								</FansIconButton>
							</View>
							<View style={tw.style("relative flex-1")}>
								<FansCarousel
									id="post-media-carousel"
									width={imgWidth}
									height={
										tw.prefixMatch("md")
											? imgWidth
											: height - 100
									}
									resizeMode={ResizeMode.CONTAIN}
									medias={mediaUrls.map((el) => ({
										url: el,
										mediaType: mediaType,
									}))}
									defaultIndex={index}
									watermark={watermark}
								/>
							</View>
						</View>
					</FansView>
				</FansView>
			)}
		</Modal>
	);
};

export default PostMediaDialog;
