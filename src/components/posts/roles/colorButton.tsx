import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import React, { FC } from "react";

interface Props {
	onSelect: () => void;
	isSelected: boolean;
	value: string;
}

const ColorButton: FC<Props> = (props) => {
	const { onSelect, isSelected, value } = props;

	return (
		<FansView width={44} height={44} position="relative">
			<FansView
				width={44}
				height={44}
				borderRadius={44}
				style={[
					{
						backgroundColor: value,
						borderWidth: value === "transparent" ? 1 : 0,
						borderColor: "#e0e0e0",
					},
				]}
				pressableProps={{
					onPress: onSelect,
				}}
			></FansView>
			{isSelected ? (
				<FansView
					style={tw.style(
						"border w-[50px] h-[50px] rounded-full absolute top-[-3px] left-[-3px]",
						"border-fans-black dark:border-fans-white",
					)}
				></FansView>
			) : null}
		</FansView>
	);
};

export default ColorButton;
