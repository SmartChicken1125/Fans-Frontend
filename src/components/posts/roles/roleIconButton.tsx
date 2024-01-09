import tw from "@lib/tailwind";
import { IRoleIcon } from "@usertypes/types";
import React, { FC } from "react";
import { Image, Pressable } from "react-native";

interface Props {
	onSelect: () => void;
	isSelected: boolean;
	data: IRoleIcon;
}

const RoleIconButton: FC<Props> = (props) => {
	const { data, onSelect, isSelected } = props;

	return (
		<Pressable
			style={tw.style(
				"border relative border-fans-grey dark:border-fans-grey-43 w-11 h-11 rounded-full flex-row items-center justify-center",
				isSelected && "border-0",
			)}
			onPress={onSelect}
		>
			<Image
				source={data.icon}
				style={{
					width: data.width,
					height: data.height,
				}}
			/>
			{isSelected ? (
				<Image
					source={require("@assets/images/posts/gem-border.png")}
					style={tw.style("w-full h-full absolute top-0 left-0")}
				/>
			) : null}
		</Pressable>
	);
};

export default RoleIconButton;
