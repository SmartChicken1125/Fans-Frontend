import {
	PlayListSvg,
	OutlinedPlaySvg,
	TrashSvg,
	DndTriggerSvg,
	EditSvg,
	ThreeDotsVerticalSvg,
} from "@assets/svgs/common";
import { FypText, FypSvg } from "@components/common/base";
import { FansText, FansDivider, FansIconButton } from "@components/controls";
import { cdnURL } from "@helper/Utils";
import tw from "@lib/tailwind";
import { IPlayList } from "@usertypes/types";
import { truncateText } from "@utils/stringHelper";
import { useRouter } from "expo-router";
import React, { FC } from "react";
import { View, Image, Pressable } from "react-native";

interface Props {
	data: IPlayList;
	onClickEdit: () => void;
	onClickDelete: () => void;
	onClickMenus: () => void;
	isSuggested?: boolean;
}

const PlayListCard: FC<Props> = (props) => {
	const { data, onClickEdit, onClickDelete, onClickMenus } = props;
	const router = useRouter();

	const onGoToDetail = () => {
		router.push({
			pathname: "playlist",
			params: { screen: "Detail", id: data.id },
		});
	};
	const isSuggested = true;
	return (
		<View>
			<View
				style={tw.style(
					"relative flex-row items-center",
					isSuggested ? "" : "pl-6 lg:pl-[46px]",
				)}
			>
				<View
					style={[
						tw.style(
							"absolute left-0 top-[10px] lg:top-[106px] md:left-1",
							isSuggested && "hidden",
						),
					]}
				>
					<DndTriggerSvg width={10} height={16.14} />
				</View>

				<Pressable
					style={tw.style(
						"relative w-[149px] h-[97px] lg:w-[352px] lg:h-[230px]",
					)}
					onPress={onGoToDetail}
				>
					<Image
						source={{
							uri: cdnURL(data.thumb),
						}}
						resizeMode="cover"
						style={tw.style("w-full h-full rounded-[7px]")}
					/>
					<View
						style={tw.style(
							"absolute bg-[rgba(0,0,0,0.5)] w-full h-5 bottom-0 left-0 rounded-b-[7px] flex-row items-center justify-center md:h-7.5",
						)}
					>
						<FypSvg
							svg={PlayListSvg}
							width={12}
							height={10.5}
							color="fans-white dark:fans-black"
						/>
						<FypText
							style={tw.style(
								"text-[10px] font-bold leading-[11px] md:text-[16px]",
								"text-fans-white dark:text-fans-black-1d",
							)}
						>
							{` ${data.posts.length} `}
						</FypText>
					</View>
				</Pressable>

				<View
					style={tw.style(
						"flex-1 relative ml-[14px] h-full pr-2 md:ml-4 md:pt-20",
					)}
				>
					<View>
						<Pressable
							onPress={onGoToDetail}
							style={tw.style("mb-[2px]")}
						>
							<FansText
								style={tw.style(
									"font-semibold md:text-[19px] md:leading-[26px]",
									"text-fans-black dark:text-fans-white",
								)}
								fontSize={16}
								lineHeight={21}
							>
								{truncateText(data.title, 15)}
							</FansText>
						</Pressable>
						<FansText
							fontSize={16}
							lineHeight={21}
							style={tw.style(
								"text-fans-grey-70 dark:text-fans-grey-b1",
							)}
						>
							{`${data.posts.length} posts`}
						</FansText>
					</View>

					<View
						style={tw.style(
							"flex-row items-center mt-7 absolute left-0 bottom-0",
						)}
					>
						<FypSvg
							svg={OutlinedPlaySvg}
							width={8.37}
							height={9.22}
							color="fans-grey-70 dark:fans-grey-b1"
						/>
						<FypText
							style={tw.style(
								"ml-1 text-fans-grey-70 dark:text-fans-grey-b1",
							)}
							fontSize={14}
							lineHeight={21}
						>
							{data.viewCount}
						</FypText>
					</View>
				</View>

				{isSuggested ? (
					<Pressable
						style={tw.style(
							"absolute top-0 right-0 w-5 h-5 flex-row justify-end",
						)}
						onPress={onClickMenus}
					>
						<FypSvg
							svg={ThreeDotsVerticalSvg}
							width={3.55}
							height={17.4}
							color="fans-black dark:fans-white"
						/>
					</Pressable>
				) : (
					<View
						style={tw.style(
							"flex-row items-center gap-x-2 absolute bottom-0 right-0",
						)}
					>
						<FansIconButton
							backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
							size={34}
							onPress={onClickEdit}
						>
							<FypSvg
								svg={EditSvg}
								width={14.54}
								height={14.9}
								color="fans-black dark:fans-white"
							/>
						</FansIconButton>
						<FansIconButton
							backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
							size={34}
							onPress={onClickDelete}
						>
							<FypSvg
								svg={TrashSvg}
								width={13.4}
								height={16.4}
								color="fans-red-eb"
							/>
						</FansIconButton>
					</View>
				)}
			</View>

			<FansDivider style={tw.style("h-[1px] my-3")} />
		</View>
	);
};

export default PlayListCard;
