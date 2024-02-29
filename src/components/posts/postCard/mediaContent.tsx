import {
	FypCarousel,
	FypNullableView,
	FypText,
	FypVideo,
} from "@components/common/base";
import FansCarousel from "@components/common/carousel";
import { FansView } from "@components/controls";
import { cdnURL } from "@helper/Utils";
import tw from "@lib/tailwind";
import { MediaType, ResizeMode } from "@usertypes/commonEnums";
import { IFypPostContent } from "@usertypes/components";
import { isDesktop } from "@utils/global";
import React, { useState } from "react";
import TaggedPeople from "./taggedPeople";

const MediaContent: IFypPostContent = (props) => {
	const { data } = props;

	const [width, setWidth] = useState(0);
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
					visible={
						data.isSelf ||
						data.isPaidOut ||
						!data.isPaidPost ||
						width !== 0
					}
				>
					{isDesktop ? (
						<FansCarousel
							id={`post-video-${data.id}`}
							width={width}
							height={width}
							resizeMode={ResizeMode.CONTAIN}
							medias={data.medias.map((el) => ({
								url: el.url,
								mediaType: el.type as MediaType,
							}))}
							showBadge
							useButtons
							watermark={
								props.data.profile.watermark === true
									? `fyp.fans/${props.data.profile.profileLink}`
									: undefined
							}
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
									<FypText
										fontSize={17}
										color="white"
										style={tw.style(
											"right-[17px] bottom-[20px] absolute",
										)}
									>
										{`fyp.fans/${props.data.profile.profileLink}`}
									</FypText>
								</FansView>
							)}
						/>
					)}
				</FypNullableView>

				<TaggedPeople data={data} onPress={handleToggleTooltip} />
			</FansView>
			{/* <TaggedPeoplePopover
				visible={showTooltip}
				taggedPeoples={data.taggedPeoples}
			/> */}
		</FansView>
	);
};

export default MediaContent;
