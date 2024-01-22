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
	FansView,
} from "@components/controls";
import { CreateUserlistModal } from "@components/posts/dialogs";
import MediaItem from "@components/profiles/mediaItem";
import { useAppContext } from "@context/useAppContext";
import { getBookmarks } from "@helper/endpoints/post/apis";
import { getUserlists } from "@helper/endpoints/userlist/apis";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MediaType, PostType, RoundButtonType } from "@usertypes/commonEnums";
import { BookmarksNavigationStacks } from "@usertypes/route";
import { IBookmark, IPost, IUserList } from "@usertypes/types";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
	NativeSyntheticEvent,
	ScrollView,
	TextInputChangeEventData,
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

	return (
		<FansView
			style={tw.style("h-full")}
			onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
		>
			<FansView gap={10} style={tw.style("p-[15px] md:pt-10 md:px-0")}>
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
			</FansView>
			<ScrollView showsVerticalScrollIndicator={false}>
				<FansView gap={2}>
					{bookmarks.map((ba) => (
						<FansView
							flexDirection="row"
							gap={2}
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
						</FansView>
					))}
				</FansView>
			</ScrollView>
		</FansView>
	);
};

const UserlistsTabView = () => {
	const [userlist, setUserlist] = useState<IUserList | null>(null);
	const [userlists, setUserlists] = useState<IUserList[]>([]);
	const [openCreatingUserlist, setOpenCreatingUserlist] = useState(false);
	const onClickCreateUserlist = () => {
		setUserlist(null);
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

	const handlePressUserList = (_userlist: IUserList) => {
		setUserlist(_userlist);
		setOpenCreatingUserlist(true);
	};

	return (
		<FansScreen3>
			<FansView padding={{ t: 15 }}>
				{userlists.map((u, index) => (
					<FansView key={u.id} margin={{ y: 15 }}>
						<FansView
							flexDirection="row"
							gap={10}
							justifyContent="between"
							alignItems="center"
							padding={{ b: 16 }}
							pressableProps={{
								onPress: () => handlePressUserList(u),
							}}
						>
							<FansView>
								<FansText fontSize={19}>{u.title}</FansText>
								<FansText color="grey-70" fontSize={16}>
									{u.creators.length} creators
								</FansText>
							</FansView>
							<FansView
								flexDirection="row"
								alignItems="center"
								position="relative"
							>
								{u.creators.length < 5 ? (
									<>
										{u.creators.map((c, i) => (
											<FansView
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
											</FansView>
										))}
									</>
								) : (
									<>
										{u.creators
											.filter((_, i) => i < 4)
											.map((c, i, a) => (
												<FansView
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
												</FansView>
											))}
										<FansView
											width={50}
											height={50}
											flexDirection="row"
											justifyContent="center"
											alignItems="center"
											borderRadius={50}
											style={tw.style(
												"bg-black/50",
												"border-2 border-white",
											)}
										>
											<FansText
												style={tw.style("text-white")}
											>
												+{u.creators.length - 3}
											</FansText>
										</FansView>
									</>
								)}
							</FansView>
						</FansView>

						{index < userlists.length - 1 && (
							<>
								<FansDivider />
							</>
						)}
					</FansView>
				))}

				<RoundButton
					variant={RoundButtonType.OUTLINE_PRIMARY}
					onPress={onClickCreateUserlist}
				>
					Create list
				</RoundButton>

				<CreateUserlistModal
					open={openCreatingUserlist}
					userlist={userlist}
					onClose={() => setOpenCreatingUserlist(false)}
					onSubmitCallback={fetchData}
				/>
			</FansView>
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
			<FansView flex="1">
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
			</FansView>
		</AppLayout>
	);
};

export default CollectionsScreen;
