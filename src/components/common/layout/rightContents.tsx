import { CloseSvg } from "@assets/svgs/common";
import { GemImage } from "@assets/svgs/images";
import {
	FypLink,
	FypNullableView,
	FypSvg,
	FypText,
} from "@components/common/base";
import {
	FansDivider,
	FansIconButton,
	FansText,
	FansView,
} from "@components/controls";
import { PwaInstallCard } from "@components/pwa";
import { useAppContext } from "@context/useAppContext";
import { searchCreators } from "@helper/endpoints/profile/apis";
import { ProfilesRespBody } from "@helper/endpoints/profile/schemas";
import tw from "@lib/tailwind";
import { useFeatureGates } from "@state/featureGates";
import { RoundButtonType } from "@usertypes/commonEnums";
import { IProfile } from "@usertypes/types";
import { useBlankLink } from "@utils/useBlankLink";
import { useRouter, useSegments } from "expo-router";
import React, { FC, useEffect, useState } from "react";
import {
	Dimensions,
	NativeScrollEvent,
	Pressable,
	ScrollView,
	View,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import AvatarWithStatus from "../AvatarWithStatus";
import RoundButton from "../RoundButton";
import SearchTextInput from "../searchTextInput";
import MediaContents from "./mediaContents";
import SuggestedCreators from "./suggestedCreators";

export const GermsBlock = () => {
	const router = useRouter();
	const { state } = useAppContext();
	const { userInfo } = state.user;

	const onClickGetGems = (amount: number) => {
		router.replace({ pathname: "get-gems", params: { gems: amount } });
	};

	return (
		<FansView
			borderRadius={15}
			padding={{ t: 28, x: 20, b: 14 }}
			style={tw.style("border border-fans-grey dark:border-fans-grey-43")}
		>
			<FansView
				flexDirection="row"
				alignItems="center"
				style={tw.style("mb-5")}
			>
				<FansView
					style={tw.style(
						"rounded-full bg-fans-purple-f6 dark:bg-fans-purple-47",
					)}
					width={60}
					height={60}
					flexDirection="row"
					alignItems="center"
					justifyContent="center"
					margin={{ r: 12 }}
				>
					<FypSvg svg={GemImage} width={38} height={35} />
				</FansView>
				<FansView>
					<FypText
						fontSize={16}
						lineHeight={20}
						margin={{ b: 3 }}
						style={tw.style(
							"text-fans-grey-70 dark:text-fans-grey-b1",
						)}
					>
						{(userInfo.gemsAmount ?? 0).toFixed(2)} USD
					</FypText>
					<FypText
						style={tw.style("text-fans-black dark:text-fans-white")}
						fontWeight={600}
						fontSize={23}
						lineHeight={23}
					>
						{`${userInfo.gems ?? 0} Gems`}
					</FypText>
				</FansView>
			</FansView>
			<RoundButton
				onPress={() => onClickGetGems(1000)}
				variant={RoundButtonType.OUTLINE_PRIMARY}
			>
				Purchase gems
			</RoundButton>
		</FansView>
	);
};

interface SearchScrollViewProps {
	searchQuery: string;
	seeAllResult: boolean;
	onChangeSeeAllResult: (val: boolean) => void;
}

const height = Dimensions.get("window").height;

export const SearchScrollView: FC<SearchScrollViewProps> = (props) => {
	const { searchQuery, seeAllResult, onChangeSeeAllResult } = props;
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(false);
	const [profiles, setProfiles] = useState<ProfilesRespBody>({
		profiles: [],
		page: 1,
		size: 10,
		total: 0,
	});

	const fetchUsers = async () => {
		const params = {
			page: profiles.page,
			size: 10,
			query: searchQuery,
		};
		const resp = await searchCreators(params);
		if (resp.ok) {
			setProfiles({
				...resp.data,
				profiles:
					resp.data.page === 1
						? resp.data.profiles
						: [...profiles.profiles, ...resp.data.profiles],
			});
			setIsLoading(false);
		}
	};

	const onScrollView = (nativeEvent: NativeScrollEvent) => {
		const paddingToBottom = 20;
		const isScrollEnd =
			nativeEvent.layoutMeasurement.height +
				nativeEvent.contentOffset.y >=
			nativeEvent.contentSize.height - paddingToBottom;
		if (isScrollEnd && !isLoading) {
			if (profiles.total > 10 * profiles.page) {
				setIsLoading(true);
				setProfiles({
					...profiles,
					page: profiles.page + 1,
				});
			}
		}
	};

	const onPressUser = (user: IProfile) => {
		if (user.profileLink) {
			router.push(`/${user.profileLink}`);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, [profiles.page]);

	useEffect(() => {
		setProfiles({
			...profiles,
			page: 1,
		});
		fetchUsers();
	}, [searchQuery]);

	return (
		<Animated.View
			entering={FadeIn}
			exiting={FadeOut}
			style={[
				tw.style(
					"w-full z-90 rounded-[15px] absolute",
					`bg-fans-white dark:bg-fans-black-1d`,
				),
				{
					top: 65,
					height: seeAllResult ? height - 62 - 65 : 500,
					shadowColor: tw.prefixMatch("dark")
						? "rgba(255,255,255,0.16)"
						: "rgba(0,0,0,0.16)",
					shadowOffset: {
						width: 0,
						height: 3,
					},
					shadowRadius: 6,
				},
			]}
		>
			<ScrollView
				showsVerticalScrollIndicator={true}
				onScroll={({ nativeEvent }) => onScrollView(nativeEvent)}
				scrollEventThrottle={30}
			>
				{profiles.profiles.map((user) => (
					<FansView key={user.id} padding={{ x: 16 }}>
						<FansView
							flexDirection="row"
							alignItems="center"
							padding={{ y: 18 }}
							gap={15}
							touchableOpacityProps={{
								onPress: () => onPressUser(user),
							}}
						>
							<AvatarWithStatus avatar={user.avatar} size={50} />
							<FansView flex="1">
								<FypText
									fontSize={17}
									lineHeight={22}
									fontWeight={700}
									style={tw.style(
										"mb-1 text-fans-black dark:text-fans-white",
									)}
									numberOfLines={1}
								>
									{user.displayName}
								</FypText>
								<FypText
									fontSize={15}
									lineHeight={20}
									numberOfLines={1}
									style={tw.style(
										"text-fans-grey-70 dark:text-fans-grey-b1",
									)}
								>
									{user.bio}
								</FypText>
							</FansView>
						</FansView>
						<FansDivider />
					</FansView>
				))}
			</ScrollView>
			<FypNullableView visible={!seeAllResult}>
				<FansView alignItems="center" padding={{ t: 20, b: 22 }}>
					<FypLink
						fontSize={19}
						lineHeight={26}
						fontWeight={700}
						onPress={() => onChangeSeeAllResult(true)}
						hideUnderline
						style={tw.style("text-fans-purple")}
					>
						See all results
					</FypLink>
				</FansView>
			</FypNullableView>
		</Animated.View>
	);
};

interface Props {
	hide?: boolean;
}

const RightContents: FC<Props> = (props) => {
	const { hide } = props;
	const { state } = useAppContext();
	const { showPWAInstallPrompt } = state.common;
	const router = useRouter();
	const segments = useSegments();
	const [openLink] = useBlankLink();
	const featureGates = useFeatureGates();

	const [searchQuery, setSearchQuery] = useState("");
	const [showSearchResult, setShowSearchResult] = useState(false);
	const [seeAllResult, setSeeAllResult] = useState(false);

	const onSearch = (val: string) => {
		setSearchQuery(val);
	};

	const onCancelSearch = () => {
		setShowSearchResult(false);
		setSeeAllResult(false);
	};

	const onGoToPrivacy = () => {
		openLink(
			"https://app.termly.io/document/privacy-policy/8234c269-74cc-48b6-9adb-be080aaaee11",
		);
	};

	const onClickContact = async () => {
		openLink("https://support.fyp.fans/");
	};

	return (
		<View
			style={tw.style(
				"hidden pt-15.5 2lg:flex px-5 w-100 xl:w-[536px] xl:px-10 xl:pr-[140px] 2lg:min-h-screen",
			)}
		>
			<FansView
				position="relative"
				gap={34}
				style={tw.style(hide && "lg:hidden")}
			>
				<FansView position="relative">
					<SearchTextInput
						value={searchQuery}
						onChangeText={onSearch}
						onFocus={() => setShowSearchResult(true)}
					/>
					<FypNullableView visible={showSearchResult}>
						<FansIconButton
							size={30}
							backgroundColor="bg-fans-black dark:bg-fans-white"
							style={tw.style("absolute right-1.5 top-1.5")}
							onPress={onCancelSearch}
						>
							<FypSvg
								width={12}
								height={12}
								svg={CloseSvg}
								color="fans-white dark:fans-black"
							/>
						</FansIconButton>
					</FypNullableView>
				</FansView>
				<FypNullableView visible={showSearchResult}>
					<SearchScrollView
						searchQuery={searchQuery}
						seeAllResult={seeAllResult}
						onChangeSeeAllResult={(val) => setSeeAllResult(val)}
					/>
				</FypNullableView>

				<FypNullableView visible={!seeAllResult}>
					<GermsBlock />
					{showPWAInstallPrompt &&
						featureGates.has("2023_12-pwa-install") && (
							<PwaInstallCard />
						)}
					<SuggestedCreators />
					<FypNullableView
						visible={segments.join("/") !== "(tabs)/posts"}
					>
						<MediaContents />
					</FypNullableView>

					<View style={tw.style("flex-row pl-5 items-center mt-3")}>
						<Pressable onPress={onGoToPrivacy}>
							<FansText
								style={tw.style(
									"text-fans-grey-70 dark:text-fans-grey-b1",
								)}
								fontSize={16}
								lineHeight={21}
							>
								Privacy policy
							</FansText>
						</Pressable>
						<View
							style={tw.style(
								"w-1 h-1 bg-fans-dark-grey rounded-full mx-2",
							)}
						></View>
						<Pressable
							onPress={() => {
								router.push("/terms");
							}}
						>
							<FansText
								style={tw.style(
									"text-fans-grey-70 dark:text-fans-grey-b1",
								)}
								fontSize={16}
								lineHeight={21}
							>
								Terms of Use
							</FansText>
						</Pressable>
						<View
							style={tw.style(
								"w-1 h-1 bg-fans-dark-grey rounded-full mx-2",
							)}
						></View>
						<Pressable onPress={onClickContact}>
							<FypText
								style={tw.style(
									"text-fans-grey-70 dark:text-fans-grey-b1",
								)}
								fontSize={16}
								lineHeight={21}
							>
								Contact Us
							</FypText>
						</Pressable>
					</View>
				</FypNullableView>
			</FansView>
		</View>
	);
};

export default RightContents;
