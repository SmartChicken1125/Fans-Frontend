import { Link1Svg } from "@assets/svgs/common";
import { FansSvg, FansText, FansView } from "@components/controls";
import { LinkPreviewRespBody } from "@helper/endpoints/stories/schemas";
import tw from "@lib/tailwind";
import React from "react";
import { Image } from "react-native";

const LinkPreviewCard = (props: {
	preview: LinkPreviewRespBody;
	isListItem: boolean;
}) => {
	return (
		<FansView
			style={tw.style([
				"flex-row",
				`h-[${props.isListItem ? 46 : 85}px]`,
				props.isListItem ? "mt-[16px] mb-[14px]" : "",
			])}
		>
			<Image
				source={{
					uri:
						(props.preview.images ?? []).filter(
							(image) => !image.endsWith(".gif"),
						)[0] ??
						(props.preview.favicons ?? []).filter(
							(image) => !image.endsWith(".gif"),
						)[0] ??
						"",
				}}
				style={[
					tw.style([
						"aspect-square h-full",
						`rounded-[${props.isListItem ? "7" : "0"}px]`,
						"overflow-hidden",
					]),
				]}
			/>

			<FansView
				style={tw.style(
					"ml-[13px] mr-[8px] flex-1 h-full overflow-hidden",
				)}
			>
				<FansText
					fontFamily="inter-regular"
					fontSize={props.isListItem ? 16 : 12}
					color={"grey-b1"}
					style={tw.style([
						props.isListItem ? "" : "mt-[8px]",
						props.isListItem ? "" : "pr-[20px]",
					])}
					numberOfLines={1}
				>
					{(props.preview.siteName ?? "") !== ""
						? props.preview.siteName
						: ((props.preview.title ?? "") !== ""
								? props.preview.title
								: props.preview.url) ?? props.preview.url}
				</FansText>

				<FansText
					fontFamily="inter-bold"
					fontSize={17}
					color={"white"}
					style={tw.style(props.isListItem ? "mt-[4px]" : "mt-[9px]")}
					numberOfLines={props.isListItem ? 1 : 2}
				>
					{props.preview.siteName ?? "" !== ""
						? (props.preview.title ?? "") !== ""
							? props.preview.title
							: props.preview.description
						: props.preview.description ?? ""}
				</FansText>

				{!props.isListItem && (
					<FansView
						style={tw.style("absolute top-[10px] right-[6px]")}
					>
						<FansSvg
							width={11.5}
							height={11.5}
							svg={Link1Svg}
							color1="white"
						/>
					</FansView>
				)}
			</FansView>
		</FansView>
	);
};

export default LinkPreviewCard;
