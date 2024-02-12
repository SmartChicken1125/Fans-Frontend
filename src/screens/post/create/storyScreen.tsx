import {
	StoryEditDownArrowSvg,
	StoryEditGallerySvg,
} from "@assets/svgs/common";
import StoryEditCameraSvg from "@assets/svgs/common/StoryEditCamera";
import CustomTopNavBar from "@components/common/customTopNavBar";
import { FansText, FansView } from "@components/controls";
import { defaultPostFormData } from "@constants/defaultFormData";
import { PostsActionType, useAppContext } from "@context/useAppContext";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PostsNavigationStacks } from "@usertypes/navigations";
import { MediaTypeOptions, openMediaPicker } from "@utils/mediaPicker";
import { getPostTitleIcon } from "@utils/posts";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Platform, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const StoryScreen = (
	props: NativeStackScreenProps<PostsNavigationStacks, "Story">,
) => {
	const { navigation } = props;

	const insets = useSafeAreaInsets();
	const router = useRouter();
	const { state, dispatch } = useAppContext();
	const { postForm } = state.posts;

	const [recentPhotos, setRecentPhotos] = useState<string[]>([]);
	const [selectedMedia, setSelectedMedia] = useState("");

	const handleNext = async () => {
		if (selectedMedia === "") {
			return;
		}
		router.push({ pathname: "posts", params: { screen: "StoryEdit" } });
	};

	const handleCancel = () => {
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: defaultPostFormData,
		});
		navigation.goBack();
	};

	useEffect(() => {
		setSelectedMedia(postForm.medias[0]?.uri ?? "");
	}, [postForm.medias]);

	useEffect(() => {
		loadRecentPhotos();
	}, []);

	const loadRecentPhotos = async () => {
		if (Platform.OS === "android" && !(await hasAndroidPermission())) {
			return;
		}

		if (Platform.OS !== "web") {
			const CameraRoll =
				require("@react-native-camera-roll/camera-roll").CameraRoll;

			CameraRoll.getPhotos({
				first: 9,
			})
				.then(
					(r: { edges: [{ node: { image: { uri: string } } }] }) => {
						setRecentPhotos(
							r.edges.map((value) => value.node.image.uri),
						);
					},
				)
				.catch((err: Object) => {
					console.debug(err);
				});
		}
	};

	const handleOpenGallery = async () => {
		try {
			const result = await openMediaPicker({
				mediaTypes: MediaTypeOptions.Images,
				allowsMultipleSelection: false,
				capture: false,
			});

			if (!result.canceled) {
				if (result.files.length > 0) {
					const updatedMedias = [
						{
							...postForm.medias[0],
							uri: result.files[0].url,
						},
					];
					dispatch.setPosts({
						type: PostsActionType.updatePostForm,
						data: {
							medias: updatedMedias,
						},
					});
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleOpenCamera = async () => {
		try {
			const result = await openMediaPicker({
				mediaTypes: MediaTypeOptions.Images,
				allowsMultipleSelection: false,
				capture: true,
			});

			if (!result.canceled) {
				if (result.files.length > 0) {
					const updatedMedias = [
						{ ...postForm.medias[0], uri: result.files[0].url },
					];
					dispatch.setPosts({
						type: PostsActionType.updatePostForm,
						data: {
							medias: updatedMedias,
						},
					});
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	async function hasAndroidPermission() {
		const PermissionsAndroid = require("react-native").PermissionsAndroid;

		const { READ_MEDIA_IMAGES, READ_EXTERNAL_STORAGE } =
			PermissionsAndroid.PERMISSIONS;

		const getCheckPermissionPromise = async () => {
			if (Platform.Version >= "33") {
				return await PermissionsAndroid.check(READ_MEDIA_IMAGES);
			} else {
				return await PermissionsAndroid.check(READ_EXTERNAL_STORAGE);
			}
		};

		const hasPermission = await getCheckPermissionPromise();
		if (hasPermission) {
			return true;
		}
		const getRequestPermissionPromise = () => {
			if (Platform.Version >= "33") {
				return PermissionsAndroid.request(READ_MEDIA_IMAGES).then(
					(status: PermissionStatus) =>
						status === PermissionsAndroid.RESULTS.GRANTED,
				);
			} else {
				return PermissionsAndroid.request(READ_EXTERNAL_STORAGE).then(
					(status: PermissionStatus) =>
						status === PermissionsAndroid.RESULTS.GRANTED,
				);
			}
		};

		return await getRequestPermissionPromise();
	}

	return (
		<FansView
			flex="1"
			position="relative"
			padding={{ t: insets.top }}
			style={tw.style("bg-fans-white dark:bg-fans-black-1d")}
		>
			<FansView>
				<CustomTopNavBar
					title="New story"
					onClickLeft={handleCancel}
					onClickRight={handleNext}
					rightLabel="Next"
					titleIcon={getPostTitleIcon(postForm.type)}
					leftIcon="close"
				/>
				<FansView flex="1" padding={{ b: insets.bottom }}>
					<Image
						source={{
							uri: selectedMedia,
						}}
						style={[tw.style("w-full aspect-square")]}
					/>
					<FansView
						style={tw.style(
							"w-full pl-[18px] pr-[17px] pt-[10px] pb-[9px] flex-row items-center",
						)}
					>
						<FansText
							color={"black"}
							fontFamily="inter-bold"
							fontSize={19}
						>
							Recents
						</FansText>

						<StoryEditDownArrowSvg
							width={8.27}
							height={4.14}
							style={tw.style("ml-[15px]")}
						/>

						<FansView grow />

						<TouchableOpacity
							onPress={handleOpenGallery}
							style={tw.style("w-[34px] h-[34px]")}
						>
							<StoryEditGallerySvg width={34} height={34} />
						</TouchableOpacity>

						<TouchableOpacity
							onPress={handleOpenCamera}
							style={tw.style("w-[34px] h-[34px] ml-[7px]")}
						>
							<StoryEditCameraSvg width={34} height={34} />
						</TouchableOpacity>
					</FansView>

					<FlatList
						data={recentPhotos}
						renderItem={({ item, index }) => (
							<FansView
								style={{
									flex: 1,
									flexDirection: "column",
									margin: 1,
								}}
							>
								<TouchableOpacity
									key={index}
									style={{ flex: 1 }}
									onPress={() => {
										const updatedMedias = [
											{
												...postForm.medias[0],
												uri: item,
											},
										];
										dispatch.setPosts({
											type: PostsActionType.updatePostForm,
											data: {
												medias: updatedMedias,
											},
										});
									}}
								>
									<Image
										style={[
											tw.style("w-full aspect-square"),
										]}
										source={{
											uri: item,
										}}
									/>
								</TouchableOpacity>
							</FansView>
						)}
						//Setting the number of column
						numColumns={3}
						keyExtractor={(item, index) => index.toString()}
					/>
				</FansView>
			</FansView>
		</FansView>
	);
};

export default StoryScreen;
