import { FundSvg } from "@assets/svgs/common";
import { FypText, FypSvg } from "@components/common/base";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { IPost } from "@usertypes/types";
import React, { FC } from "react";

interface Props {
	data: IPost;
}

const Fundraiser: FC<Props> = (props) => {
	const { data } = props;
	const handlePressDonation = () => {};

	return (
		<FansView style={tw.style("px-[18px] pt-[6px] pb-3 md:px-0")}>
			<FansView margin={{ b: 22 }}>
				<FansView
					flexDirection="row"
					alignItems="center"
					justifyContent="between"
					margin={{ b: 14 }}
				>
					<FypText fontSize={17} fontWeight={600} lineHeight={22}>
						$2500 raised {` `}
						<FypText
							fontSize={17}
							fontWeight={400}
							lineHeight={22}
							style={tw.style(
								"text-fans-grey-70 dark:text-fans-grey-b1",
							)}
						>
							of $10000
						</FypText>
					</FypText>
					<FypText
						fontSize={16}
						fontWeight={400}
						lineHeight={21}
						style={tw.style("text-fans-purple")}
					>
						<FypText
							fontSize={16}
							fontWeight={600}
							lineHeight={21}
							style={tw.style("text-fans-purple")}
						>
							75%
						</FypText>
						{` `}to goal
					</FypText>
				</FansView>
				<FansView
					height={5}
					borderRadius={5}
					width="full"
					position="relative"
					style={tw.style("bg-fans-grey-f0 dark:bg-fans-grey-43")}
				>
					<FansView
						height="full"
						position="absolute"
						left={0}
						top={0}
						borderRadius={5}
						style={tw.style("w-1/2 bg-fans-purple")}
					></FansView>
				</FansView>
			</FansView>
			<FansView
				flexDirection="row"
				alignItems="center"
				justifyContent="center"
				height={42}
				borderRadius={42}
				margin={{ b: 12 }}
				style={tw.style("w-full bg-fans-purple")}
				pressableProps={{
					onPress: handlePressDonation,
				}}
			>
				<FypText
					fontSize={19}
					fontWeight={700}
					lineHeight={26}
					style={tw.style("text-fans-white")}
				>
					Make donation
				</FypText>
			</FansView>
			<FansView flexDirection="row" alignItems="center">
				<FypSvg
					svg={FundSvg}
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
					Fundraiser
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
					Last donation 15m ago
				</FypText>
			</FansView>
		</FansView>
	);
};

export default Fundraiser;
