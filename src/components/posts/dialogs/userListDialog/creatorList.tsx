import { CheckSvg, RoundedPlusSvg } from "@assets/svgs/common";
import { FypText } from "@components/common/base";
import tw from "@lib/tailwind";
import { IProfile } from "@usertypes/types";
import React, { FC } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

interface Props {
	data: IProfile;
	isSelected: boolean;
	onSelect: () => void;
	onDeselect: () => void;
}

const CreatorLine: FC<Props> = (props) => {
	const { data, isSelected, onSelect, onDeselect } = props;

	return (
		<View
			style={tw.style(
				"flex-row items-center py-[10px] border-b border-fans-grey",
			)}
		>
			<View style={tw.style("mr-[22px]")}>
				{isSelected ? (
					<TouchableOpacity
						onPress={onDeselect}
						style={tw.style(
							"w-[25px] h-[25px] bg-fans-purple items-center justify-center rounded-full",
						)}
					>
						<CheckSvg width={13.77} height={9.84} />
					</TouchableOpacity>
				) : (
					<TouchableOpacity
						onPress={onSelect}
						style={tw.style("w-[25px] h-[25px]")}
					>
						<RoundedPlusSvg width={25} height={25} />
					</TouchableOpacity>
				)}
			</View>

			<Image
				source={require("@assets/images/posts/user-1.png")}
				alt="User"
				style={tw.style("w-[46px] h-[46px] rounded-full")}
			/>

			<View style={tw.style("ml-3")}>
				<FypText fontSize={19} lineHeight={26} fontWeight={700}>
					{data.displayName}
				</FypText>
				<Text
					style={tw.style(
						"text-base text-fans-dark-grey leading-[21px] mt-[-3px]",
					)}
				>
					{data.username}
				</Text>
			</View>
		</View>
	);
};

export default CreatorLine;
