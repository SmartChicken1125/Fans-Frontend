import { SearchSvg } from "@assets/svgs/common";
import AvatarWithStatus from "@components/common/AvatarWithStatus";
import RoundButton from "@components/common/RoundButton";
import CustomTopNavBar from "@components/common/customTopNavBar";
import AppLayout, {
	LayoutContentsContainer,
	LayoutSingleContentContainer,
} from "@components/common/layout";
import {
	FansChips,
	FansDivider,
	FansScreen3,
	FansText,
	FansTextInput,
} from "@components/controls";
import { CreateUserlistModal } from "@components/posts/dialogs";
import {
	CreateUserlistPayload,
	UpdateUserlistPayload,
} from "@components/posts/dialogs/userListDialog/createUserlistModal";
import MediaItem from "@components/profiles/mediaItem";
import { useAppContext } from "@context/useAppContext";
import { getBookmarks } from "@helper/endpoints/post/apis";
import {
	createUserlist,
	getUserlists,
	updateUserlist,
} from "@helper/endpoints/userlist/apis";
import { UserlistRespBody } from "@helper/endpoints/userlist/schemas";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MediaType, PostType, RoundButtonType } from "@usertypes/commonEnums";
import { BookmarksNavigationStacks } from "@usertypes/route";
import { IBookmark, IPost } from "@usertypes/types";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
	NativeSyntheticEvent,
	ScrollView,
	TextInputChangeEventData,
	View,
	useWindowDimensions,
} from "react-native";
import {
	TabBar as RNTabBar,
	Route,
	SceneMap,
	TabView,
} from "react-native-tab-view";
import { Props } from "react-native-tab-view/lib/typescript/src/TabBar";

const BookmarksTabView = () => {
	const router = useRouter();
	const { width: windowWidth } = useWindowDimensions();
	const [width, setWidth] = useState(0);
	const items = [
		{ text: "All", type: "*" },
		{ text: "Photos", type: "Photo" },
		{ text: "Videos", type: "Video" },
		{ text: "Audios", type: "Audio" },
		{ text: "Texts", type: "Text" },
		{ text: "Polls", type: "Poll" },
		{ text: "Fundraisers", type: "Fundraiser" },
		// { text: "Custom" },
		// { text: "Unlocked" },
	];

	const [bookmarks, setBookmarks] = useState<
		(IBookmark & { post: IPost })[][]
	>([]);
	const [selectedIndex, selectIndex] = useState(0);
	const [query, setQuery] = useState("");
	const [input, setInput] = useState("");

	const onClickPost = (postId: string) => {
		router.push(`/p/${postId}`);
	};

	useEffect(() => {
		(async () => {
			const resp = await getBookmarks({
				query: query.length > 0 ? query : undefined,
				type:
					selectedIndex !== 0 ? items[selectedIndex].type : undefined,
			});
			if (resp.ok) {
				const bookmarkArray: (IBookmark & { post: IPost })[][] = [];
				for (let i = 0; i < resp.data.bookmarks.length; i = i + 3) {
					const temp: (IBookmark & { post: IPost })[] = [];
					resp.data.bookmarks[i] && temp.push(resp.data.bookmarks[i]);
					resp.data.bookmarks[i + 1] &&
						temp.push(resp.data.bookmarks[i + 1]);
					resp.data.bookmarks[i + 2] &&
						temp.push(resp.data.bookmarks[i + 2]);
					bookmarkArray.push(temp);
				}
				setBookmarks(bookmarkArray);
			}
		})();
	}, [query, selectedIndex]);

	useEffect(() => {
		const timeoutId = setTimeout(() => setQuery(input), 500);
		return () => clearTimeout(timeoutId);
	}, [input]);
	console.log(bookmarks);
	return (
		<View
			style={tw.style("h-full", "flex")}
			onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
		>
			<View
				style={tw.style("flex gap-[10px]", "p-[15px] md:pt-10 md:px-0")}
			>
				<FansTextInput
					icon={SearchSvg}
					placeholder="Search posts"
					onChange={(
						event: NativeSyntheticEvent<TextInputChangeEventData>,
					) => {
						setInput(event.nativeEvent.text);
					}}
				/>
				<FansChips
					data={items}
					value={selectedIndex}
					onChangeValue={selectIndex}
				/>
			</View>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={tw.style("flex gap-[2px]")}>
					{bookmarks.map((ba) => (
						<View
							style={tw.style("flex-row gap-[2px]")}
							key={`${ba[0].postId}`}
						>
							{ba.map((b) => (
								<MediaItem
									key={`${ba[0].postId}-${b.postId}`}
									data={{
										id: b.post.id,
										type:
											b.post.type === PostType.Video
												? MediaType.Video
												: MediaType.Image,
										url: b.post.medias[0].url,
										updatedAt: b.post.updatedAt,
										isPinned: false,
									}}
									onPress={() => onClickPost(b.postId)}
									size={width / 3}
								/>
							))}
						</View>
					))}
				</View>
			</ScrollView>
		</View>
	);
};

