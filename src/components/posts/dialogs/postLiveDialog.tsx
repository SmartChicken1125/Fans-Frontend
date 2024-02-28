import {
	CloseSvg,
	CopyLinkSvg,
	PinterestSvg,
	InstagramSvg,
	OutlinedTweetSvg,
} from "@assets/svgs/common";
import { FypLink, FypText, FypModal, FypSvg } from "@components/common/base";
import { FansView, FansIconButton } from "@components/controls";
import { PostsActionType, useAppContext } from "@context/useAppContext";
import tw from "@lib/tailwind";
import { ActionType, PostType } from "@usertypes/commonEnums";
import { useBlankLink } from "@utils/useBlankLink";
import useClipboard from "@utils/useClipboard";
import { createURL } from "expo-linking";
import moment from "moment";
import React, { FC, useState, useEffect } from "react";
import { Image, Pressable, ImageBackground } from "react-native";

interface Props {
	closeCallback?: (postId: string, action: ActionType) => void;
}

const PostLiveDialog: FC<Props> = (props) => {
	const { closeCallback } = props;
	const [openLink] = useBlankLink();
	const { copyString } = useClipboard();
	const [copied, setCopied] = useState(false);
	const { state, dispatch } = useAppContext();
	const { profile } = state;

	const {
		visible,
		postId,
		action = ActionType.Create,
		schedule,
		postType = PostType.Media,
	} = state.posts.liveModal;

	const onClose = () => {
		if (closeCallback) {
			closeCallback(postId, action);
		}
		dispatch.setPosts({
			type: PostsActionType.updateLiveModal,
			data: {
				visible: false,
			},
		});
	};

	const onClickCopy = async () => {
		let url = "";
		if (postType === PostType.Story) {
			url = createURL(
				`stories?userId=${profile.userId}&storyId=${postId}&screen=Profile`,
			);
		} else {
			url = createURL(`p/${postId}`);
		}

		await copyString(url);
		setCopied(true);
	};

	const onClickTweet = () => {
		openLink("https://tweet.com");
	};

	const onClickShare = () => {};

	const onClickPinterest = () => {
		openLink("https://test.com");
	};

	useEffect(() => {
		setCopied(false);
	}, [visible]);

	return (
		<FypModal
			visible={visible}
			onDismiss={onClose}
			width={{ xs: "full" }}
			maxWidth={358}
		>
			<FansView>
				<FansView position="relative">
					<Image
						source={require("@assets/images/posts/post-live-1.png")}
						style={tw.style("w-full h-[148px] rounded-t-[15px]")}
						resizeMode="cover"
					/>
					<FansIconButton
						backgroundColor="bg-fans-black/30 dark:bg-fans-white/30"
						size={25}
						style={tw.style("absolute top-3.5 right-3.5")}
						onPress={onClose}
					>
						<FypSvg
							svg={CloseSvg}
							width={10.5}
							height={10.5}
							color="fans-white"
						/>
					</FansIconButton>
				</FansView>
				<FansView
					padding={{ t: 30, x: 38, b: 22 }}
					borderRadius={{ b: 15 }}
					style={tw.style("bg-fans-white dark:bg-fans-black-1d")}
				>
					<FypText
						fontSize={23}
						lineHeight={31}
						fontWeight={700}
						textAlign="center"
						margin={{ b: 18 }}
						style={tw.style("text-fans-black dark:text-fans-white")}
					>
						{action === ActionType.Create
							? `${
									schedule
										? `Your post is scheduled at ${moment(
												schedule.startDate,
										  ).format("MM/DD/YYYY HH:mm")}`
										: "Your post is live!"
							  }`
							: "Your post is updated!"}
					</FypText>
					<FypText
						fontSize={16}
						lineHeight={21}
						textAlign="center"
						style={tw.style("text-fans-black dark:text-fans-white")}
					>
						Spread the word and inspire your community to be active
						fans by sharing your fresh content
					</FypText>
					{schedule ? null : (
						<FypLink
							fontSize={16}
							lineHeight={21}
							fontWeight={500}
							textAlign="center"
							margin={{ t: 20 }}
							hideUnderline
							color="purple"
							onPress={onClickCopy}
						>
							{copied ? "Copied" : "Copy Link"}
						</FypLink>
					)}

					{/* <View style={tw.style("flex-row justify-between")}>
							<View style={tw.style("items-center")}>
								<Pressable
									style={tw.style("mb-2 w-11.5 h-11.5")}
									onPress={onClickCopy}
								>
									<View
										style={tw.style(
											"bg-fans-purple rounded-full w-full h-full flex items-center justify-center",
										)}
									>
										<CopyLinkSvg
											size={24.35}
											color="#fff"
										/>
									</View>
								</Pressable>
								<FansText fontSize={14} lineHeight={21}>
									Copy link
								</FansText>
							</View>
							<View style={tw.style("items-center")}>
								<Pressable
									style={tw.style("mb-2 w-11.5 h-11.5")}
									onPress={onClickTweet}
								>
									<View
										style={tw.style(
											"bg-[#00acee] rounded-full w-full h-full items-center justify-center",
										)}
									>
										<OutlinedTweetSvg
											size={26}
											color="#fff"
										/>
									</View>
								</Pressable>
								<FansText fontSize={14} lineHeight={21}>
									Tweet
								</FansText>
							</View>

							<View style={tw.style("items-center")}>
								<Pressable
									style={tw.style("mb-2 w-11.5 h-11.5")}
									onPress={onClickShare}
								>
									<ImageBackground
										style={tw.style(
											"rounded-full w-full h-full flex items-center justify-center",
										)}
										source={require("@assets/images/posts/instagram-bg.png")}
										resizeMode="cover"
									>
										<InstagramSvg
											size={24.5}
											color="#fff"
										/>
									</ImageBackground>
								</Pressable>
								<FansText fontSize={14} lineHeight={21}>
									Share
								</FansText>
							</View>

							<View style={tw.style("items-center")}>
								<Pressable
									style={tw.style("mb-2 w-11.5 h-11.5")}
									onPress={onClickPinterest}
								>
									<View
										style={tw.style(
											"bg-[#e60023] rounded-full w-full h-full flex items-center justify-center",
										)}
									>
										<PinterestSvg size={27} color="#fff" />
									</View>
								</Pressable>
								<FansText fontSize={14} lineHeight={21}>
									Pin
								</FansText>
							</View>
						</View> */}
				</FansView>
			</FansView>
		</FypModal>
	);
};

export default PostLiveDialog;
