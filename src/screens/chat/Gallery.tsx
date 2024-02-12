import { OutlineCamera, RecordSvg } from "@assets/svgs/common";
import OnlineAvatar from "@components/avatar/OnlineAvatar";
import { FypSvg, FypText } from "@components/common/base";
import { FansScreen2, FansText, FansView } from "@components/controls";
import { MediaDialog } from "@components/posts/dialogs";
import { MediaItem } from "@components/profiles";
import { useAppContext } from "@context/useAppContext";
import { getChannelMedias } from "@helper/endpoints/chat/apis";
import { MediasRespBody } from "@helper/endpoints/media/schemas";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { chatInboxAtom } from "@state/chat";
import { MediaType } from "@usertypes/commonEnums";
import { ChatNativeStackParams } from "@usertypes/navigations";
import { checkEnableMediasLoadingMore } from "@utils/common";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useRecoilValue } from "recoil";

const GalleryScreen = (
	props: NativeStackScreenProps<ChatNativeStackParams, "Gallery">,
) => {
	const { state } = useAppContext();
	const router = useRouter();

	const inbox = useRecoilValue(chatInboxAtom);
	const id = props.route.params?.id ?? "0";
	const conversation = inbox.data.get(id);

	const [medias, setMedias] = useState<MediasRespBody>({
		medias: [],
		page: 1,
		size: 10,
		total: 0,
		videoTotal: 0,
		imageTotal: 0,
	});
	const [filter, setFilter] = useState(MediaType.All);
	const [width, setWidth] = useState(0);
	const [openModal, setOpenModal] = useState(false);
	const [selectedMediaId, setSelectedMediaId] = useState("");

	useEffect(() => {
		const fetchMedias = async () => {
			const resp = await getChannelMedias(
				{
					id: id,
				},
				{
					page: medias.page,
					size: medias.size,
					type: filter,
				},
			);

			if (resp.ok) {
				setMedias(resp.data as MediasRespBody);
			}
		};
		fetchMedias();
	}, [filter, medias.page]);

	const onClickMedia = (mediaId: string) => {
		setSelectedMediaId(mediaId);
		setOpenModal(true);
	};

	const handleFilter = (val: MediaType) => {
		setSelectedMediaId("");
		setFilter(val);
		setMedias({
			...medias,
			page: 1,
		});
	};

	const onScrollView = () => {
		const enableLoadingMore = checkEnableMediasLoadingMore(filter, medias);
		if (enableLoadingMore) {
			setMedias({
				...medias,
				page: medias.page + 1,
			});
		}
	};

	if (!conversation) {
		return <FansScreen2 contentStyle={tw.style("pt-[0px]")}></FansScreen2>;
	}

	return (
		<View>
			<Stack.Screen
				options={{
					headerTitleAlign: "left",
					headerTitle: (props) => (
						<Pressable
							onPress={() => {
								const profileLink =
									state.profile.profileLink ||
									conversation.otherParticipant?.profileLink;
								if (profileLink) {
									router.push(`/${profileLink}`);
								}
							}}
						>
							<View
								{...props}
								style={tw.style(
									"flex-row gap-2.5 items-center",
								)}
							>
								<View style={tw.style("relative")}>
									<OnlineAvatar
										size="34px"
										image={conversation.icon || undefined}
									/>
									<View
										style={tw.style(
											"w-[11px] h-[11px]",
											"absolute right-0 bottom-0",
											"bg-fans-green",
											"border-[2px] border-white rounded-full dark:border-fans-black-1d",
										)}
									/>
								</View>
								<FansText
									fontFamily="inter-semibold"
									fontSize={16}
								>
									{conversation.name}
								</FansText>
							</View>
						</Pressable>
					),
				}}
			/>
			<ScrollView
				style={tw.style("flex-1")}
				onScroll={onScrollView}
				scrollEventThrottle={30}
				nestedScrollEnabled
			>
				<FansView
					padding={{ t: 16 }}
					onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
				>
					<FansView
						margin={{ x: 18 }}
						border={{ t: 1 }}
						style={tw.style(
							"border-fans-grey-f0 dark:border-fans-grey-43",
						)}
						padding={{ y: 12 }}
					>
						<FansView
							flexDirection="row"
							alignItems="center"
							justifyContent="between"
						>
							<FansView
								pressableProps={{
									onPress: () => handleFilter(MediaType.All),
								}}
							>
								<FypText
									fontSize={17}
									lineHeight={22}
									fontWeight={500}
									style={tw.style(
										filter === MediaType.All
											? "text-fans-purple"
											: "text-fans-grey-9d",
									)}
								>
									{`All ${medias.total}`}
								</FypText>
							</FansView>

							<FansView
								pressableProps={{
									onPress: () =>
										handleFilter(MediaType.Image),
								}}
								flexDirection="row"
								alignItems="center"
							>
								<FypSvg
									svg={OutlineCamera}
									width={23.54}
									height={20.42}
									color={
										filter === MediaType.Image
											? "fans-purple"
											: "fans-grey-9d"
									}
								/>

								<FypText
									fontSize={17}
									lineHeight={22}
									fontWeight={500}
									margin={{ l: 8 }}
									style={tw.style(
										filter === MediaType.Image
											? "text-fans-purple"
											: "text-fans-grey-9d",
									)}
								>
									{medias.imageTotal}
								</FypText>
							</FansView>

							<FansView
								pressableProps={{
									onPress: () =>
										handleFilter(MediaType.Video),
								}}
								flexDirection="row"
								alignItems="center"
							>
								<FypSvg
									svg={RecordSvg}
									width={23.54}
									height={20.42}
									color={
										filter === MediaType.Video
											? "fans-purple"
											: "fans-grey-9d"
									}
								/>
								<FypText
									fontSize={17}
									lineHeight={22}
									fontWeight={500}
									margin={{ l: 8 }}
									style={tw.style(
										filter === MediaType.Video
											? "text-fans-purple"
											: "text-fans-grey-9d",
									)}
								>
									{medias.videoTotal}
								</FypText>
							</FansView>
						</FansView>
					</FansView>

					<FansView
						flexDirection="row"
						flexWrap="wrap"
						position="relative"
					>
						{medias.medias.map((media) => (
							<MediaItem
								key={media.id}
								data={media}
								onPress={() => onClickMedia(media.id)}
								size={width / 3}
							/>
						))}
					</FansView>

					<MediaDialog
						visible={openModal}
						handleClose={() => setOpenModal(false)}
						selectedId={selectedMediaId}
						data={medias.medias}
					/>
				</FansView>
			</ScrollView>
		</View>
	);
};

export default GalleryScreen;
