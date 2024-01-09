import { PlusSvg } from "@assets/svgs/common";
import tw from "@lib/tailwind";
import React, { FC } from "react";
import { View, Pressable } from "react-native";

interface Props {
	onClick: () => void;
}

const AddResource: FC<Props> = (props) => {
	const { onClick } = props;
	return (
		<View
			style={tw.style(
				"w-20 h-20 xl:w-[117px] xl:h-[117px] border border-[#b1b1b1] rounded-[7px] border-dashed items-center justify-center",
			)}
		>
			<Pressable
				style={tw.style(
					"bg-fans-purple rounded-full w-9 h-9 xl:w-[55px] xl:h-[55px] items-center justify-center",
				)}
				onPress={onClick}
			>
				<PlusSvg
					size={25}
					color="#fff"
					style={tw.style("w-5 h-5 xl:w-6 xl:h-6")}
				/>
			</Pressable>
		</View>
	);
};

export default AddResource;
