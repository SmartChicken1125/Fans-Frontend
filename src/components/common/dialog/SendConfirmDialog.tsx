import { PurpleCheckSvg } from "@assets/svgs/common";
import { FansDivider } from "@components/controls";
import tw from "@lib/tailwind";
import {
	ConfirmDialogIconTypes,
	RoundButtonType,
} from "@usertypes/commonEnums";
import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Dialog, Portal } from "react-native-paper";
import RoundButton from "../RoundButton";

type Props = {
	icon?: ConfirmDialogIconTypes;
	onClose?: Function;
	title: string;
	text?: string;
	onConfirm?: Function;
};

export default function SendConfirmDialog({
	icon = ConfirmDialogIconTypes.SUCCESS,
	onClose = () => {},
	title = "",
	text = "",
	onConfirm = () => {},
}: Props) {
	const [isflag, setFlag] = useState(false);
	return (
		<Portal>
			<Dialog
				visible={true}
				onDismiss={() => {
					onClose();
				}}
				style={tw.style("bg-white")}
			>
				<View style={tw.style("flex gap-4 py-3 px-6")}>
					<View style={tw.style("flex-row justify-center")}>
						<Image
							source={require("@assets/images/posts/user-1.png")}
							alt="User"
							resizeMode="cover"
							style={tw.style("w-[78px] h-[78px] rounded-full")}
						/>
					</View>
					<FansDivider />
					<Text
						style={tw.style(
							"text-xl font-inter-semibold text-black text-center",
						)}
					>
						{title}
					</Text>
					{text && (
						<Text
							style={tw.style(
								"text-lg font-inter-regular text-center",
							)}
						>
							{text}
						</Text>
					)}
					<View
						style={tw.style(
							"flex-row gap-4 items-center justify-center",
						)}
					>
						<RoundButton
							variant={RoundButtonType.OUTLINE_PRIMARY}
							onPress={() => {
								onConfirm();
								onClose();
							}}
						>
							No, cancel
						</RoundButton>
						<RoundButton
							onPress={() => {
								onConfirm();
								onClose();
							}}
						>
							Yes, send
						</RoundButton>
					</View>
					<View
						style={tw.style("flex-row justify-center items-center")}
					>
						<TouchableOpacity style={tw.style("w-[25px] h-[25px]")}>
							{isflag ? (
								<View
									style={tw.style(
										"w-full h-full rounded-full bg-[#707070] border-primary",
									)}
								></View>
							) : (
								<PurpleCheckSvg />
							)}
						</TouchableOpacity>
						<Text style={tw.style("pl-2 text-lg")}>
							Do not ask again for Jane Love
						</Text>
					</View>
				</View>
			</Dialog>
		</Portal>
	);
}
