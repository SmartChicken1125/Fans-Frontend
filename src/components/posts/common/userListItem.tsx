import { RoundedPlusSvg, TrashSvg, CloseSvg } from "@assets/svgs/common";
import AvatarWithStatus from "@components/common/AvatarWithStatus";
import { FypSvg } from "@components/common/base";
import { FansText, FansView, FansIconButton } from "@components/controls";
import tw from "@lib/tailwind";
import React, { FC } from "react";

interface Props {
	avatar?: string;
	username: string;
	displayName?: string;
	selected?: boolean;
	onSelect?: () => void;
	onDelete?: () => void;
}

export const SelectableUserListItem: FC<Props> = (props) => {
	const { onSelect, avatar, username, displayName, selected, onDelete } =
		props;

	return (
		<FansView
			flexDirection="row"
			alignItems="center"
			padding={{ y: 10 }}
			style={tw.style(
				"border-b border-fans-grey dark:border-fans-grey-43",
			)}
		>
			<FansView
				margin={{ r: 22 }}
				style={tw.style(!onSelect && "hidden")}
			>
				{selected ? (
					<FansView
						pressableProps={{
							onPress: onSelect,
						}}
						width={25}
						height={25}
						alignItems="center"
						justifyContent="center"
						borderRadius={25}
						style={tw.style("bg-fans-black dark:bg-fans-white")}
					>
						<FypSvg
							svg={CloseSvg}
							width={11}
							height={11}
							color="fans-white dark:fans-black"
						/>
					</FansView>
				) : (
					<FansView
						pressableProps={{
							onPress: onSelect,
						}}
						width={25}
						height={25}
					>
						<FypSvg
							svg={RoundedPlusSvg}
							width={25}
							height={25}
							color="fans-black dark:fans-white"
						/>
					</FansView>
				)}
			</FansView>
			<AvatarWithStatus
				avatar={avatar ?? ""}
				size={46}
				onPress={onSelect}
			/>

			<FansView margin={{ l: 12 }} flex="1">
				<FansText
					fontSize={19}
					lineHeight={26}
					style={tw.style(
						"font-semibold",
						"text-fans-black dark:text-fans-white",
						displayName ? "mb-[-3px]" : "",
					)}
					numberOfLines={1}
					onPress={onSelect}
				>
					{displayName}
				</FansText>
				<FansText
					fontSize={16}
					lineHeight={21}
					onPress={onSelect}
					style={tw.style("text-fans-grey-70 dark:text-fans-grey-b1")}
				>
					{`@${username}`}
				</FansText>
			</FansView>
			<FansIconButton
				style={tw.style(!onDelete && "hidden")}
				onPress={onDelete}
			>
				<TrashSvg size={15} color="#eb2121" />
			</FansIconButton>
		</FansView>
	);
};
