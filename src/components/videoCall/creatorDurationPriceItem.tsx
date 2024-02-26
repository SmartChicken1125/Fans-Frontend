import { formatPrice } from "@helper/Utils";
import tw from "@lib/tailwind";
import React, { FC } from "react";
import { FypText } from "../common/base";
import { FansView } from "../controls";

interface Props {
	selected: boolean;
	onPress: () => void;
	minutes: number;
	price: number;
}

const CreatorDurationPriceItem: FC<Props> = (props) => {
	const { selected, onPress, minutes, price } = props;
	return (
		<FansView
			height={77}
			borderRadius={7}
			justifyContent="center"
			style={tw.style(
				"border",
				selected
					? "border-fans-purple border-[2px]"
					: "border-fans-grey-f0 dark:border-fans-grey-43",
			)}
			pressableProps={{
				onPress: onPress,
			}}
		>
			<FypText
				fontSize={16}
				fontWeight={500}
				textAlign="center"
				lineHeight={21}
			>
				{`${minutes} min`}
			</FypText>
			<FypText
				fontSize={19}
				fontWeight={600}
				textAlign="center"
				lineHeight={26}
				style={tw.style("text-fans-purple")}
			>
				{formatPrice(price)}
			</FypText>
		</FansView>
	);
};

export default CreatorDurationPriceItem;
