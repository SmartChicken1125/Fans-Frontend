import { PlaySvg } from "@assets/svgs/common";
import { FypNullableView, FypSvg, FypText } from "@components/common/base";
import { FansView } from "@components/controls";
import { MediaDialog } from "@components/posts/dialogs";
import { CommonActionType, useAppContext } from "@context/useAppContext";
import { cdnURL, urlOrBlurHash } from "@helper/Utils";
import { getPostMediasByUserId } from "@helper/endpoints/media/apis";
import { getCreatorProfileByLink } from "@helper/endpoints/profile/apis";
import tw from "@lib/tailwind";
import { MediaType } from "@usertypes/commonEnums";
import { useLocalSearchParams, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image } from "react-native";

const MediaContents = () => {
	const segments = useSegments();
	const pageUrl = segments.join("/");
	const { username } = useLocalSearchParams();

	const { state, dispatch } = useAppContext();
	const { userInfo } = state.user;
	const { profile } = state;
	const { suggestedCreators, postMedias } = state.common;

	const [openModal, setOpenModal] = useState(false);
	const [selectedMediaId, setSelectedMediaId] = useState("");

	const fetchCreatorMedias = async () => {
		const creator = await getCreatorProfileByLink({
			profileLink: username as string,
		});
		if (creator.ok) {
			fetchMedias(creator.data.userId);
		} else {
			dispatch.setCommon({
				type: CommonActionType.setPostMedias,
				data: [],
			});
		}
	};

	const fetchMedias = async (userId: string) => {
		if (userId === "0") {
			return;
		}
		const resp = await getPostMediasByUserId({ id: userId });
		if (resp.ok) {
			dispatch.setCommon({
				type: CommonActionType.setPostMedias,
				data: resp.data.medias.filter(
					(media) =>
						media.type === MediaType.Image ||
						media.type === MediaType.Video,
				),
			});
		} else {
			dispatch.setCommon({
				type: CommonActionType.setPostMedias,
				data: [],
			});
		}
	};

	const handleClickMedia = (mediaId: string) => {
		setSelectedMediaId(mediaId);
		setOpenModal(true);
	};

	useEffect(() => {
		if (userInfo.id !== "0" || profile.userId !== "0") {
			if (pageUrl === "(tabs)/[username]") {
				fetchCreatorMedias();
			} else {
				fetchMedias(state.profile.userId);
			}
		}
	}, [userInfo.id, suggestedCreators, profile.userId, username, pageUrl]);

	return (
		<FansView>
			<FypNullableView visible={postMedias.length > 0}>
				<FypText
					fontSize={20}
					lineHeight={27}
					fontWeight={600}
					margin={{ b: 14 }}
					style={tw.style("text-fans-black dark:text-fans-white")}
				>
					Media
				</FypText>
				<FansView flexDirection="row" flexWrap="wrap">
					{postMedias.slice(0, 6).map((media, index) => (
						<FansView
							key={media.id}
							height={120}
							style={tw.style(
								"w-1/3",
								"border border-fans-white dark:border-fans-black-1d",
							)}
							pressableProps={{
								onPress: () => handleClickMedia(media.id),
							}}
						>
							{media.type === MediaType.Image && (
								<Image
									source={{
										uri: urlOrBlurHash(
											cdnURL(media.url),
											media.blurhash,
										),
									}}
									style={tw.style(
										`w-full border border-fans-white dark:border-fans-black-1d h-full`,
										index === 0 ? "rounded-tl-[15px]" : "",
										index === 2 ? "rounded-tr-[15px]" : "",
										index === 3 ? "rounded-bl-[15px]" : "",
										index === 5 ? "rounded-br-[15px]" : "",
									)}
									resizeMode="cover"
								/>
							)}

							{media.type === MediaType.Video && (
								<Image
									source={{
										uri: urlOrBlurHash(
											cdnURL(media.thumbnail),
											media.blurhash,
										),
									}}
									style={tw.style(
										`w-full border border-fans-white dark:border-fans-black-1d h-full`,
										index === 0 ? "rounded-tl-[15px]" : "",
										index === 2 ? "rounded-tr-[15px]" : "",
										index === 3 ? "rounded-bl-[15px]" : "",
										index === 5 ? "rounded-br-[15px]" : "",
									)}
									resizeMode="cover"
								/>
							)}
							<FypNullableView
								visible={media.type === MediaType.Video}
							>
								<FansView
									position="absolute"
									style={[
										tw.style("top-1/2 left-1/2"),
										{
											transform: [
												{ translateX: -13.5 },
												{ translateY: -13.5 },
											],
										},
									]}
								>
									<FypSvg
										width={27}
										height={27}
										color="fans-white"
										svg={PlaySvg}
									/>
								</FansView>
							</FypNullableView>
						</FansView>
					))}
				</FansView>
			</FypNullableView>
			<MediaDialog
				visible={openModal}
				handleClose={() => setOpenModal(false)}
				selectedId={selectedMediaId}
				data={postMedias.slice(0, 6)}
			/>
		</FansView>
	);
};

export default MediaContents;
