import RoundButton from "@components/common/RoundButton";
import TextButton from "@components/common/TextButton";
import { FypText } from "@components/common/base";
import ListLine from "@components/common/listLine";
import tw from "@lib/tailwind";
import React, { FC } from "react";
import { View, Image, Pressable } from "react-native";
import { Modal, Portal } from "react-native-paper";

interface Props {
	visible: boolean;
	handleClose: () => void;
	onSwitchToSubscription: () => void;
	onKeep: () => void;
}

const SwitchSubscriptionModal: FC<Props> = (props) => {
	const { visible, handleClose, onSwitchToSubscription, onKeep } = props;

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
						"justify-center flex-row bg-fans-purple-f6 dark:bg-fans-purple-47 pt-6 pb-10 rounded-t-[15px]",
					)}
				>
					<Image
						source={require("@assets/images/profile/subscription.png")}
						style={tw.style("w-[247px] h-[102px]")}
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
						Subscriptions
					</FypText>
					<FypText
						fontSize={16}
						lineHeight={21}
						textAlign="center"
						style={tw.style("text-fans-black dark:text-fans-white")}
					>
						Subscription-Based Services allow you to offer exclusive
						content bases on different subscription levels.
					</FypText>

					<View style={tw.style("gap-y-[18px] mt-[28px]")}>
						<ListLine
							size="lg"
							text="Design unique subscription packages"
						/>
						<ListLine
							size="lg"
							text="Simpler approach to no overwhelm your fans"
						/>
					</View>

					<View
						style={tw.style(
							"w-[268px] mx-auto mt-[14px] gap-y-[10px]",
						)}
					>
						<RoundButton onPress={onSwitchToSubscription}>
							Switch to subscription
						</RoundButton>
						<TextButton onPress={onKeep}>Keep tiers</TextButton>
					</View>
				</View>
			</Modal>
		</Portal>
	);
};

export default SwitchSubscriptionModal;
