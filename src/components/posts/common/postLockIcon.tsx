import { GemLockSvg } from "@assets/svgs/common";
import { FypSvg } from "@components/common/base";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import React from "react";

const PostLockIcon = () => {
	return (
		<FansView
			width={120}
			height={120}
			borderRadius={120}
			backgroundColor={{
				color: "white",
				opacity: 30,
			}}
			flexDirection="row"
			alignItems="center"
			justifyContent="center"
			position="absolute"
			style={[
				tw.style("top-1/2 left-1/2"),
				{
					transform: [{ translateX: -60 }, { translateY: -60 }],
				},
			]}
		>
			<FypSvg
				width={70}
				height={66}
				svg={GemLockSvg}
				color="fans-white dark:fans-black"
			/>
		</FansView>
	);
};

export default PostLockIcon;
