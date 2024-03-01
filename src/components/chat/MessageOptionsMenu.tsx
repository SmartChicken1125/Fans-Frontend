import {
	BlockSvg,
	CopySvg,
	OutlinedPinSvg,
	ReplySvg,
	ThreeDotsVerticalSvg,
	WarningSvg,
} from "@assets/svgs/common";
import { FansEmoji, FansSvg, FansText } from "@components/controls";
import tw from "@lib/tailwind";
import { Colors } from "@usertypes/enums";
import { IMessage } from "@usertypes/types";
import useClipboard from "@utils/useClipboard";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Menu } from "react-native-paper";
import { Popable, usePopable } from "react-native-popable";
import Toast from "react-native-toast-message";

const { copyString } = useClipboard();

export const MessageOptionsMenu = ({
	isSelf,
	message,
	onDeleteMessage,
	onReplyMessage,
	onReportMessage,
}: {
	isSelf?: boolean;
	message: IMessage;
	onDeleteMessage: (message: IMessage) => void;
	onReplyMessage: (message: IMessage) => void;
	onReportMessage: (message: IMessage) => void;
}) => {
	const [ref, { hide }] = usePopable();

	const onClose = () => hide();

	const onCopy = async () => {
		await copyString(message.content);
		Toast.show({
			type: "success",
			text1: "Message copied",
		});
		onClose();
	};

	const onReply = () => {
		onReplyMessage(message);
		onClose();
	};

	const onUnsend = () => {
		onDeleteMessage(message);
		onClose();
	};

	const onReport = () => {
		onReportMessage(message);
		onClose();
	};

	return (
		<Popable
			ref={ref}
			action="press"
			position={isSelf ? "left" : "right"}
			style={tw.style("w-auto")}
			content={
				<View style={tw.style("bg-fans-black-1d rounded-[10px] p-2")}>
					<View style={tw.style("flex-row")}>
						<FansText
							onPress={onCopy}
							style={tw.style("text-white text-sm ml-1 mr-2")}
						>
							Copy
						</FansText>
						<FansText
							onPress={onReply}
							style={tw.style("text-white text-sm mr-2")}
						>
							Reply
						</FansText>
						{isSelf && (
							<FansText
								onPress={onUnsend}
								style={tw.style("text-white text-sm mr-2")}
							>
								Unsend
							</FansText>
						)}
						{!isSelf && (
							<FansText
								onPress={onReport}
								style={tw.style("text-white text-sm")}
							>
								Report
							</FansText>
						)}
					</View>
				</View>
			}
		>
			<View style={tw.style("p-3")}>
				<FansSvg
					width={4}
					height={16}
					svg={ThreeDotsVerticalSvg}
					color1="grey-70"
				/>
			</View>
		</Popable>
	);
};

export const MessageMenu = () => {
	const [open, setOpen] = useState(false);

	return (
		<Menu
			visible={open}
			anchor={
				<View style={tw.style("h-[1px]")}>
					<FansText> </FansText>
				</View>
			}
			anchorPosition="bottom"
			contentStyle={tw.style(
				"bg-white",
				"flex gap-5",
				"px-5 py-[12px]",
				"rounded-[21px]",
			)}
			onDismiss={() => setOpen(false)}
		>
			<>
				<View style={tw.style("flex-row gap-[15px] items-center")}>
					<ReplySvg size={25} />
					<FansText>Reply</FansText>
				</View>
				<View style={tw.style("flex-row gap-[15px] items-center")}>
					<CopySvg size={25} />
					<FansText>Copy</FansText>
				</View>
				<View style={tw.style("flex-row gap-[15px] items-center")}>
					<View style={tw.style("p-[2px]")}>
						<OutlinedPinSvg size={21} />
					</View>
					<FansText>Pin</FansText>
				</View>
				<View style={tw.style("flex-row gap-[15px] items-center")}>
					<View style={tw.style("p-[1px]")}>
						<BlockSvg size={23} />
					</View>
					<FansText>Unsend 300s</FansText>
				</View>
				<View style={tw.style("flex-row gap-[15px] items-center")}>
					<View style={tw.style("p-[1px]")}>
						<WarningSvg size={23} color={Colors.Red} />
					</View>
					<FansText>Report</FansText>
				</View>
			</>
		</Menu>
	);
};

export const ReactionMenu = () => {
	const [open, setOpen] = useState(false);

	return (
		<Menu
			visible={open}
			anchor={
				<View style={tw.style("h-[1px]")}>
					<FansText></FansText>
				</View>
			}
			anchorPosition="top"
			contentStyle={[
				tw.style(
					"bg-white",
					"flex-row gap-[5px]",
					"px-5 py-[12px]",
					"rounded-full",
					"top-[-60px]",
				),
			]}
			onDismiss={() => setOpen(false)}
		>
			<>
				{Array.from(Array(6)).map((_, index) => (
					<TouchableOpacity
						key={index}
						// onPress={() => handlePressEmoji(index + 1)}
					>
						<FansEmoji
							size={24}
							emoji={index + 1}
							style={tw.style("leading-[24px]")}
						/>
					</TouchableOpacity>
				))}
			</>
		</Menu>
	);
};
