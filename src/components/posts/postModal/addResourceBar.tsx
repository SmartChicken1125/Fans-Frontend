import { FansView } from "@components/controls";
import { IAppDispatch } from "@context/appContext";
import { PostsActionType } from "@context/reducer/postsReducer";
import tw from "@lib/tailwind";
import { MediaType, PostType } from "@usertypes/commonEnums";
import { IPostForm } from "@usertypes/types";
import useDocumentPicker from "@utils/useDocumentPicker";
import React, { FC, useCallback, useState } from "react";
import Toast from "react-native-toast-message";
import AddResource from "./addResource";
import ResourceItem from "./resourceItem";

interface Props {
	data: IPostForm;
	dispatch: IAppDispatch;
}

const AddResourceBar: FC<Props> = (props) => {
	const { data, dispatch } = props;
	const { type, medias, carouselIndex } = data;
	const { useMediaPicker } = useDocumentPicker();
	const [resourceWidth, setResourceWidth] = useState(100);

	const onClickAdd = async () => {
		const result = await useMediaPicker();
		if (result.ok) {
			const addedResources = [...medias, ...result.data];
			dispatch.setPosts({
				type: PostsActionType.updatePostForm,
				data: {
					medias: addedResources,
					carouselIndex: addedResources.length - 1,
				},
			});
		} else {
			Toast.show({
				type: "error",
				text1: result?.message ?? "",
			});
		}
	};

	const onRemove = (mediaId: string) => {
		const mediaIndex = medias.findIndex((media) => media.id === mediaId);
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: {
				medias: medias.filter((media, _index) => media.id !== mediaId),
				carouselIndex:
					mediaIndex === medias.length - 1 &&
					carouselIndex === mediaIndex
						? mediaIndex - 1
						: carouselIndex,
			},
		});
	};

	const onSelectMedia = useCallback(
		(index: number) => {
			dispatch.setPosts({
				type: PostsActionType.updatePostForm,
				data: {
					carouselIndex: index,
				},
			});
		},
		[carouselIndex],
	);

	if (
		![
			PostType.Video,
			PostType.Photo,
			PostType.Vault,
			PostType.Media,
		].includes(type)
	) {
		return null;
	}

	return (
		<FansView
			position="absolute"
			borderRadius={15}
			gap={8}
			padding={10}
			flexDirection="row"
			style={[
				tw.style("bg-[rgba(0,0,0,0.5)] bottom-9 left-1/2"),
				{
					transform: [{ translateX: resourceWidth / -2 }],
				},
			]}
			onLayout={(e) => setResourceWidth(e.nativeEvent.layout.width)}
		>
			{medias.map((media, index) => (
				<ResourceItem
					key={`${media.id}`}
					data={media}
					mediaType={media.type}
					onClose={() => onRemove(media.id ?? "")}
					onSelect={() => onSelectMedia(index)}
				/>
			))}
			{medias.length < 5 && data.type !== PostType.Vault ? (
				<AddResource onClick={onClickAdd} />
			) : null}
		</FansView>
	);
};

export default AddResourceBar;
