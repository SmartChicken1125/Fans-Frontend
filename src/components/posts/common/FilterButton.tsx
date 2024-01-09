import { FypText } from "@components/common/base";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import React, { FC } from "react";

interface Props {
	title: string;
	onClick: () => void;
	isSelected: boolean;
	count?: number;
}

const FilterButton: FC<Props> = (props) => {
	const { title, onClick, isSelected, count } = props;

	return (
		<FansView
			style={tw.style(
				"py-[6px] px-4 rounded-full flex-row items-center",
				isSelected
					? "bg-fans-purple"
					: "bg-fans-grey-f0 dark:bg-fans-grey-43",
			)}
			touchableOpacityProps={{
				onPress: onClick,
			}}
		>
			<FypText
				fontSize={17}
				lineHeight={22}
				style={tw.style(
					"pr-2",
					isSelected
						? "text-fans-white"
						: "text-fans-black dark:text-fans-white",
				)}
			>
				{title}
			</FypText>
			{count && (
				<FansView
					style={tw.style(
						"py-[1px] px-1 rounded-[12px] h-4",
						isSelected ? "bg-fans-grey" : "bg-fans-purple",
					)}
				>
					<FypText
						fontSize={11}
						style={tw.style(
							isSelected
								? "text-fans-purple"
								: "text-fans-white dark:text-fans-black-1d",
						)}
					>
						{count}
					</FypText>
				</FansView>
			)}
		</FansView>
	);
};

export default FilterButton;
