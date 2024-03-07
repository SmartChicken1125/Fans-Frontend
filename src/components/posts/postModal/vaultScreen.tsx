import {
	FypHorizontalScrollView2,
	FypSortButton,
} from "@components/common/base";
import { FansView } from "@components/controls";
import { FilterButton, MediaItem } from "@components/profiles";
import { IAppDispatch } from "@context/appContext";
import { PostsActionType } from "@context/useAppContext";
import { getPostMedias } from "@helper/endpoints/media/apis";
import { MediasRespBody } from "@helper/endpoints/media/schemas";
import tw from "@lib/tailwind";
import { IconTypes, MediaType, PostStepTypes } from "@usertypes/commonEnums";
import { IMediaFilterQuery } from "@usertypes/params";
import { SortType, IPostForm, IMedia } from "@usertypes/types";
import { checkEnableMediasLoadingMore } from "@utils/common";
import React, { FC, useState, useEffect } from "react";
import { ScrollView, NativeScrollEvent } from "react-native";
import ModalHeader from "./modalHeader";

interface Props {
	data: IPostForm;
	handlePrev: () => void;
	titleIcon: IconTypes;
	dispatch: IAppDispatch;
	handleChangeTab: (tab: PostStepTypes) => void;
}

const VaultScreen: FC<Props> = (props) => {
	const { data, handlePrev, titleIcon, dispatch, handleChangeTab } = props;

	const [orderBy, setOrderBy] = useState<SortType>("Newest");
	const [filter, setFilter] = useState<MediaType>(MediaType.All);
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
	const [mediaSize, setMediaSize] = useState(0);

	const handleNext = () => {
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
		handleChangeTab(PostStepTypes.Caption);
	};

	const handleFilter = (val: MediaType) => {
		setSelectedMedias([]);
		setFilter(val);
		setMedias({
			...medias,
			page: 1,
		});
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
			sort: orderBy === "Newest" ? "latest" : "oldest",
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
		fetchMedias();
	}, [medias.page, filter, orderBy]);

	useEffect(() => {
		const urls = data.medias.map((el) => el.uri);
		setSelectedMedias(
			medias.medias.filter((el) => !!urls.includes(el.url ?? "")),
		);
	}, [medias, data.medias]);

	return (
		<FansView position="relative">
			<ModalHeader
				title="New post"
				rightLabel="Next"
				onClickRight={handleNext}
				onClickLeft={handlePrev}
				titleIcon={titleIcon}
				// loading={inProgress}
			/>
			<FansView
				padding={{ t: 28 }}
				style={tw.style("md:h-[600px] xl:h-[670px]")}
			>
				<FansView padding={{ x: 33 }}>
					<FansView margin={{ b: 30 }}>
						<FypSortButton
							value={orderBy}
							handleToggle={setOrderBy}
						/>
					</FansView>
					<FypHorizontalScrollView2>
						<FansView flexDirection="row" gap={5}>
							{[
								MediaType.All,
								MediaType.Image,
								MediaType.Video,
							].map((el) => (
								<FilterButton
									title={el}
									selected={filter === el}
									onClick={() => handleFilter(el)}
									key={el}
								/>
							))}
						</FansView>
					</FypHorizontalScrollView2>
				</FansView>
				<FansView
					flex="1"
					margin={{ t: 22 }}
					style={tw.style("rounded-b-[15px]")}
				>
					<ScrollView
						onScroll={({ nativeEvent }) =>
							onScrollView(nativeEvent)
						}
						scrollEventThrottle={16}
						showsVerticalScrollIndicator
						nestedScrollEnabled={true}
						style={tw.style("rounded-b-[15px]")}
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
