import {
	SearchSvg,
	StoryEditAaSvg,
	StoryEditAtSvg,
	StoryEditBackSvg,
	StoryEditCropSvg,
	StoryEditLinkSvg,
	StoryEditNextArrowSvg,
	StoryEditScanColorSvg,
} from "@assets/svgs/common";
import UserAvatar from "@components/avatar/UserAvatar";
import { FypLinearGradientView, FypSvg } from "@components/common/base";
import { ImageEditor } from "@components/common/imageEditor/imageEditor";
import {
	FansGap,
	FansHorizontalDivider,
	FansText,
	FansView,
} from "@components/controls";
import UploadProgress from "@components/posts/common/uploadProgress";
import LinkPreviewCard from "@components/posts/postModal/linkPreviewCard";
import { defaultPostFormData } from "@constants/defaultFormData";
import {
	PostsActionType,
	ProfileActionType,
	useAppContext,
} from "@context/useAppContext";
import { cdnURL } from "@helper/Utils";
import { createStory, getLinkPreview } from "@helper/endpoints/stories/apis";
import { LinkPreviewRespBody } from "@helper/endpoints/stories/schemas";
import { getUsers } from "@helper/endpoints/users/apis";
import { UsersRespBody } from "@helper/endpoints/users/schemas";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MediaType, PostStepTypes, PostType } from "@usertypes/commonEnums";
import { PostsNavigationStacks } from "@usertypes/navigations";
import { FontFamilyStyle } from "@usertypes/styles";
import { IUserInfo } from "@usertypes/types";
import useUploadFiles from "@utils/useUploadFile";
import { validateSocialLink } from "@utils/validateHelper";
import { openURL } from "expo-linking";
import { useRouter } from "expo-router";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import {
	FlatList,
	Image,
	NativeScrollEvent,
	ScrollView,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const StoryEditScreen = (
	props: NativeStackScreenProps<PostsNavigationStacks, "StoryEdit">,
) => {
	const { state, dispatch } = useAppContext();
	const { uploadFiles, cancelUpload, progress } = useUploadFiles();
	const router = useRouter();
	const insets = useSafeAreaInsets();

	const { postForm } = state.posts;
	const { stories } = state.profile;

	const handleClose = () => {
		setIsCrop(false);
		setIsText(false);
		setIsLink(false);
		setIsMention(false);

		dispatch.setPosts({
			type: PostsActionType.updateStoryModal,
			data: {
				visible: false,
			},
		});
	};

	const handleBack = () => {
		handleClose();

		dispatch.setPosts({
			type: PostsActionType.updatePostModal,
			data: {
				visible: true,
				step: PostStepTypes.Thumbnail,
			},
		});
	};

	const [isCrop, setIsCrop] = useState(false);
	const [isText, setIsText] = useState(false);
	const [isLink, setIsLink] = useState(false);
	const [isMention, setIsMention] = useState(false);

	const handleCrop = () => {
		setIsCrop(!isCrop);
		setIsText(false);
		setIsLink(false);
		setIsMention(false);
	};
	const handleText = () => {
		setIsCrop(false);
		setIsText(!isText);
		setIsLink(false);
		setIsMention(false);
	};
	const handleLink = () => {
		setIsCrop(false);
		setIsText(false);
		setIsLink(!isLink);
		setIsMention(false);
	};
	const handleMention = () => {
		setIsCrop(false);
		setIsText(false);
		setIsLink(false);
		if (!isMention) {
			setSelectedUser(null);
		}
		setIsMention(!isMention);
	};

	const handleImageEditingComplete = (uri: string) => {
		setIsCrop(false);

		const updatedMedias = [{ ...postForm.medias[0], uri: uri }];
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: {
				medias: updatedMedias,
			},
		});
	};

	const [colorPage, setColorPage] = useState(0);
	const [selectedTextColor, setSelectedTextColor] = useState("ffffff");
	const [selectedMentionColor, setSelectedMentionColor] = useState("000000");
	const colors = [
		"ffffff",
		"c0c0c0",
		"808080",
		"000000",
		"ff0000",
		"800000",
		"ffff00",
		"808000",
		"00ff00",
		"008000",
		"00ffff",
		"008080",
		"0000ff",
		"000080",
		"ff00ff",
		"800080",
	];
	const handleScanColor = () => {};
	const handleSelectColor = (color: string) => {
		if (isText) {
			setSelectedTextColor(color);
		} else if (isMention) {
			setSelectedMentionColor(color);
		}
	};

	const fonts: FontFamilyStyle[] = [
		"inter-regular",
		"inter-light",
		"inter-bold",
		"inter-medium",
		"inter-semibold",
		"inter-black",
	];
	const [selectedFont, setSelectedFont] = useState("inter-regular");
	const handleSelectFont = (font: string) => {
		setSelectedFont(font);
	};

	const textInput =
		useRef<TextInput | null>() as MutableRefObject<TextInput | null>;
	const [text, setText] = useState("");
	useEffect(() => {
		if (isText) {
			textInput.current?.focus();
		}
	}, [isText]);

	const mentionInput =
		useRef<TextInput | null>() as MutableRefObject<TextInput | null>;
	const [mention, setMention] = useState("");
	useEffect(() => {
		if (isMention) {
			mentionInput.current?.focus();
		}
	}, [isMention]);

	const [users, setUsers] = useState<UsersRespBody>({
		users: [],
		page: 1,
		total: 0,
		size: 10,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [selectedUser, setSelectedUser] = useState<IUserInfo | null>(null);

	const fetchUsers = async () => {
		const params = {
			page: users.page,
			size: 10,
			query: mention,
		};
		const resp = await getUsers(params);
		if (resp.ok) {
			setUsers({
				...resp.data,
				users:
					resp.data.page === 1
						? resp.data.users
						: [...users.users, ...resp.data.users],
			});
		}
		setIsLoading(false);
	};

	const usersScrollRef =
		useRef<ScrollView | null>() as MutableRefObject<ScrollView | null>;
	const onScrollView = (nativeEvent: NativeScrollEvent) => {
		const paddingToRight = 20;
		const isScrollEnd =
			nativeEvent.layoutMeasurement.width + nativeEvent.contentOffset.x >=
			nativeEvent.contentSize.width - paddingToRight;
		if (isScrollEnd && !isLoading) {
			if (users.total > 10 * users.page) {
				setIsLoading(true);
				setUsers({
					...users,
					page: users.page + 1,
				});
			}
		}
	};
	useEffect(() => {
		if (mention.length > 0) {
			fetchUsers();
		} else {
			setUsers({
				...users,
				users: [],
				page: 1,
				total: 0,
			});
		}
	}, [mention, users.page]);

	const [link, setLink] = useState("");
	const [links, setLinks] = useState<string[]>(
		(localStorage.getItem("recentStoryLinks") ?? "")
			.split(" ")
			.filter((item) => item !== ""),
	);
	const [selectedLink, setSelectedLink] = useState("");
	const [linkPreviews, setLinkPreviews] = useState<{
		[key: string]: LinkPreviewRespBody;
	}>({});

	useEffect(() => {
		(async () => {
			await Promise.all(
				links
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
	}, [links]);

	const handleDone = () => {
		if (isText) {
			setIsText(false);
		}
		if (isMention) {
			setIsMention(false);
		}
		if (isLink) {
			let url = link;
			if (!link.startsWith("http://") && !link.startsWith("https://")) {
				url = "https://" + url;
			}

			if (
				validateSocialLink({
					id: "",
					provider: "website",
					url: url,
					title: "",
				}).isValid
			) {
				setSelectedLink(url);

				let newLinks = [url, ...links];
				newLinks = newLinks
					.filter((value, index) => newLinks.indexOf(value) === index)
					.slice(0, 10);

				localStorage.setItem("recentStoryLinks", newLinks.join(" "));
				setLinks(newLinks);
				setIsLink(false);
			} else {
				Toast.show({
					type: "error",
					text1: "Invalid link URL",
				});
			}
		}
	};

	const [inProgress, setInProgress] = useState(false);
	const handleShareToStory = async () => {
		setInProgress(true);
		const uploaded = await uploadFiles([
			{ uri: postForm.medias[0]?.uri ?? "", type: MediaType.Image },
		]);
		if (!uploaded.ok) {
			setInProgress(false);
			Toast.show({
				type: "error",
				text1: uploaded.error?.message ?? "Failed to upload files",
			});
			return;
		}
		const postBody = {
			mediaId: uploaded.data[0]?.id ?? "",
			storyUrls:
				selectedLink !== ""
					? [{ url: selectedLink, pointX: 0, pointY: 0 }]
					: [],
			storyTags: selectedUser
				? [
						{
							userId: selectedUser.profile?.userId ?? "",
							color: "0x" + selectedMentionColor,
							pointX: 0,
							pointY: 0,
						},
				  ]
				: [],
			storyTexts:
				text !== ""
					? [
							{
								text: text,
								color: "0x" + selectedTextColor,
								font: selectedFont,
								pointX: 0,
								pointY: 0,
							},
					  ]
					: [],
		};
		const resp = await createStory(postBody);
		setInProgress(false);
		if (resp.ok) {
			handleClose();

			dispatch.setProfile({
				type: ProfileActionType.updateProfile,
				data: {
					stories: [...stories, resp.data],
				},
			});
			router.push({
				pathname: "profile",
				params: { screen: "Profile" },
			});
			dispatch.setPosts({
				type: PostsActionType.initPostForm,
				data: defaultPostFormData,
			});
			dispatch.setPosts({
				type: PostsActionType.updateLiveModal,
				data: {
					visible: true,
					postId: resp.data.id,
					postType: PostType.Story,
				},
			});
		} else {
			Toast.show({
				type: "error",
				text1: "Failed to create a new story",
			});
		}
	};

	return (
		<FansView
			flex="1"
			position="relative"
			padding={{ t: insets.top }}
			style={tw.style("bg-fans-white dark:bg-fans-black-1d")}
		>
			{!inProgress ? (
				<FansView
					style={tw.style("bg-black bg-opacity-80 w-full h-full")}
				>
					<FansView style={tw.style("flex-row grow")}>
						{!isCrop ? (
							<Image
								source={{
									uri: cdnURL(postForm.medias[0]?.uri),
								}}
								style={[tw.style("w-full h-full")]}
								resizeMode="cover"
							/>
						) : (
							<ImageEditor
								visible={isCrop}
								onCloseEditor={() => setIsCrop(false)}
								imageUri={postForm.medias[0]?.uri ?? ""}
								fixedCropAspectRatio={16 / 9}
								lockAspectRatio={false}
								minimumCropDimensions={{
									width: 100,
									height: 100,
								}}
								onEditingComplete={(result) => {
									handleImageEditingComplete(result.uri);
								}}
							/>
						)}

						{isText ? (
							<TextInput
								ref={textInput}
								textAlign={"center"}
								value={text}
								style={[
									tw.style(
										`font-${selectedFont}`,
										"text-[24px] ",
										"absolute left-[20px] right-[20px] top-[110px] bottom-[110px] text-center",
									),
									{
										color: `#${selectedTextColor}`,
										outlineStyle: "none",
									},
								]}
								onChangeText={setText}
								onBlur={() => textInput.current?.focus()}
							/>
						) : (
							!isLink &&
							!isCrop &&
							!isMention && (
								<FansView
									style={tw.style(
										"absolute left-[20px] right-[20px] top-[110px] bottom-[110px]",
									)}
								>
									<FansText
										style={[
											tw.style(
												`font-${selectedFont}`,
												"text-[24px] text-center",
												"w-full mt-auto mb-auto",
											),
											{
												color: `#${selectedTextColor}`,
											},
										]}
									>
										{text}
									</FansText>
								</FansView>
							)
						)}

						{isLink ? (
							<FansView
								style={tw.style(
									"absolute left-0 right-0 top-0 bottom-0 bg-black bg-opacity-85 pt-[93px] pl-[17px] pr-[18px] pb-[9px]",
								)}
							>
								<FansView
									style={tw.style(
										"rounded-full w-full h-[42px] bg-gray-700 flex-row pl-[16px] pr-[12px] items-center",
									)}
								>
									<FypSvg
										width={15.14}
										height={15.26}
										svg={SearchSvg}
										color="fans-white"
									/>

									<TextInput
										value={link}
										onChangeText={setLink}
										placeholder="Type a URL"
										style={[
											tw.style(
												"font-inter-regular text-[19px]",
												"flex-1 ml-[12px]",
											),
											{
												color: "white",
												outlineStyle: "none",
											},
										]}
									/>
								</FansView>

								<FlatList
									data={links}
									keyExtractor={(_, index) =>
										index.toString()
									}
									style={tw.style("flex mt-[15px]")}
									renderItem={(link) => (
										<FansView>
											<TouchableOpacity
												key={link.index}
												onPress={() => {
													setSelectedLink(link.item);
													setIsLink(false);
												}}
											>
												<LinkPreviewCard
													preview={
														linkPreviews[
															link.item
														] ?? {
															url: link.item,
														}
													}
													isListItem={true}
												/>
											</TouchableOpacity>
											<FansHorizontalDivider />
										</FansView>
									)}
								/>
							</FansView>
						) : (
							!isText &&
							!isMention &&
							!isCrop &&
							selectedLink !== "" && (
								<TouchableOpacity
									style={tw.style(
										"absolute w-[245px] h-[85px] bg-black bg-opacity-75 rounded-[7px] left-[60px] top-[100px]",
									)}
									onPress={() => openURL(selectedLink)}
								>
									<LinkPreviewCard
										preview={
											linkPreviews[selectedLink] ?? {
												url: selectedLink,
											}
										}
										isListItem={false}
									/>
								</TouchableOpacity>
							)
						)}

						{isMention && !selectedUser ? (
							<TextInput
								ref={mentionInput}
								textAlign={"center"}
								value={"@" + mention}
								style={[
									tw.style(
										"font-inter-medium",
										"text-[22px] ",
										"absolute left-[20px] right-[20px] top-[110px] bottom-[110px] text-center",
									),
									{
										color: "white",
										outlineStyle: "none",
									},
								]}
								onChangeText={(text) => {
									if (text.startsWith("@")) {
										setMention(text.substring(1));
									} else {
										setMention(text);
									}
									setUsers({
										...users,
										page: 1,
										total: 0,
									});
									setSelectedUser(null);
								}}
								onBlur={() => mentionInput.current?.focus()}
							/>
						) : (
							!isText &&
							!isLink &&
							!isCrop &&
							selectedUser && (
								<FansView
									style={tw.style(
										"absolute left-[20px] right-[20px] top-[400px]",
									)}
								>
									<FansText
										style={[
											tw.style(
												"font-inter-medium",
												"text-[22px]",
												"ml-auto mr-auto mt-auto mb-auto",
												"pt-[4px] pb-[8px] pl-[23px] pr-[31px]",
												"rounded-full",
											),
											{
												color: "white",
												backgroundColor: `#${selectedMentionColor}`,
											},
										]}
									>
										@{selectedUser.displayName}
									</FansText>
								</FansView>
							)
						)}

						{isText && (
							<FansView
								style={tw.style(
									"absolute left-[15px] right-[15px] bottom-[12px] flex-row justify-between",
								)}
							>
								{fonts.map((font) => (
									<TouchableOpacity
										onPress={() => handleSelectFont(font)}
									>
										<FansText
											fontFamily={font}
											color={"white"}
											fontSize={20}
										>
											Aa
										</FansText>
									</TouchableOpacity>
								))}
							</FansView>
						)}

						<FansView
							style={tw.style(
								`absolute flex-row mt-[19px] w-full ${
									isCrop ? "hidden" : ""
								}`,
							)}
						>
							<FansView style={tw.style("flex-1 mt-[6px]")}>
								<TouchableOpacity
									style={tw.style(
										"rounded-full bg-black bg-opacity-50 w-[34px] h-[34px] ml-[16px]",
									)}
									onPress={handleBack}
								>
									<StoryEditBackSvg width={34} height={34} />
								</TouchableOpacity>
							</FansView>

							<TouchableOpacity
								style={tw.style(
									`rounded-full bg-${
										isCrop ? "white" : "black"
									} bg-opacity-50 w-[47px] h-[47px] items-center`,
								)}
								onPress={handleCrop}
							>
								<StoryEditCropSvg
									width={22.39}
									height={22.4}
									style={tw.style("mt-auto mb-auto")}
									color={isCrop ? "black" : "white"}
								/>
							</TouchableOpacity>

							<FansGap width={9} />

							<TouchableOpacity
								style={tw.style(
									`rounded-full bg-${
										isText ? "white" : "black"
									} bg-opacity-50 w-[47px] h-[47px] items-center`,
								)}
								onPress={handleText}
							>
								<StoryEditAaSvg
									width={26}
									height={31}
									style={tw.style("mt-auto mb-auto")}
									color={isText ? "black" : "white"}
								/>
							</TouchableOpacity>

							<FansGap width={14} />

							<TouchableOpacity
								style={tw.style(
									`rounded-full bg-${
										isLink ? "white" : "black"
									} bg-opacity-50 w-[47px] h-[47px] items-center`,
								)}
								onPress={handleLink}
							>
								<StoryEditLinkSvg
									width={23.67}
									height={22.4}
									style={tw.style("mt-auto mb-auto")}
									color={isLink ? "black" : "white"}
								/>
							</TouchableOpacity>

							<FansGap width={14} />

							<TouchableOpacity
								style={tw.style(
									`rounded-full bg-${
										isMention ? "white" : "black"
									} bg-opacity-50 w-[47px] h-[47px] items-center`,
								)}
								onPress={handleMention}
							>
								<StoryEditAtSvg
									width={22}
									height={31}
									style={tw.style("mt-auto mb-auto")}
									color={isMention ? "black" : "white"}
								/>
							</TouchableOpacity>

							<FansView style={tw.style("flex-1  mt-[12px]")}>
								{(isText || isLink || isMention) && (
									<TouchableOpacity
										style={[
											tw.style(
												"ml-auto mr-[18px] h-full",
											),
										]}
										onPress={handleDone}
									>
										<FansText
											style={tw.style(
												"text-white font-inter-bold text-[17px]",
											)}
										>
											Done
										</FansText>
									</TouchableOpacity>
								)}
							</FansView>
						</FansView>
					</FansView>

					<FansGap height={16} />

					<FansView style={tw.style("w-full h-[67px]")}>
						{!isCrop && !isText && !isLink && !isMention && (
							<TouchableOpacity
								style={tw.style(
									"absolute h-[42px] top-0 left-17 right-18",
								)}
								onPress={handleShareToStory}
							>
								<FypLinearGradientView
									colors={["#D885FF", "#A854f5", "#1D21E5"]}
									start={[1, 0]}
									end={[0, 1]}
									style={tw.style(
										"w-full h-[42px] rounded-full",
									)}
								>
									<FansView
										style={tw.style(
											"w-full h-full flex-row items-center",
										)}
									>
										<FansText
											color={"white"}
											fontSize={19}
											fontFamily="inter-bold"
											style={tw.style(
												"mt-auto mb-auto ml-auto mr-auto",
											)}
										>
											Share to story
										</FansText>

										<StoryEditNextArrowSvg
											width={15.31}
											height={10.35}
											style={tw.style(
												"absolute right-[14px] mt-auto mb-auto",
											)}
										/>
									</FansView>
								</FypLinearGradientView>
							</TouchableOpacity>
						)}

						{(isText || (isMention && selectedUser)) && (
							<FansView>
								<FansView
									style={tw.style(
										"flex-row items-center pl-[18px] pr-[18px]",
									)}
								>
									<TouchableOpacity
										style={tw.style(
											"w-[40px] h-[39px] mr-[7px]",
										)}
										onPress={handleScanColor}
									>
										<StoryEditScanColorSvg
											width={40}
											height={40}
										/>
									</TouchableOpacity>

									<ScrollView
										horizontal
										pagingEnabled
										showsHorizontalScrollIndicator={false}
										onScroll={(event) => {
											const contentOffset =
												event.nativeEvent.contentOffset;
											const page = Math.round(
												contentOffset.x / 408,
											);
											setColorPage(page);
										}}
										scrollEventThrottle={16}
										style={{ flex: 1 }}
									>
										<FlatList
											data={[1, 2]}
											keyExtractor={(item, index) =>
												index.toString()
											}
											renderItem={(item) => (
												<FansView
													style={tw.style(
														"flex-row items-center",
													)}
													key={item.item}
												>
													{colors
														.slice(
															8 * (item.item - 1),
															Math.min(
																colors.length -
																	1,
																8 * item.item,
															),
														)
														.map((color, i) => (
															<TouchableOpacity
																style={tw.style(
																	"w-[26px] h-[26px] rounded-full border border-white overflow-hidden ml-[6px] mr-[7px]",
																)}
																onPress={() =>
																	handleSelectColor(
																		color,
																	)
																}
															>
																<View
																	style={{
																		width: "100%",
																		height: "100%",
																		backgroundColor: `#${color}`,
																	}}
																/>
															</TouchableOpacity>
														))}
												</FansView>
											)}
											horizontal
											pagingEnabled
											showsHorizontalScrollIndicator={
												false
											}
											getItemLayout={(data, index) => ({
												length: 312,
												offset: 312 * index,
												index,
											})}
										/>
									</ScrollView>
								</FansView>

								<View
									style={{
										flexDirection: "row",
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									{[1, 2].map((_, index) => (
										<View
											key={index}
											style={{
												width:
													colorPage === index
														? 12
														: 8,
												height:
													colorPage === index
														? 12
														: 8,
												borderRadius:
													colorPage === index ? 6 : 4,
												backgroundColor:
													colorPage === index
														? "white"
														: "gray",
												margin: 4,
											}}
										/>
									))}
								</View>
							</FansView>
						)}
					</FansView>

					{isMention && !selectedUser && (
						<FansView
							style={tw.style(
								"absolute left-0 right-0 bottom-[12px] h-[96px]",
							)}
						>
							<FansView style={tw.style("w-full h-full")}>
								<ScrollView
									horizontal
									pagingEnabled
									showsHorizontalScrollIndicator
									scrollEventThrottle={16}
									style={{ flex: 1 }}
									ref={usersScrollRef}
								>
									<FlatList
										data={users.users}
										keyExtractor={(item, index) =>
											index.toString()
										}
										renderItem={(item) => (
											<FansView
												style={tw.style(
													"flex-row items-center",
												)}
												key={item.index}
											>
												<TouchableOpacity
													style={tw.style(
														"w-[68px] h-[96px] overflow-hidden ml-[12px] mr-[12px]",
													)}
													onPress={() =>
														setSelectedUser(
															item.item,
														)
													}
												>
													<UserAvatar
														image={
															item.item.avatar ??
															""
														}
														size="68px"
													/>
													<FansText
														style={tw.style(
															"text-white text-[15px] text-center",
														)}
													>
														{item.item.username}
													</FansText>
												</TouchableOpacity>
											</FansView>
										)}
										horizontal
										pagingEnabled
										showsHorizontalScrollIndicator={false}
									/>
								</ScrollView>
							</FansView>
						</FansView>
					)}
				</FansView>
			) : (
				<FansView style={tw.style("mt-auto mb-auto ml-auto mr-auto")}>
					<UploadProgress
						onCancel={cancelUpload}
						progress={progress}
					/>
				</FansView>
			)}
		</FansView>
	);
};

export default StoryEditScreen;
