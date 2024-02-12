import { Camera1Svg } from "@assets/svgs/common";
import { FypSvg, FypText } from "@components/common/base";
import CustomTopNavBar from "@components/common/customTopNavBar";
import { FansIconButton, FansView } from "@components/controls";
import { ImagePostChip } from "@components/posts/common";
import { MediaItem } from "@components/profiles";
import { defaultPostFormData } from "@constants/defaultFormData";
import { PostsActionType, useAppContext } from "@context/useAppContext";
import { getPostMedias } from "@helper/endpoints/media/apis";
import { MediasRespBody } from "@helper/endpoints/media/schemas";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MediaType } from "@usertypes/commonEnums";
import { PostsNavigationStacks } from "@usertypes/navigations";
import { IMediaFilterQuery } from "@usertypes/params";
import { IMedia } from "@usertypes/types";
import { checkEnableMediasLoadingMore } from "@utils/common";
import React, { useState, useEffect } from "react";
import { ScrollView, NativeScrollEvent } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const VaultScreen = (
	props: NativeStackScreenProps<PostsNavigationStacks, "Vault">,
) => {
	const { navigation } = props;

	const insets = useSafeAreaInsets();
	const { state, dispatch } = useAppContext();
	const { postForm } = state.posts;

	const [mediaSize, setMediaSize] = useState(0);
	const [selectedMedias, setSelectedMedias] = useState<IMedia[]>([]);
	const [inLoadingMore, setInLoadingMore] = useState<boolean>(false);
	const [medias, setMedias] = useState<MediasRespBody>({
		medias: [],
		page: 1,
		size: 10,
		total: 0,
		videoTotal: 0,
		imageTotal: 0,
	});

	const handleNext = async () => {
		if (selectedMedias.length === 0) {
			return;
		}
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: {
				medias: selectedMedias.map((media) => ({
					id: media.id,
					uri: media.url ?? "",
					isPicker: false,
					type: selectedMedias[0].type,
				})),
				thumb: {
					id: selectedMedias[0].id,
					uri: selectedMedias[0].url ?? "",
					isPicker: false,
					type: selectedMedias[0].type,
				},
			},
		});
		navigation.navigate("Caption");
	};

	const handleCancel = () => {
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: defaultPostFormData,
		});
		navigation.goBack();
	};

	const handleToggleMedias = (media: IMedia) => {
		if (selectedMedias.find((el) => el.id === media.id)) {
			setSelectedMedias(
				selectedMedias.filter((el) => el.id !== media.id),
			);
		} else {
			if (
				selectedMedias.length > 0 &&
				selectedMedias[0].type !== media.type
			) {
				return;
			}
			setSelectedMedias([...selectedMedias, media]);
		}
	};

	const fetchMedias = async () => {
		const filterObj: IMediaFilterQuery = {
			page: medias.page,
			size: 10,
		};
		const resp = await getPostMedias(filterObj);
		setInLoadingMore(false);
		if (resp.ok) {
			setMedias({
				...resp.data,
				medias:
					resp.data.page === 1
						? resp.data.medias
						: [...medias.medias, ...resp.data.medias],
			});
		}
	};

	const onScrollView = (nativeEvent: NativeScrollEvent) => {
		const paddingToBottom = 20;
		const isScrollEnd =
			nativeEvent.layoutMeasurement.height +
				nativeEvent.contentOffset.y >=
			nativeEvent.contentSize.height - paddingToBottom;
		if (isScrollEnd && !inLoadingMore) {
			const enableLoadingMore = checkEnableMediasLoadingMore(
				MediaType.All,
				medias,
			);
			if (enableLoadingMore) {
				setInLoadingMore(true);
				setMedias({
					...medias,
					page: medias.page + 1,
				});
			}
		}
	};

	useEffect(() => {
		fetchMedias();
	}, [medias.page]);

	useEffect(() => {
		const urls = postForm.medias.map((el) => el.uri);
		setSelectedMedias(
			medias.medias.filter((el) => !!urls.includes(el.url ?? "")),
		);
	}, [medias, postForm.medias]);

	return (
		<FansView
			flex="1"
			position="relative"
			padding={{ t: insets.top }}
			style={tw.style("bg-fans-white dark:bg-fans-black-1d")}
		>
			<CustomTopNavBar
				title="New post"
				onClickLeft={handleCancel}
				onClickRight={handleNext}
				rightLabel="Next"
				titleIcon="vault"
				leftIcon="close"
			/>
			<FansView flex="1" padding={{ b: insets.bottom }}>
				<ImagePostChip
					colSpan={1}
					uri={
						selectedMedias.length > 0
							? selectedMedias[0].url ?? ""
							: ""
					}
					onPress={() => {}}
				/>
				<FansView
					flexDirection="row"
					alignItems="center"
					justifyContent="between"
					padding={{ y: 10, x: 18 }}
				>
					<FypText fontSize={19} fontWeight={700} lineHeight={26}>
						All
					</FypText>
					<FansIconButton
						size={34}
						backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
					>
						<FypSvg
							svg={Camera1Svg}
							width={18}
							height={16}
							color="fans-black dark:fans-white"
						/>
					</FansIconButton>
				</FansView>
				<FansView flex="1">
					<ScrollView
						onScroll={({ nativeEvent }) =>
							onScrollView(nativeEvent)
						}
						scrollEventThrottle={16}
						showsVerticalScrollIndicator
						nestedScrollEnabled={true}
					>
						<FansView
							flexDirection="row"
							flexWrap="wrap"
							onLayout={(e) =>
								setMediaSize(e.nativeEvent.layout.width / 3 - 2)
							}
						>
							{medias.medias.map((media) => (
								<FansView
									key={media.id}
									position="relative"
									padding={1}
									style={tw.style(
										"w-1/3 bg-fans-white dark:bg-fans-black-1d",
									)}
								>
									<MediaItem
										data={media}
										onPress={() =>
											handleToggleMedias(media)
										}
										size={mediaSize}
										showDate
										selectable
										selected={
											!!selectedMedias.find(
												(el) => el.id === media.id,
											)
										}
									/>
								</FansView>
							))}
						</FansView>
					</ScrollView>
				</FansView>
			</FansView>
		</FansView>
	);
};

export default VaultScreen;
