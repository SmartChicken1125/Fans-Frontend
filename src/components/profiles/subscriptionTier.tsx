import {
	ChevronDownSvg,
	DndTriggerSvg,
	EditSvg,
	TrashSvg,
} from "@assets/svgs/common";
import RoundButton from "@components/common/RoundButton";
import { FypCollapsible, FypText, FypSvg } from "@components/common/base";
import ListLine from "@components/common/listLine";
import { FansView, FansIconButton, FansDivider } from "@components/controls";
import { cdnURL } from "@helper/Utils";
import tw from "@lib/tailwind";
import { ISubscriptionTier } from "@usertypes/types";
import React, { FC, useState, useEffect } from "react";
import { Image } from "react-native";

interface Props {
	data: ISubscriptionTier;
	onClickEdit?: () => void;
	onClickDelete?: () => void;
	onClickSubscribe?: () => void;
	isPreview?: boolean;
}

const SubscriptionTier: FC<Props> = (props) => {
	const { data, onClickEdit, onClickDelete, isPreview, onClickSubscribe } =
		props;

	const [closed, setClosed] = useState(true);

	useEffect(() => {
		if (isPreview) {
			setClosed(false);
		}
	}, [isPreview]);

	return (
		<FansView
			style={[
				{
					shadowColor: tw.prefixMatch("dark")
						? "rgba(255,255,255,0.16)"
						: "rgba(0,0,0,0.16)",
					shadowRadius: 6,
					shadowOffset: { width: 0, height: 3 },
				},
				tw.style(
					"border rounded-[7px] max-w-[992px]:shadow-none",
					`border-fans-grey-f0 dark:border-fans-grey-43`,
				),
			]}
		>
			<FansView position="relative">
				<FansView height={78}>
					<Image
						source={{ uri: cdnURL(data.cover) }}
						style={tw.style("w-full h-[78px] rounded-t-[7px]")}
						resizeMode="cover"
					/>
				</FansView>
				{/* <IconButton
					icon={() => (
						<DndTriggerSvg
							width={9.8}
							height={16.14}
							color="#000"
						/>
					)}
					containerColor="#f0f0f0"
					style={tw.style(
						"m-0 w-[34px] h-[34px] absolute top-[10px] left-3",
						isPreview ? "hidden" : "flex",
					)}
				/> */}

				<FansView
					position="absolute"
					flexDirection="row"
					top={10}
					right={12}
					gap={8}
				>
					<FansIconButton
						backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
						onPress={() => setClosed(!closed)}
						size={34}
						style={[
							tw.style(!isPreview ? "flex" : "hidden"),
							{
								transform: [
									{ rotateX: closed ? "0deg" : "180deg" },
								],
							},
						]}
					>
						<FypSvg
							svg={ChevronDownSvg}
							width={11.87}
							height={6}
							color="fans-black dark:fans-white"
						/>
					</FansIconButton>
					<FansIconButton
						backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
						onPress={onClickEdit}
						size={34}
						style={[tw.style(!isPreview ? "flex" : "hidden")]}
					>
						<FypSvg
							svg={EditSvg}
							width={12.94}
							height={13.5}
							color="fans-black dark:fans-white"
						/>
					</FansIconButton>
					<FansIconButton
						backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
						onPress={onClickDelete}
						size={34}
						style={[tw.style(!isPreview ? "flex" : "hidden")]}
					>
						<FypSvg
							svg={TrashSvg}
							width={11.87}
							height={14.76}
							color="fans-black dark:fans-white"
						/>
					</FansIconButton>
				</FansView>
			</FansView>

			<FansView>
				<FansView padding={{ x: 20, t: 16, b: 20 }}>
					<FypText
						fontSize={17}
						lineHeight={22}
						fontWeight={600}
						textAlign="center"
						margin={{ b: 5 }}
						style={tw.style("text-fans-black dark:text-fans-white")}
					>
						{data.title}
					</FypText>
					<FansView
						flexDirection="row"
						alignItems="end"
						justifyContent="center"
					>
						<FypText
							fontSize={21}
							lineHeight={28}
							fontWeight={700}
							style={tw.style("text-fans-purple")}
						>
							{`$${data.price}`}
						</FypText>
						<FypText
							fontSize={16}
							lineHeight={21}
							fontWeight={700}
							style={tw.style("text-fans-purple")}
							margin={{ b: 2, l: 4 }}
						>
							PER MONTH
						</FypText>
					</FansView>
				</FansView>

				<FypCollapsible collapsed={closed}>
					<FansView
						style={tw.style("px-3", isPreview ? "pb-4" : "pb-7.5")}
					>
						<FypText
							textAlign="center"
							fontSize={16}
							lineHeight={21}
							style={tw.style(
								"text-fans-black dark:text-fans-white",
							)}
						>
							{data.description}
						</FypText>
						<FansDivider style={tw.style("mt-5 mb-[18px]")} />
						<FansView gap={18}>
							{data.perks.slice(0, 10).map((el, index) => (
								<ListLine text={el} size="lg" key={index} />
							))}
						</FansView>
					</FansView>
				</FypCollapsible>
				<FansView
					style={tw.style(
						"w-40 mx-auto pb-7.5",
						!isPreview && "hidden",
					)}
				>
					<RoundButton onPress={onClickSubscribe}>
						Subscribe
					</RoundButton>
				</FansView>
			</FansView>
		</FansView>
	);
};

export default SubscriptionTier;
