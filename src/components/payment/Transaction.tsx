import { CheckSvg, ThreeDotsVerticalSvg } from "@assets/svgs/common";
import AvatarWithStatus from "@components/common/AvatarWithStatus";
import { FansDivider, FansText } from "@components/controls";
import tw from "@lib/tailwind";
import { Colors } from "@usertypes/enums";
import { CreatorReferralTransaction } from "@usertypes/types";
import { DateTime } from "luxon";
import React, { FC } from "react";
import { TouchableOpacity, View } from "react-native";

const Transaction: FC<{
	data?: CreatorReferralTransaction;
	onClickAvatar?: () => void;
	onClickMenu?: () => void;
}> = (props) => {
	return (
		<>
			<View style={tw.style("flex-row gap-[10px] items-center")}>
				<AvatarWithStatus
					size={34}
					avatar={props.data?.referent?.avatar}
					onPress={props.onClickAvatar}
				/>
				<View style={tw.style("grow gap-1")}>
					<View style={tw.style("flex-row gap-4 items-center")}>
						<FansText fontSize={16}>
							{props.data?.referent?.displayName ?? ""}
						</FansText>
						<FansText color="green-4d" fontSize={14}>
							10%
						</FansText>
					</View>
					<FansText color="grey-70" fontSize={13}>
						Wells Fargo Bank **** 1234
					</FansText>
				</View>

				<View style={tw.style("flex items-end gap-1")}>
					<View
						style={tw.style(
							"bg-fans-green/10 flex-row gap-[5px]",
							"px-[10px]",
							"rounded-full",
						)}
					>
						<CheckSvg color={Colors.Green} width={10} />
						<FansText color="green-4d" fontSize={14}>
							${(props.data?.amount ?? 15).toLocaleString()}
						</FansText>
					</View>
					<FansText
						color="grey-70"
						fontSize={13}
						style={tw.style("uppercase")}
					>
						{DateTime.fromISO(
							props.data?.updatedAt ?? "2023-09-05T23:39:10.318Z",
						).toFormat("MMM d, h:mm a")}
					</FansText>
				</View>

				<TouchableOpacity onPress={props.onClickMenu}>
					<ThreeDotsVerticalSvg size={18} />
				</TouchableOpacity>
			</View>
			<FansDivider style={tw.style("my-[17px]")} />
		</>
	);
};

export default Transaction;
