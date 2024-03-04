import { FypCarousel, FypNullableView, FypText } from "@components/common/base";
import FansCarousel from "@components/common/carousel";
import { FansView } from "@components/controls";
import { cdnURL } from "@helper/Utils";
import tw from "@lib/tailwind";
import { MediaType, ResizeMode } from "@usertypes/commonEnums";
import { IFypPostContent } from "@usertypes/components";
import { Image as EImage } from "expo-image";
import React, { useState } from "react";
import TaggedPeople from "./taggedPeople";

const ImageContent: IFypPostContent = (props) => {
	const { data, onClickMedia } = props;

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

	const medias =
		data.medias.length > 0 ? data.medias : data.thumb ? [data.thumb] : [];

	return (
		<FansView
			position="relative"
			onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
		>
			<FansView height={width} margin={0}>
				<FansCarousel
					width={width}
					height={width}
					resizeMode={ResizeMode.COVER}
					medias={medias.map((el) => ({
						blurhash: el.blurhash,
						url: el.url,
						mediaType: MediaType.Image,
					}))}
					onClickItem={onClickMedia}
					showBadge
					useButtons
					watermark={
						props.data.profile.watermark === true
							? `fyp.fans/${props.data.profile.profileLink}`
							: undefined
					}
				/>

				<TaggedPeople
					mediaIndex={0}
					data={data}
					onPress={handleToggleTooltip}
				/>
			</FansView>
			{/* <TaggedPeoplePopover
				visible={showTooltip}
				taggedPeoples={data.taggedPeoples}
			/> */}
		</FansView>
	);
};

export default ImageContent;
