import { CopySvg, CheckSvg, CopyLinkSvg } from "@assets/svgs/common";
import { FansText } from "@components/controls";
import tw from "@lib/tailwind";
import { Colors } from "@usertypes/enums";
import { truncateText } from "@utils/stringHelper";
import useClipboard from "@utils/useClipboard";
import React, { FC, useState, useEffect } from "react";
import { View, Pressable } from "react-native";
import Toast from "react-native-toast-message";

interface Props {
	linkIcon?: boolean;
	text: string;
	notificationContent?: string;
	style?: string;
	fontSize?: number;
}

const CopyText: FC<Props> = (props) => {
	const {
		text,
		linkIcon = false,
		notificationContent = "Copied to your clipboard",
		style,
		fontSize = 18,
	} = props;
	const { copyString } = useClipboard();

	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await copyString(text);
		Toast.show({
			type: "success",
			text1: notificationContent,
		});
		setCopied(true);
	};

	useEffect(() => {
		setCopied(false);
	}, []);

	return (
		<Pressable
			style={tw.style(
				"h-[42px]",
				"border border-fans-grey rounded-full",
				"flex-row justify-between items-center",
				"pl-[4px] pr-[4px]",
				style,
			)}
			onPress={handleCopy}
		>
			{linkIcon && (
				<View
					style={tw.style(
						"w-[34px] h-[34px] rounded-full bg-fans-green p-2 mr-2 items-center justify-center",
					)}
				>
					<CopyLinkSvg color="#fff" />
				</View>
			)}
			<FansText style={tw.style(`flex-1 text-[${fontSize}px]`)}>
				{truncateText(text, 30)}
			</FansText>
			<View
				style={tw.style(
					"w-[34px] h-[34px]",
					"bg-fans-grey",
					"flex justify-center items-center",
					"rounded-full",
				)}
			>
				<View style={tw.style("w-[20px] h-[16px]")}>
					{copied ? (
						<CheckSvg width={20} height={16} color={Colors.Green} />
					) : (
						<CopySvg width={20} height={16} />
					)}
				</View>
			</View>
		</Pressable>
	);
};

export default CopyText;
