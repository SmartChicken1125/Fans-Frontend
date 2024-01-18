import {
	ArchivedPostSvg,
	ChevronLeftSvg,
	StatisticsSvg,
	StarCheckSvg,
	ThreeDotsVerticalSvg,
	PostMailSvg,
	TipSvg,
	ShareSvg,
} from "@assets/svgs/common";
import UserAvatar from "@components/avatar/UserAvatar";
import { FypNullableView, FypSvg } from "@components/common/base";
import { FansText, FansView, FansIconButton } from "@components/controls";
import tw from "@lib/tailwind";
import { IProfile } from "@usertypes/types";
import React, { FC, useEffect } from "react";
import Animated, {
	useSharedValue,
	withTiming,
	Easing,
	useAnimatedStyle,
} from "react-native-reanimated";

interface Props {
	visible: boolean;
	profile?: IProfile;
	onClickBack?: () => void;
	onClickArchive?: () => void;
	onClickAnalytics?: () => void;
	onClickMenu?: () => void;
	onClickMail?: () => void;
	onClickTip?: () => void;
	onClickShare?: () => void;
}

const StickyHeader: FC<Props> = (props) => {
	const {
		visible,
		profile,
		onClickBack,
		onClickArchive,
		onClickAnalytics,
		onClickMenu,
		onClickMail,
		onClickTip,
		onClickShare,
	} = props;
	const fadeInOpacity = useSharedValue(0);

	const fadeIn = () => {
		fadeInOpacity.value = withTiming(1, {
			duration: 500,
			easing: Easing.linear,
		});
	};

	const fadeOut = () => {
		fadeInOpacity.value = withTiming(0, {
			duration: 500,
			easing: Easing.linear,
		});
	};

	const animatedStyle = useAnimatedStyle(() => {
		return {
			opacity: fadeInOpacity.value,
		};
	});

	useEffect(() => {
		if (visible) {
			fadeIn();
		} else {
			fadeOut();
		}
	}, [visible]);

	return (
		<Animated.View
			style={[
				tw.style(
					"absolute top-0 left-0 w-full z-90",
					"bg-fans-white dark:bg-fans-black-1d",
				),
				animatedStyle,
			]}
		>
			<FansView
				flexDirection="row"
				alignItems="center"
				height={50}
				padding={{ x: 8 }}
				style={tw.style(
					"top-0 left-0 w-full md:hidden",
					"border-b border-fans-grey-f0 dark:border-fans-grey-43",
					visible ? "flex" : "hidden",
				)}
			>
				<FansIconButton
					backgroundColor="bg-fans-white dark:bg-fans-black-1d"
					onPress={onClickBack}
				>
					<FypSvg
						svg={ChevronLeftSvg}
						width={14}
						height={14}
						color="fans-grey-70 dark:fans-grey-b1"
					/>
				</FansIconButton>
				<FansView margin={{ l: 8, r: 12 }}>
					<UserAvatar image={profile?.avatar} size="34px" />
				</FansView>
				<FansView
					flexDirection="row"
					alignItems="center"
					position="relative"
					flex="1"
				>
					<FansText
						fontSize={16}
						lineHeight={21}
						numberOfLines={1}
						style={tw.style(
							"font-semibold text-fans-black dark:text-fans-white relative pr-7",
						)}
					>
						{profile?.displayName}
						<FypSvg
							svg={StarCheckSvg}
							width={14}
							height={13}
							style={tw.style("absolute top-[4.5px] right-0")}
						/>
					</FansText>
				</FansView>

				<FansView flexDirection="row">
					<FypNullableView visible={!!onClickShare}>
						<FansIconButton
							backgroundColor="bg-fans-white dark:bg-fans-black-1d"
							onPress={onClickShare}
						>
							<FypSvg
								svg={ShareSvg}
								width={19}
								height={15}
								color="fans-black dark:fans-white"
							/>
						</FansIconButton>
					</FypNullableView>

					<FypNullableView visible={!!onClickMail}>
						<FansIconButton
							backgroundColor="bg-fans-white dark:bg-fans-black-1d"
							onPress={onClickMail}
						>
							<FypSvg
								svg={PostMailSvg}
								width={19}
								height={15}
								color="fans-black dark:fans-white"
							/>
						</FansIconButton>
					</FypNullableView>
					<FypNullableView visible={!!onClickTip}>
						<FansIconButton
							backgroundColor="bg-fans-white dark:bg-fans-black-1d"
							onPress={onClickTip}
						>
							<FypSvg
								svg={TipSvg}
								width={10}
								height={20}
								color="fans-black dark:fans-white"
							/>
						</FansIconButton>
					</FypNullableView>

					<FypNullableView visible={!!onClickArchive}>
						<FansIconButton
							backgroundColor="bg-fans-white dark:bg-fans-black-1d"
							onPress={onClickArchive}
						>
							<FypSvg
								svg={ArchivedPostSvg}
								width={18}
								height={18}
								color="fans-black dark:fans-white"
							/>
						</FansIconButton>
					</FypNullableView>
					<FypNullableView visible={!!onClickAnalytics}>
						<FansIconButton
							backgroundColor="bg-fans-white dark:bg-fans-black-1d"
							onPress={onClickAnalytics}
						>
							<FypSvg
								svg={StatisticsSvg}
								width={16}
								height={16}
								color="fans-black dark:fans-white"
							/>
						</FansIconButton>
					</FypNullableView>

					<FypNullableView visible={!!onClickMenu}>
						<FansIconButton
							backgroundColor="bg-fans-white dark:bg-fans-black-1d"
							onPress={onClickMenu}
						>
							<FypSvg
								svg={ThreeDotsVerticalSvg}
								width={16}
								height={16}
								color="fans-black dark:fans-white"
							/>
						</FansIconButton>
					</FypNullableView>
				</FansView>
			</FansView>
		</Animated.View>
	);
};

export default StickyHeader;
