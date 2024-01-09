import { FypText } from "@components/common/base";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import React, { FC } from "react";
import { Image, ImageSourcePropType } from "react-native";

interface Props {
	title: string;
	price?: number;
	titleColor?: string;
	onSelect: () => void;
	isSelected: boolean;
	// icon: React.FC<FansSvgProps>;
	icon: ImageSourcePropType;
}

const GemItem: FC<Props> = (props) => {
	const { title, price, titleColor, onSelect, isSelected } = props;

	return (
		<FansView>
			<FansView
				width={72}
				height={72}
				borderRadius={72}
				alignItems="center"
				justifyContent="center"
				position="relative"
				style={tw.style(
					"border",
					"border-fans-grey-f0 dark:border-fans-grey-43",
					isSelected && "bg-fans-purple-light dark:bg-fans-purple-47",
				)}
				pressableProps={{
					onPress: onSelect,
				}}
			>
				{isSelected && (
					<Image
						source={require("@assets/images/posts/gem-border.png")}
						style={tw.style("w-full h-full absolute left-0 top-0")}
					/>
				)}
				{/* <props.icon size={41.2} /> */}
				<Image
					source={props.icon}
					style={tw.style("w-[41.2px] h-[41.2px]")}
					resizeMode="cover"
				/>
			</FansView>
			<FansView margin={{ t: 8 }}>
				<FypText
					fontSize={17}
					lineHeight={22}
					fontWeight={600}
					textAlign="center"
					style={tw.style(titleColor)}
				>
					{title}
				</FypText>
				{price && (
					<FypText
						fontSize={14}
						lineHeight={19}
						fontWeight={500}
						textAlign="center"
						style={tw.style("text-fans-black dark:text-fans-white")}
					>
						{`$${price}`}
					</FypText>
				)}
			</FansView>
		</FansView>
	);
};

export default GemItem;
