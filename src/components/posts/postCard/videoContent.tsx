import {
	FypNullableView,
	FypCarousel,
	FypVideo,
} from "@components/common/base";
import FansCarousel from "@components/common/carousel";
import { FansView } from "@components/controls";
import { cdnURL } from "@helper/Utils";
import tw from "@lib/tailwind";
import { ResizeMode, MediaType } from "@usertypes/commonEnums";
import { IFypPostContent } from "@usertypes/components";
import { isDesktop } from "@utils/global";
import React, { useState } from "react";
import TaggedPeople from "./taggedPeople";
import TaggedPeoplePopover from "./taggedPeoplePopover";

const VideoContent: IFypPostContent = (props) => {
	const { data } = props;

	const [width, setWidth] = useState(100);
	const [showTooltip, setShowTooltip] = useState(false);

	const handleToggleTooltip = () => {
		if (showTooltip) {
			setShowTooltip(false);
		} else {
			setShowTooltip(true);
			setTimeout(() => setShowTooltip(false), 3000);
		}
	};

	return (
		<FansView
			position="relative"
			onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
		>
			<FansView height={width} position="relative" margin={0}>
				<FypNullableView
					visible={data.isSelf || data.isPaidOut || !data.isPaidPost}
				>
					{isDesktop ? (
						<FansCarousel
							id={`post-video-${data.id}`}
							width={width}
							height={width}
							resizeMode={ResizeMode.CONTAIN}
							medias={data.medias.map((el) => ({
								url: el.url,
								mediaType: MediaType.Video,
							}))}
							showBadge
							useButtons
						/>
					) : (
						<FypCarousel
							id={`carousel-${data.id}`}
							data={data.medias.map((el, index) => ({
								id: `${index}`,
								blurhash: el.blurhash,
								url: el.url,
								mediaType: MediaType.Image,
							}))}
							width={width}
							showBadge
							renderItem={(data, index) => (
								<FansView width={width} height={width}>
									<FypVideo
										id={`${data.id}-${index}`}
										source={{
											uri: cdnURL(data.url) ?? "",
										}}
										style={[tw.style("w-full h-full")]}
										resizeMode={ResizeMode.CONTAIN}
									/>
								</FansView>
							)}
						/>
					)}
				</FypNullableView>
				{/* <OptionalView visible={!data.isPaidPost || data.isPaidOut}>
					<IconButton
						mode="contained"
						icon={() => (
							<PlaySvg width={24.42} height={27} color="#fff" />
						)}
						style={[
							tw.style(
								"w-[68px] h-[68px] rounded-full absolute top-1/2 left-1/2",
							),
							{
								transform: [
									{ translateX: -34 },
									{ translateY: -34 },
								],
							},
						]}
						containerColor="#a854f5"
					/>
				</OptionalView> */}

				<TaggedPeople data={data} onPress={handleToggleTooltip} />
			</FansView>
			{/* <TaggedPeoplePopover
				visible={showTooltip}
				taggedPeoples={data.taggedPeoples}
			/> */}
		</FansView>
	);
};

export default VideoContent;
