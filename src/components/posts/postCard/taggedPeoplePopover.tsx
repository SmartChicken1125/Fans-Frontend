import { FansText } from "@components/controls";
import tw from "@lib/tailwind";
import { ITaggedPeople, IUser } from "@usertypes/types";
import { useRouter } from "expo-router";
import React, { FC } from "react";
import { View, Pressable } from "react-native";
import { Popover } from "react-native-popable";

interface Props {
	visible: boolean;
	taggedPeoples: ITaggedPeople[];
}

const TaggedPeoplePopover: FC<Props> = (props) => {
	const { visible, taggedPeoples } = props;

	const router = useRouter();

	const onClickPeople = (user: IUser) => {
		router.push(`/${user.username}`);
	};

	return (
		<Popover
			visible={visible}
			style={[
				{
					top: 394 / 2,
					width: 150,
					position: "absolute",
					transform: [{ translateX: -75 }],
				},
				tw.style("left-1/2"),
			]}
		>
			<View>
				{taggedPeoples?.map((people) => (
					<Pressable
						key={people.userId}
						onPress={() => onClickPeople(people.user)}
					>
						<FansText
							color="white"
							style={tw.style("text-center")}
							fontSize={17}
						>
							{people.user.username}
						</FansText>
					</Pressable>
				))}
			</View>
		</Popover>
	);
};

export default TaggedPeoplePopover;
