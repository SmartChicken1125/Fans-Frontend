import { ChatSvg } from "@assets/svgs/common";
import { FypSvg, FypText } from "@components/common/base";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { useBlankLink } from "@utils/useBlankLink";
import React from "react";

const ChatWithUsBlock = () => {
	const [openLink] = useBlankLink();
	const handlePressChat = () => {
		openLink("https://support.fyp.fans/");
	};
	return (
		<FansView
			borderRadius={15}
			padding={{ t: 20, b: 28, x: 18 }}
			style={tw.style(
				"border border-fans-grey-de dark:border-fans-grey-50",
			)}
		>
			<FypText
				fontSize={17}
				lineHeight={22}
				fontWeight={600}
				textAlign="center"
				margin={{ b: 16 }}
			>
				Need help?
			</FypText>
			<FansView
				height={42}
				flexDirection="row"
				alignItems="center"
				justifyContent="center"
				borderRadius={42}
				gap={10}
				style={tw.style("border border-fans-purple")}
				pressableProps={{
					onPress: handlePressChat,
				}}
			>
				<FypSvg
					svg={ChatSvg}
					width={15}
					height={15}
					color="fans-purple"
				/>
				<FypText
					fontSize={19}
					lineHeight={26}
					fontWeight={700}
					style={tw.style("text-fans-purple")}
				>
					Chat with us
				</FypText>
			</FansView>
		</FansView>
	);
};

export default ChatWithUsBlock;
