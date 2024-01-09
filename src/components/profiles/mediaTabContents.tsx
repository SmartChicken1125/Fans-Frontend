import {
	FilterSvg,
	OutlineCamera,
	RecordSvg,
	SearchSvg,
} from "@assets/svgs/common";
import RoundTextInput from "@components/common/RoundTextInput";
import { FypCollapsible, FypSvg, FypText } from "@components/common/base";
import { FansView } from "@components/controls";
import { MediaDialog } from "@components/posts/dialogs";
import SubscribeAlert from "@components/profiles/subscribeAlert";
import { MediasRespBody } from "@helper/endpoints/media/schemas";
import tw from "@lib/tailwind";
import { MediaType } from "@usertypes/commonEnums";
import { ISubscription } from "@usertypes/types";
import React, { FC, useState } from "react";
import MediaItem from "./mediaItem";

interface Props {
	allCounts: number;
	medias: MediasRespBody;
	mediaType: MediaType;
	onChangeFilter: (val: MediaType) => void;
	needToSubscribe?: boolean;
	onClickSubscribe?: () => void;
	subscription?: ISubscription;
}

const MediaTabContents: FC<Props> = (props) => {
	const {
		medias,
		mediaType,
		onChangeFilter,
		allCounts,
		needToSubscribe,
		onClickSubscribe,
		subscription,
	} = props;

	const [width, setWidth] = useState(0);
	const [actionType, setActionType] = useState("filter");
	const [openModal, setOpenModal] = useState(false);
	const [selectedMediaId, setSelectedMediaId] = useState("");

	const onClickMedia = (mediaId: string) => {
		setSelectedMediaId(mediaId);
		setOpenModal(true);
	};

	return (
		<FansView
			padding={{ t: 16 }}
			onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
		>
			<FansView style={tw.style("px-[18px] md:px-0")}>
				<SubscribeAlert
					icon="media"
					hide={!needToSubscribe}
					text={`To view ${allCounts} medias, subscribe to this creator`}
					onSubscribe={onClickSubscribe}
				/>
			</FansView>

			<FansView
				flexDirection="row"
				margin={{ b: 16 }}
				style={tw.style(needToSubscribe && "hidden")}
			>
				<FansView
					alignItems="center"
					gap={24}
					flexDirection="row"
					padding={{ r: 26 }}
					style={tw.style("ml-auto")}
				>
					{/* <Pressable onPress={() => setActionType("search")}>
						<SearchSvg
							width={18}
							height={18.13}
							color={actionType === "search" ? "#a854f5" : "#000"}
						/>
					</Pressable> */}

					<FansView
						pressableProps={{
							onPress: () => setActionType("filter"),
						}}
					>
						<FilterSvg
							width={16.76}
							height={14.05}
							color={actionType === "filter" ? "#a854f5" : "#000"}
						/>
					</FansView>
				</FansView>
			</FansView>

			{/* <ScrollView
				horizontal
				contentContainerStyle={{
					paddingHorizontal: 18,
					columnGap: 7,
					marginBottom: 24,
				}}
				showsHorizontalScrollIndicator={false}
			>
				{filters.map((el) => (
					<FilterButton
						title={el}
						selected={filter === el}
						onClick={() => setFilter(el)}
						key={el}
					/>
				))}
			</ScrollView> */}
			<FypCollapsible collapsed={actionType === ""}>
				<FansView
					margin={{ x: 18 }}
					border={{ t: 1 }}
					style={tw.style(
						"border-fans-grey-f0 dark:border-fans-grey-43",
					)}
					padding={{ y: 12 }}
				>
					{actionType === "search" && (
						<RoundTextInput
							placeholder="Search media"
							customStyles="pl-11"
							icon={
								<SearchSvg
									width={15.14}
									height={15.26}
									color="#000"
								/>
							}
						/>
					)}
					{actionType === "filter" && (
						<FansView
							flexDirection="row"
							alignItems="center"
							justifyContent="between"
						>
							<FansView
								pressableProps={{
									onPress: () =>
										onChangeFilter(MediaType.All),
								}}
							>
								<FypText
									fontSize={17}
									lineHeight={22}
									fontWeight={500}
									style={tw.style(
										mediaType === MediaType.All
											? "text-fans-purple"
											: "text-fans-grey-9d",
									)}
								>
									{`All ${allCounts}`}
								</FypText>
							</FansView>

							<FansView
								pressableProps={{
									onPress: () =>
										onChangeFilter(MediaType.Image),
								}}
								flexDirection="row"
								alignItems="center"
							>
								<FypSvg
									svg={OutlineCamera}
									width={23.54}
									height={20.42}
									color={
										mediaType === MediaType.Image
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
										mediaType === MediaType.Image
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
										onChangeFilter(MediaType.Video),
								}}
								flexDirection="row"
								alignItems="center"
							>
								<FypSvg
									svg={RecordSvg}
									width={23.54}
									height={20.42}
									color={
										mediaType === MediaType.Video
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
										mediaType === MediaType.Video
											? "text-fans-purple"
											: "text-fans-grey-9d",
									)}
								>
									{medias.videoTotal}
								</FypText>
							</FansView>
						</FansView>
					)}
				</FansView>
			</FypCollapsible>

			<FansView flexDirection="row" flexWrap="wrap" position="relative">
				{(needToSubscribe ? [] : medias.medias).map((media) => (
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
	);
};

export default MediaTabContents;
