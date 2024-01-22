import { ShopSvg, BlockSvg } from "@assets/svgs/common";
import UserAvatar from "@components/avatar/UserAvatar";
import {
	FypModal,
	FypSvg,
	FypLinearGradientView,
	FypText,
} from "@components/common/base";
import { FansView } from "@components/controls";
import { OrderCard } from "@components/videoCall";
import { FAIR_TRANSACTION_DIALOG_ID } from "@constants/modal";
import { ModalState } from "@context/state/modalState";
import { useAppContext, ModalActionType } from "@context/useAppContext";
import tw from "@lib/tailwind";
import React, { useState } from "react";
import { ScrollView, Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
} from "react-native-reanimated";

const { width: windowWidth } = Dimensions.get("window");

const OrderCardGroup = () => {
	const modalWidth = tw.prefixMatch("md") ? 740 : windowWidth - 36;
	const cardWidth = modalWidth - 36;

	const data = [1, 2, 3, 4, 5];

	const [selectedIndex, setSelectedIndex] = useState(0);

	const offset = useSharedValue(0);
	const positionX = useSharedValue(0);

	const carouselStyles = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateX: withSpring(offset.value * cardWidth * -1, {
						damping: 90,
						stiffness: 90,
					}),
				},
			],
		};
	});

	const handlePrev = () => {
		if (selectedIndex === 0 || data.length === 0) {
			return;
		}
		setSelectedIndex(selectedIndex - 1);
		offset.value = offset.value - 1;
	};

	const handleNext = () => {
		if (selectedIndex === data.length - 1 || data.length === 0) {
			return;
		}
		setSelectedIndex(selectedIndex + 1);
		offset.value = offset.value + 1;
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

	return (
		<FansView>
			<FansView
				flexDirection="row"
				alignItems="center"
				margin={{ b: 15 }}
				padding={{ x: 18 }}
			>
				<FypText fontSize={17} fontWeight={600} lineHeight={22}>
					5 Video calls
				</FypText>
				<FansView
					width={4}
					height={4}
					borderRadius={4}
					margin={{ l: 19, r: 8 }}
					style={tw.style("bg-fans-grey-48 dark:bg-fans-grey-b1")}
				></FansView>
				<FypText
					fontSize={16}
					lineHeight={21}
					style={tw.style("text-fans-grey-48 dark:text-fans-grey-b1")}
				>
					Total revenue: $500
				</FypText>
			</FansView>
			<GestureDetector gesture={panGesture}>
				<FansView flexDirection="row" gap={8} padding={{ x: 18 }}>
					{[...Array(5)].map((el, index) => (
						<FansView width={cardWidth} key={index}>
							<OrderCard status="active" />
						</FansView>
					))}
				</FansView>
			</GestureDetector>
			<FansView margin={{ t: 12 }}>
				<FansView
					flexDirection="row"
					alignItems="center"
					justifyContent="center"
					gap={14}
					margin={{ b: 13 }}
				>
					<FypSvg
						svg={BlockSvg}
						width={15}
						height={15}
						color="fans-purple"
					/>
					<FypText
						fontSize={17}
						fontWeight={600}
						lineHeight={22}
						style={tw.style("text-fans-purple")}
					>
						Disable video calls
					</FypText>
				</FansView>
				<FansView
					flexDirection="row"
					alignItems="center"
					justifyContent="center"
					gap={5}
				>
					{[...Array(5)].map((el, index) => (
						<FansView
							key={index}
							borderRadius={8}
							width={selectedIndex === index ? 8 : 5}
							height={selectedIndex === index ? 8 : 5}
							pressableProps={{
								onPress: () => setSelectedIndex(index),
							}}
							style={tw.style(
								selectedIndex === index
									? "bg-fans-black dark:bg-fans-white"
									: "bg-fans-grey-de dark:bg-fans-grey-50",
							)}
						></FansView>
					))}
				</FansView>
			</FansView>
		</FansView>
	);
};

const PendingOrdersModal = () => {
	const { state, dispatch } = useAppContext();
	const { profile } = state;

	const visible = true;
	const handleClose = () => {};

	return (
		<FypModal
			visible={visible}
			onDismiss={handleClose}
			width={{ xs: "full", lg: 740 }}
		>
			<FansView position="relative" padding={{ t: 34, b: 18 }}>
				<ScrollView>
					<FansView position="relative">
						<FansView
							position="relative"
							margin={{ b: 25 }}
							style={tw.style("mx-auto")}
						>
							<UserAvatar image={profile.avatar} size="86px" />
							<FypLinearGradientView
								colors={["#D885FF", "#A854f5", "#1D21E5"]}
								start={[1, 0]}
								end={[0, 1]}
								width={42}
								height={42}
								borderRadius={42}
								position="absolute"
								alignItems="center"
								justifyContent="center"
								style={tw.style(
									"border-[4px] border-fans-white bottom-[-11px] right-[-8px]",
								)}
							>
								<FypSvg
									svg={ShopSvg}
									width={16}
									height={20}
									color="fans-white"
								/>
							</FypLinearGradientView>
						</FansView>
						<FansView padding={{ x: 18 }} margin={{ b: 24 }}>
							<FypText
								fontSize={21}
								lineHeight={28}
								fontWeight={700}
								textAlign="center"
								margin={{ b: 16 }}
							>
								Pending orders
							</FypText>
							<FypText fontSize={16} textAlign="center">
								Please accept or reject pending orders to
								continue onto FYP.Fans
							</FypText>
						</FansView>

						<OrderCardGroup />
					</FansView>
				</ScrollView>
			</FansView>
		</FypModal>
	);
};

export default PendingOrdersModal;
