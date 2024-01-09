import RoundButton from "@components/common/RoundButton";
import { FypModal, FypText } from "@components/common/base";
import { FansDivider } from "@components/controls";
import { cdnURL } from "@helper/Utils";
import tw from "@lib/tailwind";
import { RoundButtonType } from "@usertypes/commonEnums";
import { IHighlight } from "@usertypes/types";
import React, { FC } from "react";
import { Image, View } from "react-native";

interface Props {
	visible: boolean;
	handleClose: () => void;
	handleConfirm: () => void;
	data?: IHighlight;
}

const DeleteHighlightModal: FC<Props> = (props) => {
	const { visible, handleClose, handleConfirm, data } = props;

	return (
		<FypModal
			visible={visible}
			onDismiss={handleClose}
			width={{ xs: "full", lg: 600 }}
		>
			<View style={tw.style("px-4 pb-[28px] pt-6")}>
				<View
					style={tw.style(
						"w-[78px] h-[78px] rounded-full mx-auto",
						data?.cover
							? ""
							: "border border-fans-grey dark:border-fans-grey-43",
					)}
				>
					{data?.cover ? (
						<Image
							source={{
								uri: cdnURL(data.cover),
							}}
							style={tw.style("w-[78px] h-[78px] rounded-full ")}
							resizeMode="cover"
						/>
					) : null}
				</View>

				<FansDivider style={tw.style("my-2")} />
				<FypText
					fontSize={19}
					lineHeight={26}
					fontWeight={700}
					textAlign="center"
					margin={{ b: 20 }}
					style={tw.style("text-fans-black dark:text-fans-white")}
				>
					{`Delete "${data?.title ?? ""}"?`}
				</FypText>

				<View style={tw.style("flex-row gap-x-[14px]")}>
					<View style={tw.style("flex-1")}>
						<RoundButton
							variant={RoundButtonType.OUTLINE_PRIMARY}
							onPress={handleClose}
						>
							No, cancel
						</RoundButton>
					</View>
					<View style={tw.style("flex-1")}>
						<RoundButton onPress={handleConfirm}>
							Yes, delete
						</RoundButton>
					</View>
				</View>
			</View>
		</FypModal>
	);
};

export default DeleteHighlightModal;
