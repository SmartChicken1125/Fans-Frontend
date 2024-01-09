import { ChevronLeftSvg, ChevronRightSvg } from "@assets/svgs/common";
import { FansIconButton, FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { isDesktop } from "@utils/global";
import React, {
	FC,
	MutableRefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	Animated as NAnimated,
	NativeScrollEvent,
	ScrollView,
	ScrollViewProps,
} from "react-native";
import {
	PanGestureHandler,
	PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
	useAnimatedGestureHandler,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { FypNullableView } from "./nullableView";
import { FypSvg } from "./svg";

type ContextType = {
	x: number;
	y: number;
};

export const FypHorizontalScrollView: FC<ScrollViewProps> = (props) => {
	const { children, ..._props } = props;
	const x = useSharedValue(0);
	const [completeScrollBarWidth, setCompleteScrollBarWidth] = useState(1);
	const [visibleScrollBarWidth, setVisibleScrollBarWidth] = useState(0);

	const scrollIndicatorSize =
		completeScrollBarWidth > visibleScrollBarWidth
			? (visibleScrollBarWidth * visibleScrollBarWidth) /
			  completeScrollBarWidth
			: visibleScrollBarWidth;
	const scrollIndicator = useRef(new NAnimated.Value(0)).current;

	const difference =
		visibleScrollBarWidth > scrollIndicatorSize
			? visibleScrollBarWidth - scrollIndicatorSize
			: 1;

	const scrollIndicatorPosition = NAnimated.multiply(
		scrollIndicator,
		visibleScrollBarWidth / completeScrollBarWidth,
	).interpolate({
		inputRange: [0, difference],
		outputRange: [0, difference],
		extrapolate: "clamp",
	});

	const panGestureEvent = useAnimatedGestureHandler<
		PanGestureHandlerGestureEvent,
		ContextType
	>({
		onActive: (event, context) => {
			context.x = event.translationX + x.value;
			scrollRef.current?.scrollTo({
				x: Math.min(
					Math.max(0, context.x),
					completeScrollBarWidth - visibleScrollBarWidth,
				),
				animated: false,
			});
		},
	});
	const scrollRef =
		useRef<ScrollView | null>() as MutableRefObject<ScrollView | null>;
	return (
		<FansView>
			<ScrollView
				ref={scrollRef}
				horizontal
				scrollEventThrottle={16}
				showsHorizontalScrollIndicator={false}
				onContentSizeChange={(width, _) => {
					setCompleteScrollBarWidth(width);
				}}
				onLayout={(e) => {
					setVisibleScrollBarWidth(e.nativeEvent.layout.width);
				}}
				onScroll={NAnimated.event(
					[
						{
							nativeEvent: {
								contentOffset: { x: scrollIndicator },
							},
						},
					],
					{
						useNativeDriver: false,
						listener: (event) => {
							x.value = (
								event.nativeEvent as NativeScrollEvent
							).contentOffset.x;
						},
					},
				)}
				{..._props}
			>
				{children}
			</ScrollView>
			<FypNullableView
				visible={completeScrollBarWidth > visibleScrollBarWidth}
			>
				<FansView
					height={6}
					borderRadius={8}
					// background="fans-purple/50"
					style={tw.style("w-full")}
					margin={{ t: 20 }}
				>
					<PanGestureHandler onGestureEvent={panGestureEvent}>
						<Animated.View
							style={{
								height: 6,
								borderRadius: 8,
								backgroundColor: "#bc6ff1",
								width: scrollIndicatorSize,
								transform: [
									{ translateX: scrollIndicatorPosition },
								],
								cursor: "pointer",
							}}
						/>
					</PanGestureHandler>
				</FansView>
			</FypNullableView>
		</FansView>
	);
};

interface FypHorizontalScrollView2Props {
	children: React.ReactNode;
}

export const FypHorizontalScrollView2: FC<FypHorizontalScrollView2Props> = (
	props,
) => {
	const { children } = props;
	const [wrapperWidth, setWrapperWidth] = useState(0);
	const [contentWidth, setContentWidth] = useState(0);
	const [height, setHeight] = useState(0);
	const [visiblePrev, setVisiblePrev] = useState(false);
	const [visibleNext, setVisibleNext] = useState(false);

	const stepWidth = wrapperWidth / 3;
	const offset = useSharedValue(0);

	const carouselStyles = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateX: withSpring(offset.value, {
						damping: 90,
						stiffness: 90,
					}),
				},
			],
		};
	});

	const handlePressPrev = useCallback(() => {
		if (offset.value + stepWidth >= 0) {
			offset.value = 0;
			setVisiblePrev(false);
		} else {
			offset.value = offset.value + wrapperWidth / 3;
			setVisiblePrev(true);
		}
		setVisibleNext(true);
	}, [offset.value, stepWidth, wrapperWidth, contentWidth]);

	const handlePressNext = useCallback(() => {
		if (wrapperWidth + (offset.value - stepWidth) * -1 >= contentWidth) {
			offset.value = wrapperWidth - contentWidth;
			setVisibleNext(false);
		} else {
			offset.value = offset.value - stepWidth;
			setVisibleNext(true);
		}
		setVisiblePrev(true);
	}, [offset.value, stepWidth, wrapperWidth, contentWidth]);

	useEffect(() => {
		if (contentWidth > wrapperWidth) {
			setVisibleNext(true);
		}
	}, [contentWidth, wrapperWidth]);

	return isDesktop ? (
		<FansView
			position="relative"
			style={[
				tw.style("relative w-full"),
				{ overflow: "hidden", height: height },
			]}
			onLayout={(e) => setWrapperWidth(e.nativeEvent.layout.width)}
		>
			<Animated.View
				style={[
					tw.style(
						"absolute top-0 left-0 min-w-full flex-row w-full",
					),
					carouselStyles,
				]}
			>
				<FansView
					flexDirection="row"
					onLayout={(e) => {
						setContentWidth(e.nativeEvent.layout.width);
						setHeight(e.nativeEvent.layout.height);
					}}
				>
					{children}
				</FansView>
			</Animated.View>
			<FypNullableView visible={visiblePrev}>
				<FansIconButton
					size={30}
					backgroundColor="bg-fans-black/75"
					style={[
						tw.style("absolute left-0 top-1/2"),
						{
							transform: [{ translateY: -15 }],
						},
					]}
					onPress={handlePressPrev}
				>
					<FypSvg
						svg={ChevronLeftSvg}
						width={12}
						height={12}
						color="fans-white"
					/>
				</FansIconButton>
			</FypNullableView>

			<FypNullableView visible={visibleNext}>
				<FansIconButton
					size={30}
					backgroundColor="bg-fans-black/75"
					style={[
						tw.style("absolute right-0 top-1/2"),
						{
							transform: [{ translateY: -15 }],
						},
					]}
					onPress={handlePressNext}
				>
					<FypSvg
						svg={ChevronRightSvg}
						width={12}
						height={12}
						color="fans-white"
					/>
				</FansIconButton>
			</FypNullableView>
		</FansView>
	) : (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			style={tw.style("w-full")}
			contentContainerStyle={tw.style("min-w-full w-full")}
		>
			{children}
		</ScrollView>
	);
};
