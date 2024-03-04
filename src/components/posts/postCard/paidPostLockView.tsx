import {
	FypLinearGradientView,
	FypNullableView,
	FypText,
} from "@components/common/base";
import { FansView } from "@components/controls";
import { cdnURL, urlOrBlurHash } from "@helper/Utils";
import tw from "@lib/tailwind";
import { IPost } from "@usertypes/types";
import { Image as ExpoImage } from "expo-image";
import React, { FC, Fragment } from "react";
import PostLockIcon from "../common/postLockIcon";

interface Props {
	isUnpaidPost: boolean;
	post: IPost;
	showPaidPostText?: boolean;
}

const PaidPostLockView: FC<Props> = (props) => {
	const { isUnpaidPost, post, showPaidPostText } = props;

	const getPaidPostPreviewImage = () => {
		if (post.paidPost && post.paidPost.thumbs) {
			return urlOrBlurHash(
				cdnURL(post.paidPost.thumbs[0].url),
				post.thumb?.blurhash,
			);
		} else if (post.paidPost && !post.paidPost.thumbs) {
			return post.thumb?.blurhash;
		}
		return "";
	};

	if (!isUnpaidPost) {
		return null;
	}

	return (
		<Fragment>
			<FypNullableView visible={!post.isSelf}>
				<FansView
					position="absolute"
					width="full"
					height="full"
					top={0}
					left={0}
				>
					<ExpoImage
						source={getPaidPostPreviewImage()}
						style={tw.style("w-full h-full")}
						pointerEvents="none"
					/>
				</FansView>
			</FypNullableView>

			<PostLockIcon />

			<FypNullableView visible={!!showPaidPostText}>
				<FypLinearGradientView
					colors={["#1D21E5", "#A854F5", "#D885FF"]}
					start={[0, 1]}
					end={[1, 0]}
					width={100}
					height={26}
					borderRadius={26}
					alignItems="center"
					justifyContent="center"
					position="absolute"
					style={tw.style("top-[18px] left-[17px]")}
				>
					<FypText
						fontSize={14}
						lineHeight={19}
						fontWeight={600}
						style={tw.style("text-fans-white")}
					>
						PAID POST
					</FypText>
				</FypLinearGradientView>
			</FypNullableView>
		</Fragment>
	);
};

export default PaidPostLockView;
