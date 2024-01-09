import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import React, { FC } from "react";

interface Props {
	index: number;
	length: number;
	onClickDot: (index: number) => void;
}

const Indicator: FC<Props> = (props) => {
	const { index, length, onClickDot } = props;
	return (
		<FansView
			position="absolute"
			flexDirection="row"
			justifyContent="center"
			bottom={20}
			left={0}
			width="full"
			gap={5}
			style={tw.style(length === 0 || length === 1 ? "hidden" : "")}
		>
			{[...Array(length)].map((el, ix) => (
				<FansView
					key={ix}
					width={5}
					height={5}
					borderRadius={5}
					style={tw.style(
						ix === index
							? "bg-white"
							: "bg-[rgba(255,255,255,0.45)]",
					)}
					pressableProps={{
						onPress: () => onClickDot(ix),
					}}
				></FansView>
			))}
		</FansView>
	);
};

export default Indicator;
