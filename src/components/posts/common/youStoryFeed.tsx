import { PlusSvg } from "@assets/svgs/common";
import AvatarWithStatus from "@components/common/AvatarWithStatus";
import { FypText } from "@components/common/base";
import { FansView } from "@components/controls";
import { useAppContext } from "@context/useAppContext";
import tw from "@lib/tailwind";
import React, { FC } from "react";
import { Pressable, PressableProps } from "react-native";

const YouStoryFeed: FC<PressableProps> = (props) => {
	const { onPress, ..._props } = props;
	const { state } = useAppContext();
	const { avatar } = state.profile;

	return (
		<Pressable
			style={tw.style("items-center max-w-[100px]")}
			onPress={onPress}
			{..._props}
		>
			<FansView
				width={76}
				height={76}
				alignItems="center"
				justifyContent="center"
				borderRadius={76}
				position="relative"
			>
				<AvatarWithStatus
					size={68}
					avatar={avatar ?? ""}
					onPress={() => {
						if (onPress) onPress;
					}}
				/>
				<FansView
					pressableProps={{
						onPress: onPress,
					}}
					style={[
						tw.style(
							"w-[25px] h-[25px] rounded-full bg-[rgba(255,255,255,0.7)] flex items-center justify-center absolute top-1/2 left-1/2",
						),
						{
							transform: [
								{ translateX: -12.5 },
								{ translateY: -12.5 },
							],
						},
					]}
				>
					<PlusSvg width={15.35} height={15.35} color="#000" />
				</FansView>
			</FansView>
			<FypText
				textAlign="center"
				fontSize={15}
				lineHeight={21}
				style={tw.style("text-fans-black dark:text-fans-white")}
				margin={{ t: 4 }}
			>
				You
			</FypText>
		</Pressable>
	);
};

export default YouStoryFeed;
