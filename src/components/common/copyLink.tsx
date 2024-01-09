import { CopyLinkSvg, CopySvg, CheckSvg } from "@assets/svgs/common";
import { FypSvg } from "@components/common/base";
import { FansView, FansIconButton, FansText } from "@components/controls";
import tw from "@lib/tailwind";
import { truncateText } from "@utils/stringHelper";
import useClipboard from "@utils/useClipboard";
import React, { FC, useState, useEffect } from "react";
import { Pressable } from "react-native";

interface Props {
	url: string;
}

const CopyLink: FC<Props> = (props) => {
	const { url } = props;
	const { copyString } = useClipboard();

	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await copyString(/^https?:\/\//.test(url) ? url : `https://${url}`);
		setCopied(true);
	};

	const urlWithoutProtocol = url.replace(/^https?:\/\//, "");

	useEffect(() => {
		setCopied(false);
	}, []);

	return (
		<Pressable
			onPress={handleCopy}
			style={tw.style("flex-row items-center")}
		>
			<FansView
				borderRadius={25}
				padding={{ y: 5, l: 5, r: 20 }}
				flexDirection="row"
				alignItems="center"
				style={tw.style(
					"border border-fans-grey-f0 dark:border-fans-grey-43",
				)}
			>
				<FansIconButton
					size={24}
					backgroundColor="bg-fans-purple"
					style={tw.style("mr-2")}
				>
					<CopyLinkSvg width={13.91} height={13.92} color="#fff" />
				</FansIconButton>
				<FansText color="purple-a8" fontSize={16} lineHeight={21}>
					{truncateText(urlWithoutProtocol, 30)}
				</FansText>
			</FansView>
			<FansView margin={{ l: 8 }}>
				{copied ? (
					<FypSvg
						svg={CheckSvg}
						width={20}
						height={16}
						color="fans-purple"
					/>
				) : (
					<FypSvg
						svg={CopySvg}
						width={15}
						height={19}
						color="fans-purple"
					/>
				)}
			</FansView>
		</Pressable>
	);
};

export default CopyLink;
