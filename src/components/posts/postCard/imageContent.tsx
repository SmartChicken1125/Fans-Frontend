import { FypNullableView, FypCarousel } from "@components/common/base";
import FansCarousel from "@components/common/carousel";
import { FansView } from "@components/controls";
import { cdnURL } from "@helper/Utils";
import tw from "@lib/tailwind";
import { MediaType, ResizeMode } from "@usertypes/commonEnums";
import { IFypPostContent } from "@usertypes/components";
import { isDesktop } from "@utils/global";
import { Image as EImage } from "expo-image";
import React, { useState } from "react";
import TaggedPeople from "./taggedPeople";
import TaggedPeoplePopover from "./taggedPeoplePopover";

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

	return (
		<FansView
			position="relative"
			onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
		>
			<FansView height={width} margin={0}>
				<FypNullableView
					visible={data.isSelf || data.isPaidOut || !data.isPaidPost}
				>
					{isDesktop ? (
						<FansCarousel
							width={width}
							height={width}
							resizeMode={ResizeMode.COVER}
							medias={data.medias.map((el) => ({
								blurhash: el.blurhash,
								url: el.url,
								mediaType: MediaType.Image,
							}))}
							onClickItem={onClickMedia}
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
								<FansView
									width={width}
									height={width}
									pressableProps={{
										onPress: () => {
											if (onClickMedia)
												onClickMedia(index);
										},
									}}
								>
									<EImage
										source={{
											uri: cdnURL(data.url),
										}}
										style={[tw.style("w-full h-full")]}
										contentFit="cover"
										pointerEvents="none"
									/>
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

export default ImageContent;
