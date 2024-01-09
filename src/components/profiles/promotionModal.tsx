import {
	CopyLinkSvg,
	CopySvg,
	RedirectSvg,
	CloseSvg,
} from "@assets/svgs/common";
import { FypSvg, FypText } from "@components/common/base";
import { FansIconButton } from "@components/controls";
import tw from "@lib/tailwind";
import useClipboard from "@utils/useClipboard";
import React, { FC } from "react";
import { View, Image } from "react-native";
import { Modal, Portal } from "react-native-paper";

interface Props {
	visible: boolean;
	handleClose: () => void;
}

const PromotionModal: FC<Props> = (props) => {
	const { visible, handleClose } = props;
	const { copyString } = useClipboard();

	const handleCopy = async () => {
		await copyString("fyp.fans/campaign");
	};

	return (
		<Portal>
			<Modal
				visible={visible}
				onDismiss={handleClose}
				contentContainerStyle={tw.style(
					"bg-fans-white dark:bg-fans-black-1d rounded-[15px] mx-[18px]",
				)}
			>
				<View
					style={tw.style(
						"justify-center flex-row relative rounded-t-[15px]",
						"bg-fans-purple-f6 dark:bg-fans-purple-47",
					)}
				>
					<Image
						source={require("@assets/images/profile/promotion-congrats.jpg")}
						style={tw.style("w-full h-[148px] rounded-t-[15px]")}
						resizeMode="cover"
					/>
					<FansIconButton
						size={25}
						backgroundColor="bg-fans-black/30 dark:bg-fans-white/30"
						style={tw.style(
							"m-0 absolute top-[14px] right-[14px]2",
						)}
						onPress={handleClose}
					>
						<FypSvg
							svg={CloseSvg}
							width={9.33}
							height={9.33}
							color="fans-white dark:fans-black-1d"
						/>
					</FansIconButton>
				</View>
				<View style={tw.style("pt-[30px] px-[28px] pb-11")}>
					<FypText
						fontSize={23}
						lineHeight={31}
						fontWeight={700}
						textAlign="center"
						style={tw.style("text-fans-black dark:text-fans-white")}
					>
						Congrats,
					</FypText>
					<FypText
						fontSize={23}
						lineHeight={31}
						fontWeight={700}
						textAlign="center"
						margin={{ b: 16 }}
						style={tw.style("text-fans-black dark:text-fans-white")}
					>
						your campaign is live!
					</FypText>
					<FypText
						fontSize={16}
						lineHeight={21}
						textAlign="center"
						margin={{ b: 28 }}
						style={tw.style("text-fans-black dark:text-fans-white")}
					>
						Share the link below to let people use the discount, and
						track your campaigns success
					</FypText>

					<View
						style={tw.style("flex-row gap-x-[7px] justify-center")}
					>
						<View
							style={tw.style(
								"border rounded-[25px] p-[5px] flex-row items-center w-[192px]",
								"border-fans-grey dark:border-fans-grey-43",
							)}
						>
							<FansIconButton
								size={24}
								backgroundColor="bg-fans-purple"
								style={tw.style("mr-2")}
							>
								<FypSvg
									svg={CopyLinkSvg}
									width={13.91}
									height={13.92}
									color="fans-white dark:fans-black-1d"
								/>
							</FansIconButton>
							<FypText
								fontSize={16}
								lineHeight={21}
								style={tw.style("text-fans-purple")}
							>
								fyp.fans/campaign
							</FypText>
						</View>
						<FansIconButton
							backgroundColor="bg-fans-purple"
							size={34}
						>
							<FypSvg
								svg={CopySvg}
								width={14.71}
								height={18.73}
								color="fans-white dark:fans-black-1d"
							/>
						</FansIconButton>
						<FansIconButton
							backgroundColor="bg-fans-purple"
							size={34}
						>
							<FypSvg
								svg={RedirectSvg}
								width={17.65}
								height={12.3}
								color="fans-white dark:fans-black-1d"
							/>
						</FansIconButton>
					</View>
				</View>
			</Modal>
		</Portal>
	);
};

export default PromotionModal;
