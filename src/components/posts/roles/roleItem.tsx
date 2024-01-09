import { ChevronRightSvg, CloseSvg } from "@assets/svgs/common";
import { FypNullableView, FypSvg, FypSwitch } from "@components/common/base";
import { FansText, FansView, FansIconButton } from "@components/controls";
import { roleIcons } from "@constants/common";
import { cdnURL } from "@helper/Utils";
import tw from "@lib/tailwind";
import { IRole } from "@usertypes/types";
import React, { FC } from "react";
import { Image, Pressable } from "react-native";

interface Props {
	data: IRole;
	isEditMode: boolean;
	onChangeEnable: (val: boolean) => void;
	onDelete: () => void;
	onEdit: () => void;
	hideSwitch: boolean;
}

const RoleItem: FC<Props> = (props) => {
	const { data, isEditMode, onDelete, onEdit, onChangeEnable, hideSwitch } =
		props;

	const handleClick = () => {
		if (isEditMode) {
			onEdit();
		} else {
			onChangeEnable(!data.isEnable);
		}
	};

	const getIcon = () => {
		if (roleIcons.map((el) => el.name).includes(data.icon)) {
			const icon = roleIcons.find((el) => el.name === data.icon);
			return (
				<Image
					source={icon?.icon}
					style={{
						width: icon?.width ?? 0,
						height: icon?.height ?? 0,
					}}
				/>
			);
		} else {
			return (
				<Image
					source={{ uri: cdnURL(data.icon) }}
					style={tw.style("w-[46px] h-[46px] rounded-full")}
				/>
			);
		}
	};

	return (
		<FansView flexDirection="row" alignItems="center" padding={{ y: 15 }}>
			<FypNullableView visible={isEditMode}>
				<FansIconButton
					size={25}
					onPress={onDelete}
					style={tw.style("mr-[22px]")}
					backgroundColor="bg-fans-black dark:bg-fans-white"
				>
					<FypSvg
						width={11.3}
						height={11.3}
						svg={CloseSvg}
						color="fans-white dark:fans-black-1d"
					/>
				</FansIconButton>
			</FypNullableView>

			<Pressable
				style={{
					width: 46,
					height: 46,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					position: "relative",
				}}
				onPress={handleClick}
			>
				{getIcon()}
				<FansView
					style={{
						width: 46,
						height: 46,
						borderRadius: 46,
						backgroundColor: data.color,
						opacity: 0.15,
						position: "absolute",
						top: 0,
						left: 0,
					}}
				></FansView>
			</Pressable>

			<Pressable style={tw.style("ml-3 flex-1")} onPress={handleClick}>
				<FansText
					fontSize={19}
					lineHeight={26}
					style={tw.style(
						"font-semibold text-fans-black dark:text-fans-white",
					)}
					numberOfLines={1}
				>
					{data.name}
				</FansText>
				<FansText
					fontSize={16}
					lineHeight={21}
					style={tw.style(
						"mt-[-3px] text-fans-grey-70 dark:text-fans-grey-b1",
					)}
				>
					{`${data.fans ?? 0} fans`}
				</FansText>
			</Pressable>

			{isEditMode ? (
				<FansIconButton
					size={25}
					backgroundColor="bg-fans-white dark:bg-fans-black-1d"
					style={tw.style("ml-auto")}
					onPress={onEdit}
				>
					<FypSvg
						width={7.4}
						height={12.6}
						svg={ChevronRightSvg}
						color="fans-black dark:fans-white"
					/>
				</FansIconButton>
			) : (
				<FansView
					flexDirection="row"
					alignItems="center"
					style={tw.style("ml-auto")}
				>
					<FansText
						fontSize={16}
						lineHeight={21}
						style={tw.style(
							"text-fans-grey-70 dark:text-fans-grey-b1",
						)}
					>
						{`Level ${data.level}`}
					</FansText>
					<FansView
						style={tw.style(hideSwitch ? "hidden" : "ml-[14px")}
					>
						<FypSwitch
							value={data.isEnable ?? false}
							onValueChange={(val) => onChangeEnable(val)}
						/>
					</FansView>
				</FansView>
			)}
		</FansView>
	);
};

export default RoleItem;
