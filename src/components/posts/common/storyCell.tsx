import { RoundedBorderSvg } from "@assets/svgs/common";
import { FypText } from "@components/common/base";
import { FansView } from "@components/controls";
import { cdnURL } from "@helper/Utils";
import tw from "@lib/tailwind";
import React, { FC } from "react";
import { Image } from "react-native";

interface Props {
	image: string;
	title: string;
	note?: string;
	isSelected?: boolean;
	onClick: () => void;
}

const StoryCell: FC<Props> = (props) => {
	const { image, title, onClick, isSelected } = props;

	return (
		<FansView
			touchableOpacityProps={{
				onPress: onClick,
			}}
			alignItems="center"
			style={tw.style("max-w-[100px]")}
		>
			<FansView
				width={76}
				height={76}
				alignItems="center"
				justifyContent="center"
				borderRadius={76}
				position="relative"
				style={tw.style(
					"border-fans-grey-f0 dark:border-fans-grey-43",
					isSelected ? "border-0" : "border",
				)}
			>
				{image ? (
					<Image
						source={{ uri: cdnURL(image) }}
						resizeMode="cover"
						style={tw.style("w-[68px] h-[68px] rounded-full")}
					/>
				) : (
					<FansView
						width={68}
						height={68}
						borderRadius={68}
					></FansView>
				)}

				{isSelected ? (
					<RoundedBorderSvg
						size={76}
						style={tw.style("absolute top-0 left-0")}
					/>
				) : null}
			</FansView>
			<FypText
				textAlign="center"
				fontSize={15}
				lineHeight={21}
				margin={{ t: 4 }}
				style={tw.style("text-fans-black dark:text-fans-white")}
			>
				{title}
			</FypText>
		</FansView>
	);
};

export default StoryCell;
