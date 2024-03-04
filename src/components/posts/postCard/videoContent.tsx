import { FypNullableView } from "@components/common/base";
import FansCarousel from "@components/common/carousel";
import { FansView } from "@components/controls";
import { MediaType, ResizeMode } from "@usertypes/commonEnums";
import { IFypPostContent } from "@usertypes/components";
import React, { useState } from "react";

const VideoContent: IFypPostContent = (props) => {
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
						watermark={
							props.data.profile.watermark === true
								? `fyp.fans/${props.data.profile.profileLink}`
								: undefined
						}
					/>
				</FypNullableView>

				{/* <TaggedPeople data={data} onPress={handleToggleTooltip} /> */}
			</FansView>
			{/* <TaggedPeoplePopover
				visible={showTooltip}
				taggedPeoples={data.taggedPeoples}
			/> */}
		</FansView>
	);
};

export default VideoContent;