const UserlistsTabView = () => {
	const [userlists, setUserlists] = useState<UserlistRespBody[]>([]);
	const [openCreatingUserlist, setOpenCreatingUserlist] = useState(false);
	const onClickCreateUserlist = () => {
		setOpenCreatingUserlist(true);
	};

	const fetchData = useCallback(async () => {
		const resp = await getUserlists();
		if (resp.ok) {
			setUserlists(resp.data.userlists);
		}
	}, [setUserlists]);

	useEffect(() => {
		fetchData();
	}, []);

	const handleCreateUserlist = useCallback(
		async (payload: CreateUserlistPayload) => {
			const resp = await createUserlist(payload);
			if (resp.ok) {
				await fetchData();
			}
			setOpenCreatingUserlist(false);
		},
		[],
	);

	const handleUpdateUserlist = useCallback(
		async (payload: UpdateUserlistPayload) => {
			const resp = await updateUserlist(payload, {
				id: payload.id,
			});
			if (resp.ok) {
				await fetchData();
			}
			setOpenCreatingUserlist(false);
		},
		[],
	);

	return (
		<FansScreen3>
			<View style={tw.style("flex pt-[15px]")}>
				{userlists.map((u, index) => (
					<View key={u.id} style={tw.style("my-[15px]")}>
						<View
							style={tw.style(
								"flex-row gap-[10px] justify-between items-center pb-4 border-white/10",
							)}
						>
							<View>
								<FansText fontSize={19}>{u.title}</FansText>
								<FansText color="grey-70" fontSize={16}>
									{u.creators.length} creators
								</FansText>
							</View>
							<View
								style={tw.style(
									"flex-row items-center",
									"relative",
								)}
							>
								{u.creators.length < 5 ? (
									<>
										{u.creators.map((c, i) => (
											<View
												key={c.id}
												style={tw.style(
													"border-2 border-white rounded-full bg-white",
													`absolute right-[${
														(u.creators.length -
															1 -
															i) *
														25
													}px]`,
												)}
											>
												<AvatarWithStatus
													size={46}
													avatar={c.avatar}
												/>
											</View>
										))}
									</>
								) : (
									<>
										{u.creators
											.filter((_, i) => i < 4)
											.map((c, i, a) => (
												<View
													key={c.id}
													style={tw.style(
														"border-2 border-white rounded-full",
														`absolute right-[${
															(a.length - 1 - i) *
															25
														}px]`,
													)}
												>
													<AvatarWithStatus
														size={46}
														avatar={c.avatar}
													/>
												</View>
											))}
										<View
											style={tw.style(
												"w-[50px] h-[50px]",
												"bg-black/50",
												"flex-row justify-center items-center",
												"border-2 border-white rounded-full",
											)}
										>
											<FansText
												style={tw.style("text-white")}
											>
												+{u.creators.length - 3}
											</FansText>
										</View>
									</>
								)}
							</View>
						</View>

						{index < userlists.length - 1 && (
							<>
								<FansDivider />
							</>
						)}
					</View>
				))}

				<RoundButton
					variant={RoundButtonType.OUTLINE_PRIMARY}
					onPress={onClickCreateUserlist}
				>
					Create list
				</RoundButton>

				<CreateUserlistModal
					open={openCreatingUserlist}
					onClose={() => setOpenCreatingUserlist(false)}
					onCreateUserlist={handleCreateUserlist}
					onUpdateUserlist={handleUpdateUserlist}
				/>
			</View>
		</FansScreen3>
	);
};

const renderScene = SceneMap({
	Bookmarks: BookmarksTabView,
	UserLists: UserlistsTabView,
});

const TabBar: React.FC<Props<Route>> = (props) => (
	<RNTabBar
		{...props}
		style={tw.style("bg-transparent")}
		activeColor={tw.prefixMatch("dark") ? "#fff" : "#000"}
		inactiveColor={tw.prefixMatch("dark") ? "#B1B1B1" : "#707070"}
		labelStyle={tw.style("normal-case", "text-[17px]")}
		indicatorStyle={tw.style("bg-fans-purple")}
	/>
);

const CollectionsScreen = (
	props: NativeStackScreenProps<BookmarksNavigationStacks, "COLLECTIONS">,
) => {
	const { navigation } = props;
	const { dispatch } = useAppContext();
	const [index, setIndex] = useState(0);
	const [routes] = useState([
		{ key: "Bookmarks", title: "Bookmarks" },
		{ key: "UserLists", title: "User lists" },
	]);

	return (
		<AppLayout>
			<View style={tw.style("flex-1")}>
				<ScrollView style={tw.style("flex-1")}>
					<LayoutContentsContainer settingsLayout hideRightSection>
						<CustomTopNavBar
							title="Collections"
							onClickLeft={() => navigation.goBack()}
						/>
						<LayoutSingleContentContainer
							style={tw.style("md:mt-7")}
						>
							<TabView
								swipeEnabled={false}
								navigationState={{ index, routes }}
								onIndexChange={setIndex}
								renderTabBar={TabBar}
								renderScene={renderScene}
							/>
						</LayoutSingleContentContainer>
					</LayoutContentsContainer>
				</ScrollView>
			</View>
		</AppLayout>
	);
};

export default CollectionsScreen;
