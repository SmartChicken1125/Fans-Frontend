import { FypButton } from "@components/common/base";
import tw from "@lib/tailwind";
import React, { FC } from "react";

interface Props {
	title: string;
	selected: boolean;
	onClick: () => void;
}

const FilterButton: FC<Props> = (props) => {
	const { selected, onClick, title } = props;

	return (
		<FypButton
			style={tw.style(
				"px-5 pt-1 pb-2 rounded-[34px]",
				selected
					? "bg-fans-purple"
					: `bg-fans-grey dark:bg-fans-grey-43`,
			)}
			textStyle={tw.style(
				"text-[17px] leading-[22px]",
				selected
					? "text-fans-white"
					: `text-fans-black dark:text-fans-white`,
			)}
			onPress={onClick}
		>
			{title}
		</FypButton>
	);
};

export default FilterButton;
