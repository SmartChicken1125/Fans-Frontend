import { CloseSvg, ThreeDotsSvg } from "@assets/svgs/common";
import AvatarWithStatus from "@components/common/AvatarWithStatus";
import {
	FypLinearGradientView,
	FypText,
	FypSvg,
} from "@components/common/base";
import { FansView, FansIconButton } from "@components/controls";
import tw from "@lib/tailwind";
import { IProfile, IStory } from "@usertypes/types";
import { getAgoTime } from "@utils/common";
import { useRouter } from "expo-router";
import React, { FC } from "react";

interface Props {
	onClickClose: () => void;
	onClickThreeDots: () => void;
	creator?: IProfile;
	stories: IStory[];
	storyIndex: number;
	onClickIndicator: (index: number) => void;
}

const GradientHeader: FC<Props> = (props) => {
	const {
		onClickClose,
		onClickThreeDots,
		creator,
		stories,
		storyIndex,
		onClickIndicator,
	} = props;
	const router = useRouter();

	const handlePress = () => {
		if (creator?.profileLink) {
			const username = creator.profileLink;
			router.replace(`/${username}`);
		}
	};

	return (
		<FypLinearGradientView
			colors={[
				"rgba(112,112,112,0.43)",
				"rgba(112,112,112,0.43)",
				"rgba(255,255,255,0)",
			]}
			start={[0, 0]}
			end={[0, 1]}
			locations={[0, 0.3, 1]}
			style={tw.style(
				"px-[18px] absolute top-0 left-0 w-full h-[176px] z-10 pt-3 md:rounded-t-[15px]",
			)}
		>
			<FansView
				flexDirection="row"
				justifyContent="between"
				gap={6}
				margin={{ b: 8 }}
			>
				{stories.map((story, index) => (
					<FansView
						key={story.id}
						touchableOpacityProps={{
							onPress: () => onClickIndicator(index),
						}}
						height={4}
						borderRadius={4}
						flex="1"
						background={
							storyIndex === index
								? "fans-white"
								: "fans-white/40"
						}
					/>
				))}
			</FansView>

			<FansView flexDirection="row" alignItems="center">
				<AvatarWithStatus
					avatar={creator?.avatar ?? ""}
					size={46}
					onPress={handlePress}
				/>

				<FansView
					margin={{ l: 12 }}
					pressableProps={{
						onPress: handlePress,
					}}
				>
					<FypText
						fontSize={17}
						lineHeight={22}
						color="white"
						fontWeight={600}
					>
						{creator?.displayName}
					</FypText>
					{stories.length > 0 ? (
						<FypText
							fontSize={14}
							lineHeight={21}
							margin={{ t: -3 }}
							color="white"
						>
							{getAgoTime(stories[storyIndex].updatedAt)}
						</FypText>
					) : null}
				</FansView>

				<FansView
					flexDirection="row"
					alignItems="center"
					style={tw.style("ml-auto")}
				>
					<FansIconButton
						size={30}
						onPress={onClickThreeDots}
						backgroundColor="bg-transparent"
					>
						<FypSvg
							color="fans-white"
							width={18}
							height={4}
							svg={ThreeDotsSvg}
						/>
					</FansIconButton>
					<FansIconButton
						size={30}
						onPress={onClickClose}
						backgroundColor="bg-fans-black/30 dark:bg-fans-white/30"
						style={tw.style("md:hidden")}
					>
						<FypSvg
							color="fans-white"
							width={11.5}
							height={11.5}
							svg={CloseSvg}
						/>
					</FansIconButton>
				</FansView>
			</FansView>
		</FypLinearGradientView>
	);
};

export default GradientHeader;
