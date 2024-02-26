import tw from "@lib/tailwind";
import React, { FC } from "react";
import { FypText, FypNullableView } from "../common/base";
import { FansView } from "../controls";

interface Props {
	subTitle?: string;
	title: string;
	text: string;
	icon?: React.ReactNode;
}

const GuideItem: FC<Props> = (props) => {
	const { subTitle, title, text, icon } = props;
	return (
		<FansView flexDirection="row" gap={20}>
			<FansView width={22}>{icon}</FansView>
			<FansView flex="1">
				<FypNullableView visible={!!subTitle}>
					<FypText
						fontSize={14}
						fontWeight={500}
						margin={{ b: 2 }}
						style={tw.style("text-fans-purple")}
					>
						{subTitle}
					</FypText>
				</FypNullableView>

				<FypText
					fontSize={17}
					fontWeight={600}
					lineHeight={24}
					margin={{ b: 11 }}
				>
					{title}
				</FypText>
				<FypText
					fontSize={16}
					lineHeight={23}
					style={tw.style("text-fans-grey-48 dark:text-fans-grey-b1")}
				>
					{text}
				</FypText>
			</FansView>
		</FansView>
	);
};

export default GuideItem;
