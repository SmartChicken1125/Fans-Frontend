import { OutlinedPlusSvg, TrashSvg, DownloadSvg } from "@assets/svgs/common";
import {
	FypText,
	FypSvg,
	FypHorizontalScrollView2,
	FypSortButton,
} from "@components/common/base";
import { FansView, FansIconButton } from "@components/controls";
import { FilterButton, MediaItem } from "@components/profiles";
import { defaultPostFormData } from "@constants/defaultFormData";
import { useAppContext, PostsActionType } from "@context/useAppContext";
import { getPostMedias } from "@helper/endpoints/media/apis";
import { MediasRespBody } from "@helper/endpoints/media/schemas";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFeatureGates } from "@state/featureGates";
import { PostStepTypes, PostType, MediaType } from "@usertypes/commonEnums";
import { VaultNavigationStacks } from "@usertypes/navigations";
import { IMediaFilterQuery } from "@usertypes/params";
import { SortType } from "@usertypes/types";
import { checkEnableMediasLoadingMore } from "@utils/common";
import React, { useState, useEffect } from "react";
import { ScrollView, NativeScrollEvent, Dimensions } from "react-native";

const { width: windowWidth } = Dimensions.get("window");

const VaultScreen = (
	props: NativeStackScreenProps<VaultNavigationStacks, "Home">,
) => {
	const featureGates = useFeatureGates();
	const { state, dispatch } = useAppContext();
	const { profile } = state;
	const [orderBy, setOrderBy] = useState<SortType>("Newest");
	const [filter, setFilter] = useState<MediaType>(MediaType.All);
	const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);
	const [inLoadingMore, setInLoadingMore] = useState<boolean>(false);
	const [medias, setMedias] = useState<MediasRespBody>({
		medias: [],
		page: 1,
		size: 10,
		total: 0,
		videoTotal: 0,
		imageTotal: 0,
	});

	const handleToggleMedias = (id: string) => {
		if (selectedMediaIds.includes(id)) {
			setSelectedMediaIds(selectedMediaIds.filter((el) => el !== id));
		} else {
			setSelectedMediaIds([...selectedMediaIds, id]);
		}
	};

	const handlePressNewPost = () => {
		const selectedMedias = medias.medias.filter((media) =>
			selectedMediaIds.includes(media.id),
		);
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: {
				...defaultPostFormData,
				type: PostType.Vault,
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
		dispatch.setPosts({
			type: PostsActionType.updatePostModal,
			data: {
				visible: true,
				step:
					selectedMedias.length === 0
						? PostStepTypes.Vault
						: PostStepTypes.Caption,
			},
		});
	};

	const handleFilter = (val: MediaType) => {
		setFilter(val);
		setMedias({
			...medias,
			page: 1,
		});
	};

	const fetchMedias = async () => {
		const filterObj: IMediaFilterQuery = {
			page: medias.page,
			size: 10,
			sort: orderBy === "Newest" ? "newest" : "latest",
		};
		if (filter !== MediaType.All) {
			filterObj.type = filter;
		}
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
				filter,
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
		if (profile.userId !== "0") {
			fetchMedias();
		}
	}, [profile.userId, medias.page, filter, orderBy]);

	return (
		<FansView
			flex="1"
			position="relative"
			style={tw.style(
				"bg-fans-white dark:bg-fans-black-1d pt-7 md:pt-11 px-[18px]",
			)}
		>
			<FansView
				flex="1"
				style={tw.style("w-full max-w-[674px] mx-auto")}
				padding={{ b: 108 }}
			>
				<FansView margin={{ b: 30 }}>
					<FypSortButton value={orderBy} handleToggle={setOrderBy} />
				</FansView>
				<FypHorizontalScrollView2>
					<FansView flexDirection="row" gap={5}>
						{[MediaType.All, MediaType.Image, MediaType.Video].map(
							(el) => (
								<FilterButton
									title={el}
									selected={filter === el}
									onClick={() => handleFilter(el)}
									key={el}
								/>
							),
						)}
					</FansView>
				</FypHorizontalScrollView2>
				<FansView
					flex="1"
					style={tw.style("mx-[-18px] md:mx-0 mt-[22px] md:mt-10")}
				>
					<ScrollView
						onScroll={({ nativeEvent }) =>
							onScrollView(nativeEvent)
						}
						scrollEventThrottle={16}
						showsVerticalScrollIndicator
						nestedScrollEnabled={true}
					>
						<FansView flexDirection="row" flexWrap="wrap">
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
											handleToggleMedias(media.id)
										}
										size={
											(tw.prefixMatch("md")
												? 674
												: windowWidth) /
												3 -
											2
										}
										showDate
										selectable
										selected={selectedMediaIds.includes(
											media.id,
										)}
									/>
								</FansView>
							))}
						</FansView>
					</ScrollView>
				</FansView>
			</FansView>
			<FansView
				position="absolute"
				bottom={0}
				left={0}
				padding={{ t: 25, b: 40, x: 18 }}
				style={tw.style(
					"w-full bg-fans-white dark:bg-fans-black-1d border-t border-fans-grey-de dark:border-fans-grey-50",
				)}
			>
				<FansView
					position="relative"
					alignItems="center"
					style={tw.style("w-full max-w-[674px] mx-auto")}
				>
					<FansView
						position="relative"
						flexDirection="row"
						gap={9}
						borderRadius={42}
						alignItems="center"
						justifyContent="center"
						style={tw.style(
							"w-[164px] md:w-[234px] h-[42px] bg-fans-purple",
						)}
						pressableProps={{
							onPress: handlePressNewPost,
						}}
					>
						<FypSvg
							svg={OutlinedPlusSvg}
							width={15}
							height={15}
							color="fans-white"
						/>
						<FypText
							fontSize={19}
							fontWeight={700}
							lineHeight={26}
							style={tw.style("text-fans-white")}
						>
							New Post
						</FypText>
					</FansView>
					<FypText
						fontSize={17}
						fontWeight={600}
						lineHeight={22}
						style={tw.style(
							"text-fans-black dark:text-fans-white",
							"absolute left-0 top-[10px]",
						)}
					>
						{filter === MediaType.All
							? `${medias.medias.length}/${medias.total}`
							: ""}
						{filter === MediaType.Image
							? `${medias.medias.length}/${medias.imageTotal}`
							: ""}
						{filter === MediaType.Video
							? `${medias.medias.length}/${medias.videoTotal}`
							: ""}
					</FypText>
					<FansView
						flexDirection="row"
						gap={7}
						position="absolute"
						right={0}
					>
						{featureGates.has("2024_02-delete-vault-medias") ? (
							<FansIconButton
								size={34}
								backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
							>
								<FypSvg
									svg={TrashSvg}
									width={12}
									height={15}
									color="fans-red"
								/>
							</FansIconButton>
						) : null}

						<FansIconButton
							size={34}
							backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
						>
							<FypSvg
								svg={DownloadSvg}
								width={12}
								height={18}
								color="fans-black dark:fans-white"
							/>
						</FansIconButton>
					</FansView>
				</FansView>
			</FansView>
		</FansView>
	);
};

export default VaultScreen;
