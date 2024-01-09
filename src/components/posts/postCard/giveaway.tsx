import { GiveawaySvg, CheckSvg } from "@assets/svgs/common";
import { FypText, FypSvg } from "@components/common/base";
import { FansView } from "@components/controls";
import { cdnURL } from "@helper/Utils";
import tw from "@lib/tailwind";
import { IPost } from "@usertypes/types";
import { getAgoTime } from "@utils/common";
import React, { FC, useState } from "react";
import { Image } from "react-native";

interface Props {
	data: IPost;
}

const Giveaway: FC<Props> = (props) => {
	const { data } = props;
	const [entered, setEntered] = useState(false);
	return (
		<FansView style={tw.style("px-[18px] pt-[6px] pb-3 md:px-0")}>
			<FansView
				margin={{ b: 13 }}
				style={tw.style(
					"border border-fans-grey-f0 dark:border-fans-grey-43 rounded-[7px]",
				)}
			>
				<FansView height={112}>
					<Image
						source={{ uri: cdnURL(data.giveaway?.thumb?.url) }}
						style={tw.style("w-full h-full rounded-t-[7px]")}
					/>
				</FansView>
				<FansView
					flexDirection="row"
					alignItems="center"
					padding={{ t: 10, b: 14, x: 16 }}
					gap={13}
				>
					<FypSvg
						svg={GiveawaySvg}
						width={30}
						height={30}
						color="fans-black dark:fans-white"
					/>
					<FansView flex="1">
						<FypText
							fontSize={17}
							lineHeight={22}
							fontWeight={600}
							numberOfLines={1}
						>
							{data.giveaway?.prize}
						</FypText>
						<FypText
							fontSize={16}
							style={tw.style(
								"text-fans-grey-70 dark:text-fans-grey-b1",
							)}
						>
							{`${data.giveaway?.winnerCount} winner`}
						</FypText>
					</FansView>
				</FansView>
			</FansView>
			<FansView
				margin={{ b: 12 }}
				flexDirection="row"
				alignItems="center"
				justifyContent="center"
				gap={10}
				height={42}
				borderRadius={28}
				style={tw.style(
					entered
						? "bg-fans-purple-f6 dark:bg-fans-purple-47"
						: "bg-fans-purple",
				)}
				pressableProps={{
					onPress: () => setEntered(!entered),
				}}
			>
				{entered && (
					<FypSvg
						svg={CheckSvg}
						width={15}
						height={10}
						color="fans-purple"
					/>
				)}

				<FypText
					fontSize={19}
					fontWeight={700}
					style={tw.style(
						entered ? "text-fans-purple" : "text-fans-white",
					)}
				>
					Enter
				</FypText>
			</FansView>
			<FansView flexDirection="row" alignItems="center">
				<FypSvg
					svg={GiveawaySvg}
					width={10}
					height={14}
					color="fans-grey-70 dark:fans-grey-b1"
					style={tw.style("mr-3")}
				/>
				<FypText
					fontSize={16}
					fontWeight={600}
					lineHeight={21}
					style={tw.style("text-fans-grey-70 dark:text-fans-grey-b1")}
				>
					Giveaway
				</FypText>
				<FansView
					margin={{ x: 9 }}
					width={4}
					height={4}
					borderRadius={4}
					style={tw.style("bg-fans-grey-70 dark:bg-fans-grey-b1")}
				></FansView>
				<FypText
					fontSize={16}
					fontWeight={400}
					lineHeight={21}
					style={tw.style("text-fans-grey-70 dark:text-fans-grey-b1")}
				>
					{`${getAgoTime(data.giveaway?.endDate ?? "", false)} left`}
				</FypText>
			</FansView>
		</FansView>
	);
};

export default Giveaway;
