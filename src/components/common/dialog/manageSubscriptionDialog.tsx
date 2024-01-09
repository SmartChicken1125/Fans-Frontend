import {
	Calendar1Svg,
	ClockSvg,
	CloseSvg,
	Dollar3Svg,
} from "@assets/svgs/common";
import UserAvatar from "@components/avatar/UserAvatar";
import TextButton from "@components/common/TextButton";
import { FypModal, FypLinearGradientView } from "@components/common/base";
import {
	FansText,
	FansIconButton,
	FansDivider,
	FansView,
} from "@components/controls";
import { MANAGE_SUBSCRIPTION_DIALOG_ID } from "@constants/modal";
import { ModalState } from "@context/state/modalState";
import { useAppContext, ModalActionType } from "@context/useAppContext";
import tw from "@lib/tailwind";
import { Subscription } from "@usertypes/types";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import RoundButton from "../RoundButton";

interface Props {
	subscription?: Subscription;
}

const ManageSubscriptionDialog = (props: Props) => {
	const { subscription } = props;

	const router = useRouter();

	const { state, dispatch } = useAppContext();
	const modals = state.modal.modals;
	const modal = modals.find(
		(m) => m.id === MANAGE_SUBSCRIPTION_DIALOG_ID,
	) as ModalState;
	const visible = !!modal && modal.show;

	const handleClose = () => {
		dispatch.setModal({
			type: ModalActionType.showModal,
			data: { id: MANAGE_SUBSCRIPTION_DIALOG_ID, show: false },
		});
	};

	const onManageSubscription = () => {
		router.push("/settings?screen=Subscriptions");
		handleClose();
	};

	const nextRechargeDate = subscription && new Date(subscription.startDate);

	return (
		<FypModal
			visible={visible}
			onDismiss={handleClose}
			width={{ xs: "full", lg: 600 }}
		>
			<FansView position="relative" padding={{ x: 18, t: 26, b: 14 }}>
				<FansIconButton
					size={25}
					backgroundColor="bg-fans-black/30 dark:bg-fans-white/30"
					style={tw.style("absolute top-[13.5px] right-4")}
					onPress={handleClose}
				>
					<CloseSvg size={10} color="#fff" />
				</FansIconButton>
				<View style={tw.style("relative mx-auto mb-4")}>
					<UserAvatar size="95px" image={state.profile.avatar} />
					<FansView
						style={tw.style("p-1 bg-white rounded-full")}
						position="absolute"
						right={-4}
						bottom={-10}
					>
						<FypLinearGradientView
							width={34}
							height={34}
							borderRadius={34}
							justifyContent="center"
							alignItems="center"
							colors={["#a854f5", "#a854f5", "#d885ff"]}
						>
							<Dollar3Svg color="#fff" />
						</FypLinearGradientView>
					</FansView>
				</View>
				<FansText
					fontSize={23}
					lineHeight={31}
					style={tw.style("text-center font-bold mb-[22px]")}
				>{`Hello, ${state.user.userInfo.username}`}</FansText>
				<FansText
					fontSize={16}
					lineHeight={21}
					style={tw.style("text-center mb-8")}
				>
					Notice of recharge for your subscription with{" "}
					{subscription?.creator.displayName}. We believe in
					transparency, so here are the details of your upcoming
					payment:
				</FansText>

				<View style={tw.style("items-center flex-row")}>
					<View
						style={tw.style(
							"w-[18px] h-[18px] flex-row items-center justify-center mr-2",
						)}
					>
						<Calendar1Svg color="#707070" />
					</View>

					<FansText
						fontSize={17}
						lineHeight={22}
						style={tw.style("font-semibold text-fans-grey-70")}
					>
						NEXT CHARGE DATE
					</FansText>
					<FansText
						fontSize={17}
						lineHeight={22}
						style={tw.style(
							"text-fans-purple font-semibold ml-auto",
						)}
					>
						{nextRechargeDate?.toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
						})}
					</FansText>
				</View>

				<FansDivider
					color="fans-grey-f0"
					style={tw.style("my-[13.5px]")}
				/>

				<View style={tw.style("items-center flex-row mb-7")}>
					<View
						style={tw.style(
							"w-[18px] h-[18px] flex-row items-center justify-center mr-2",
						)}
					>
						<ClockSvg color="#707070" />
					</View>

					<FansText
						fontSize={17}
						lineHeight={22}
						style={tw.style("font-semibold text-fans-grey-70")}
					>
						AMOUNT
					</FansText>
					<FansText
						fontSize={17}
						lineHeight={22}
						style={tw.style(
							"text-fans-purple font-semibold ml-auto",
						)}
					>
						$ {subscription?.amount} USD
					</FansText>
				</View>

				<FansText
					fontSize={16}
					lineHeight={21}
					style={tw.style("text-center mb-6")}
				>
					You can manage, modify, or cancel your subscriptions anytime
					from your account
				</FansText>

				<RoundButton onPress={onManageSubscription}>
					Manage subscription
				</RoundButton>
				<TextButton onPress={handleClose}>Close</TextButton>
			</FansView>
		</FypModal>
	);
};

export default ManageSubscriptionDialog;
