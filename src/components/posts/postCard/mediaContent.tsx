import { FypNullableView } from "@components/common/base";
import FansCarousel from "@components/common/carousel";
import { FansView } from "@components/controls";
import { MediaType, ResizeMode } from "@usertypes/commonEnums";
import { IFypPostContent } from "@usertypes/components";
import React, { useState } from "react";
import TagItem from "./tagItem";
import TaggedPeople from "./taggedPeople";

const MediaContent: IFypPostContent = (props) => {
	const { data } = props;

	const [width, setWidth] = useState(0);
	const [carouselIndex, setCarouselIndex] = useState(0);
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
						carouselCallback={(index) => setCarouselIndex(index)}
					/>
				</FypNullableView>

				<TaggedPeople
					data={data}
					mediaIndex={carouselIndex}
					onPress={handleToggleTooltip}
				/>
			</FansView>
			{data.medias[carouselIndex]?.tags.map((tag) => (
				<TagItem
					key={tag.id}
					tag={tag}
					visible={showTooltip}
					mediaSize={width}
				/>
			))}
			{/* <TaggedPeoplePopover
				visible={showTooltip}
				taggedPeoples={data.taggedPeoples}
			/> */}
		</FansView>
	);
};

export default MediaContent;
