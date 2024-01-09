import { CloseSvg } from "@assets/svgs/common";
import { SearchImage } from "@assets/svgs/images";
import AvatarWithStatus from "@components/common/AvatarWithStatus";
import { FypNullableView, FypSvg, FypText } from "@components/common/base";
import CustomTopNavBar from "@components/common/customTopNavBar";
import SearchTextInput from "@components/common/searchTextInput";
import Tabs from "@components/common/tabs";
import { FansDivider, FansIconButton, FansView } from "@components/controls";
import {
	CreatorsTab,
	PostsTab,
	RecentSearchsTab,
	SearchForm,
	TagsTab,
} from "@components/search";
import { searchCreators } from "@helper/endpoints/profile/apis";
import { ProfilesRespBody } from "@helper/endpoints/profile/schemas";
import tw from "@lib/tailwind";
import { SearchTabTypes } from "@usertypes/commonEnums";
import { IProfile } from "@usertypes/types";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	NativeScrollEvent,
	SafeAreaView,
	ScrollView,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const OldSearchScreen = () => {
	const [searchKey, setSearchKey] = useState("");
	const [tab, setTab] = useState<SearchTabTypes>(
		SearchTabTypes.RecentSearches,
	);

	const onSelectTag = () => {
		setTab(SearchTabTypes.Posts);
	};

	return (
		<View style={tw.style("flex-1 bg-fans-white dark:bg-fans-black-1d")}>
			<SafeAreaView style={tw.style("flex-1 pt-2")}>
				<SearchForm
					value={searchKey}
					onChange={(val) => setSearchKey(val)}
					setSearch={() => {}}
				/>
				{tab === SearchTabTypes.RecentSearches && (
					<RecentSearchsTab
						searchKey={searchKey}
						onClickSeeAll={() => setTab(SearchTabTypes.Creators)}
					/>
				)}

				{tab !== SearchTabTypes.RecentSearches && (
					<Tabs
						tabs={[
							{
								data: SearchTabTypes.Creators,
								label: "Creators",
							},
							{ data: SearchTabTypes.Posts, label: "Posts" },
							{ data: SearchTabTypes.Tags, label: "Tags" },
						]}
						selectedTab={tab}
						onChangeTab={(val) => setTab(val as SearchTabTypes)}
					/>
				)}
				{tab === SearchTabTypes.Creators && (
					<CreatorsTab searchKey={searchKey} />
				)}
				{tab === SearchTabTypes.Posts && (
					<PostsTab searchKey={searchKey} />
				)}
				{tab === SearchTabTypes.Tags && (
					<TagsTab searchKey={searchKey} onClickTag={onSelectTag} />
				)}
			</SafeAreaView>
		</View>
	);
};

const SearchScreen = () => {
	const router = useRouter();
	const insets = useSafeAreaInsets();

	const [searchQuery, setSearchQuery] = useState("");
	const [showSearchResult, setShowSearchResult] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [profiles, setProfiles] = useState<ProfilesRespBody>({
		profiles: [],
		page: 1,
		size: 10,
		total: 0,
	});

	const handleGetBack = () => {
		if (router.canGoBack()) {
			router.back();
		} else {
			router.replace("/posts");
		}
	};

	const onSearch = (val: string) => {
		setSearchQuery(val);
	};

	const onCancelSearch = () => {
		setShowSearchResult(false);
	};

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
		<FansView
			flex="1"
			position="relative"
			padding={{ t: insets.top }}
			style={tw.style("bg-fans-white dark:bg-fans-black-1d")}
		>
			<CustomTopNavBar
				title=""
				onClickLeft={handleGetBack}
				style="border-b-0 h-[50px]"
			/>
			<FansView flex="1">
				<FansView padding={{ x: 18 }} margin={{ b: 20 }}>
					<FansView
						width={59}
						height={62}
						justifyContent="center"
						alignItems="center"
						alignSelf="center"
						margin={{ t: 10, b: 16 }}
					>
						<SearchImage />
					</FansView>
					<FypText
						fontSize={21}
						lineHeight={28}
						fontWeight={700}
						textAlign="center"
						margin={{ b: 46 }}
					>
						Find creators you love
					</FypText>
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
									svg={CloseSvg}
									width={12}
									height={12}
									color="fans-white dark:fans-black-1d"
								/>
							</FansIconButton>
						</FypNullableView>
					</FansView>
				</FansView>
				<FypNullableView visible={showSearchResult}>
					<FansView flex="1">
						<ScrollView
							showsVerticalScrollIndicator={true}
							onScroll={({ nativeEvent }) =>
								onScrollView(nativeEvent)
							}
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
										<AvatarWithStatus
											avatar={user.avatar}
											size={50}
										/>
										<FansView flex="1">
											<FypText
												fontSize={17}
												lineHeight={22}
												fontWeight={700}
												style={tw.style("mb-1")}
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
					</FansView>
				</FypNullableView>
			</FansView>
		</FansView>
	);
};

export default SearchScreen;
