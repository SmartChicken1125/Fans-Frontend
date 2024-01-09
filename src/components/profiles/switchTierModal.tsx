import RoundButton from "@components/common/RoundButton";
import TextButton from "@components/common/TextButton";
import { FypText } from "@components/common/base";
import ListLine from "@components/common/listLine";
import tw from "@lib/tailwind";
import React, { FC } from "react";
import { Image, Pressable, View } from "react-native";
import { Modal, Portal } from "react-native-paper";

interface Props {
	visible: boolean;
	handleClose: () => void;
	onSwitchToTiers: () => void;
	onKeep: () => void;
}

const SwitchTierModal: FC<Props> = (props) => {
	const { visible, handleClose, onSwitchToTiers, onKeep } = props;

	return (
		<Portal>
			<Modal
				visible={visible}
				onDismiss={handleClose}
				contentContainerStyle={tw.style(
					"bg-fans-white dark:bg-fans-black-1d rounded-[15px] mx-[18px] md:max-w-150 md:mx-auto",
				)}
			>
				<View
					style={tw.style(
						"justify-center flex-row bg-[#f6edff] py-[30px] rounded-t-[15px]",
					)}
				>
					<Image
						source={require("@assets/images/profile/tierd-subscription.png")}
						style={tw.style("w-[185px] h-[136px]")}
						resizeMode="cover"
					/>
				</View>
				<View style={tw.style("pt-10 px-[28px] pb-11")}>
					<FypText
						fontSize={23}
						lineHeight={31}
						fontWeight={700}
						textAlign="center"
						margin={{ b: 18 }}
						style={tw.style("text-fans-black dark:text-fans-white")}
					>
						Tiered subscriptions
					</FypText>
					<FypText
						fontSize={16}
						lineHeight={21}
						textAlign="center"
						style={tw.style("text-fans-black dark:text-fans-white")}
					>
						Tiered subscriptions allow you to offer exclusive
						content based on different membership levels or 'Tiers'.
					</FypText>

					<View style={tw.style("gap-y-[18px] mt-[28px]")}>
						<ListLine
							size="lg"
							text="Design distinct membership tiers"
						/>
						<ListLine
							size="lg"
							text="Attract a wider audience with adjustable prices"
						/>
						<ListLine
							size="lg"
							text="Enhance earnings by appealing to diverse tastes"
						/>
					</View>

					<View
						style={tw.style(
							"w-[186px] mx-auto mt-[14px] gap-y-[10px]",
						)}
					>
						<RoundButton onPress={onSwitchToTiers}>
							Switch to tiers
						</RoundButton>
						<TextButton onPress={onKeep}>
							Keep subscription
						</TextButton>
					</View>
				</View>
			</Modal>
		</Portal>
	);
};

export default SwitchTierModal;
