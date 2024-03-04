import { UserSvg } from "@assets/svgs/common";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { IPost } from "@usertypes/types";
import React, { FC } from "react";

interface Props {
	data: IPost;
	onPress?: () => void;
	mediaIndex: number;
}

const TaggedPeople: FC<Props> = (props) => {
	const { data, onPress, mediaIndex } = props;

	if (!data.medias[mediaIndex]?.tags.length) {
		return;
	}

	return (
		<FansView
			position="absolute"
			width={24}
			height={24}
			alignItems="center"
			justifyContent="center"
			borderRadius={24}
			bottom={20}
			left={17}
			style={tw.style("bg-[rgba(0,0,0,0.5)]")}
			pressableProps={{
				onPress: onPress,
			}}
		>
			<UserSvg width={11.4} height={11.6} />
		</FansView>
	);
};

export default TaggedPeople;
