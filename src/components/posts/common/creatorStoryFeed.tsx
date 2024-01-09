import { RoundedBorderSvg } from "@assets/svgs/common";
import AvatarWithStatus from "@components/common/AvatarWithStatus";
import { FypText } from "@components/common/base";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { IProfile } from "@usertypes/types";
import React, { FC } from "react";
import { Pressable, PressableProps } from "react-native";

interface Props extends PressableProps {
	creator: IProfile;
	onNavigate: () => void;
}

const CreatorStoryFeed: FC<Props> = (props) => {
	const { creator, onNavigate, ...otherProps } = props;

	return (
		<Pressable
			style={tw.style("items-center max-w-[100px]")}
			onPress={onNavigate}
			{...otherProps}
		>
			<FansView
				width={76}
				height={76}
				alignItems="center"
				justifyContent="center"
				borderRadius={76}
				position="relative"
				style={tw.style(
					creator.isSelected
						? "border-0"
						: `border border-fans-grey dark:border-fans-43`,
				)}
			>
				<AvatarWithStatus
					size={68}
					avatar={creator.avatar ?? ""}
					onPress={onNavigate}
				/>

				{creator.isSelected ? (
					<RoundedBorderSvg
						size={76}
						style={tw.style("absolute top-0 left-0")}
					/>
				) : null}
			</FansView>
			<FypText
				fontSize={15}
				lineHeight={21}
				textAlign="center"
				style={tw.style(
					"text-fans-black dark:text-fans-white max-w-20",
				)}
				numberOfLines={2}
				margin={{ t: 4 }}
			>
				{creator.profileLink}
			</FypText>
		</Pressable>
	);
};

export default CreatorStoryFeed;
