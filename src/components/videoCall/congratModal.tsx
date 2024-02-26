import { CloseSvg } from "@assets/svgs/common";
import {
	FypModal,
	FypLinearGradientView,
	FypText,
	FypButton2,
} from "@components/common/base";
import { FansIconButton, FansView } from "@components/controls";
import { cdnURL } from "@helper/Utils";
import tw from "@lib/tailwind";
import React, { FC } from "react";
import { Image } from "react-native";

interface Props {
	visible: boolean;
	title: string;
	text: string;
	coverImage: string;
	handleBack: () => void;
	handleConfirm: () => void;
}

const CongratModal: FC<Props> = (props) => {
	const { visible, handleBack, handleConfirm, title, text, coverImage } =
		props;

	return (
		<FypModal
			visible={visible}
			onDismiss={handleConfirm}
			width={{ xs: "full", lg: 600 }}
		>
			<FansView position="relative" padding={{ b: 15 }}>
				<FansIconButton
					size={25}
					backgroundColor="bg-fans-black/30 dark:bg-fans-white/30"
					style={tw.style("absolute top-[13px] right-[13px] z-1")}
					onPress={handleConfirm}
				>
					<CloseSvg size={10} color="#fff" />
				</FansIconButton>
				<FansView
					height={110}
					position="relative"
					style={tw.style("rounded-t-[15px]")}
				>
					{coverImage ? (
						<Image
							source={{ uri: cdnURL(coverImage) }}
							style={tw.style("w-full h-full rounded-t-[15px]")}
						/>
					) : (
						<FypLinearGradientView
							colors={["#8a49f1", "#d885ff"]}
							position="relative"
							height={110}
							style={tw.style("rounded-t-[15px]")}
						/>
					)}
				</FansView>
				<FansView padding={{ x: 18, t: 24 }}>
					<FypText
						fontSize={21}
						fontWeight={700}
						lineHeight={28}
						margin={{ b: 6 }}
						textAlign="center"
					>
						{title}
					</FypText>

					<FypText
						fontSize={47}
						lineHeight={63}
						margin={{ b: 26 }}
						textAlign="center"
						style={tw.style("text-fans-purple")}
					>
						{text}
					</FypText>
					<FypButton2
						style={tw.style("bg-fans-purple")}
						textStyle={tw.style("text-fans-white")}
						pressableProps={{
							onPress: handleConfirm,
						}}
					>
						Fulfill more
					</FypButton2>
					<FypButton2
						textStyle={tw.style(
							"text-fans-black dark:text-fans-white",
						)}
						pressableProps={{
							onPress: handleBack,
						}}
					>
						Back to home
					</FypButton2>
				</FansView>
			</FansView>
		</FypModal>
	);
};

export default CongratModal;
