import {
	AttentionCard,
	CancelSubscriptionModal,
	SubscriptionCard,
} from "@components/common/subscriptionCard";
import {
	FansChips,
	FansGap,
	FansScreen3,
	FansView,
} from "@components/controls";
import { SendMessageDialog } from "@components/posts/dialogs";
import SettingsNavigationHeader from "@components/screens/settings/SettingsNavigationHeader";
import SettingsNavigationLayout from "@components/screens/settings/SettingsNavigationLayout";
import SubscriptionDetailsSheet from "@components/sheet/settings/subscriptions/SubscriptionDetails";
import { ANIMATION_LOADING_DIALOG_ID } from "@constants/modal";
import {
	CommonActionType,
	ModalActionType,
	useAppContext,
} from "@context/useAppContext";
import {
	getSubscriptions,
	unsubscribe,
} from "@helper/endpoints/subscriptions/apis";
import tw from "@lib/tailwind";
import {
	NativeStackScreenProps,
	createNativeStackNavigator,
} from "@react-navigation/native-stack";
import {
	SubscribeActionType,
	SubscriptionFilterTypes,
	SubscriptionTypes,
} from "@usertypes/commonEnums";
import { SettingsSubscriptionsNativeStackParams } from "@usertypes/navigations";
import { Subscription } from "@usertypes/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

const Stack =
	createNativeStackNavigator<SettingsSubscriptionsNativeStackParams>();

const SettingsSubscriptionsNativeStack = () => {
	const { returnPopup, subscriptionId } = useLocalSearchParams();
	const router = useRouter();

	return (
		<Stack.Navigator
			initialRouteName="Subscriptions"
			screenOptions={{
				header: (props) => SettingsNavigationHeader(props, router),
			}}
		>
			<Stack.Screen
				name="Subscriptions"
				component={SubscriptionsContentView}
				options={{
					title: "Subscriptions",
				}}
				initialParams={{ returnPopup, subscriptionId }}
			/>
		</Stack.Navigator>
	);
};

const SubscriptionsContentView = (
	props: NativeStackScreenProps<
		SettingsSubscriptionsNativeStackParams,
		"Subscriptions"
	>,
) => {
	const { route } = props;
	const { params } = route;
	const { returnPopup, subscriptionId } = params || {};

	const { dispatch } = useAppContext();

	const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

	const [activeSubscriptions, setActiveSubscriptions] = useState<
		Subscription[]
	>([]);

	const [expiredSubscriptions, setExpiredSubscriptions] = useState<
		Subscription[]
	>([]);

	const [needAttentionSubscriptions, setNeedAttentionSubscriptions] =
		useState<Subscription[]>([]);

	const items = [
		{ text: `All ${subscriptions.length}` },
		{ text: `Active ${activeSubscriptions.length}` },
		{ text: `Expired ${expiredSubscriptions.length}` },
		{ text: `Need attention ${needAttentionSubscriptions.length}` },
	];

	const [selected, setSelected] = useState(0);
	const [
		isCancelSubscriptionModalVisible,
		setCancelSubscriptionModalVisible,
	] = useState(false);
	const [isMessageDialogOpened, setMessageDialogOpened] = useState(false);

	const handlePressMessage = () => setMessageDialogOpened(true);
	const handleCloseMessageDialog = () => setMessageDialogOpened(false);

	const [openActions, setOpenActions] = useState(0);
	const [selectedSubscription, setSelectedSubscription] =
		useState<Subscription>();

	const fetchSubscriptions = async () => {
		try {
			const response = await getSubscriptions();

			if (response.ok) {
				const activeSubscriptions = response.data.filter(
					(subscription) =>
						subscription.status === "Active" ||
						new Date(subscription.endDate) >= new Date(),
				);

				const expiredSubscriptions = response.data.filter(
					(subscription) =>
						subscription.status === "Cancelled" &&
						new Date(subscription.endDate) < new Date(),
				);

				const needAttentionSubscriptions = response.data.filter(
					(subscription) => subscription.error,
				);

				setSubscriptions(
					response.data.filter((subscription) => !subscription.error),
				);
				setActiveSubscriptions(activeSubscriptions);
				setExpiredSubscriptions(expiredSubscriptions);
				setNeedAttentionSubscriptions(needAttentionSubscriptions);
			} else {
				Toast.show({
					type: "error",
					text1: response.data.message,
				});
			}
		} catch (error) {
			Toast.show({
				type: "error",
				text1: "Something went wrong",
			});
		}
	};

	useEffect(() => {
		fetchSubscriptions();
	}, []);

	const showLoading = () => {
		dispatch.setModal({
			type: ModalActionType.showModal,
			data: { id: ANIMATION_LOADING_DIALOG_ID, show: true },
		});
	};

	const hideLoading = () => {
		dispatch.setModal({
			type: ModalActionType.showModal,
			data: { id: ANIMATION_LOADING_DIALOG_ID, show: false },
		});
	};

	const onDeleteSubscription = async (subscription?: Subscription) => {
		if (!selectedSubscription && !subscription) return;
		const subscriptionId = subscription?.id || selectedSubscription?.id;
		if (!subscriptionId) return;

		try {
			showLoading();
			const response = await unsubscribe({
				id: subscriptionId,
			});

			hideLoading();
			if (response.ok) {
				fetchSubscriptions();
				Toast.show({
					type: "success",
					text1: "Subscription deleted",
				});
			} else {
				Toast.show({
					type: "error",
					text1: response.data.message,
				});
			}
		} catch (error) {
			Toast.show({
				type: "error",
				text1: "Something went wrong",
			});
		}
	};

	const handleOpenSubscribeModal = (subscription?: Subscription) => {
		if (!subscription) return;

		dispatch.setCommon({
			type: CommonActionType.toggleSubscribeModal,
			data: {
				visible: true,
				creator: subscription.creator,
				subscribeActionType: subscription.bundle
					? SubscribeActionType.Bundle
					: subscription.tier
					? SubscribeActionType.Tier
					: SubscribeActionType.Subscribe,
				bundleId: subscription.bundle?.id,
				subscribeTierId: (subscription.subscriptionId?.toString() ??
					subscription.tierId?.toString())!,
				defaultTab: "start",
				onSuccess: fetchSubscriptions,
			},
		});
	};

	return (
		<FansScreen3 contentStyle1={{ maxWidth: { lg: 670 } }}>
			<FansView style={tw.style("flex-column gap-[20px]")}>
				<FansChips
					data={items}
					value={selected}
					onChangeValue={setSelected}
				/>

				{(selected === 0 || selected === 1) &&
					activeSubscriptions.map((subscription) => (
						<SubscriptionCard
							key={subscription.id}
							subscription={subscription}
							variant={
								subscription.status === "Active" ||
								new Date(subscription.endDate) >= new Date()
									? SubscriptionFilterTypes.Active
									: SubscriptionFilterTypes.Expired
							}
							onClickShare={() => {}}
							onClickMenu={() => {
								setOpenActions(1);
								setSelectedSubscription(subscription);
							}}
							onClickMessage={handlePressMessage}
							showUpdatePaymentPopup={
								returnPopup ===
									"UpdatePaymentMethodSubscriptions" &&
								subscriptionId === subscription.id
							}
							onDeleteSubscription={onDeleteSubscription}
						/>
					))}
				{(selected === 0 || selected === 2) &&
					expiredSubscriptions.map((subscription) => (
						<SubscriptionCard
							key={subscription.id}
							subscription={subscription}
							variant={SubscriptionFilterTypes.Expired}
							onClickShare={() => {}}
							onClickMenu={() => {
								setOpenActions(1);
								setSelectedSubscription(subscription);
							}}
							onClickMessage={handlePressMessage}
							onDeleteSubscription={onDeleteSubscription}
						/>
					))}
				{(selected === 0 || selected === 3) &&
					needAttentionSubscriptions.map((subscription) => (
						<FansView
							key={subscription.id}
							style={tw.style("mt-6 gap-y-4")}
						>
							<AttentionCard
								subscription={subscription}
								onDeleteSubscription={onDeleteSubscription}
							/>
						</FansView>
					))}
			</FansView>
			<SubscriptionDetailsSheet
				isActive={
					selectedSubscription?.status ===
					SubscriptionFilterTypes.Active
				}
				open={openActions !== 0}
				onClose={() => setOpenActions(0)}
				onDeleteSubscription={() =>
					setCancelSubscriptionModalVisible(true)
				}
				onRenewSubscription={() => {
					setOpenActions(0);
					handleOpenSubscribeModal(selectedSubscription);
				}}
			/>
			<CancelSubscriptionModal
				visible={isCancelSubscriptionModalVisible}
				onClose={() => setCancelSubscriptionModalVisible(false)}
				onSubmit={() => {
					setOpenActions(0);
					setCancelSubscriptionModalVisible(false);
					onDeleteSubscription();
				}}
			/>
			<SendMessageDialog
				open={isMessageDialogOpened}
				onClose={handleCloseMessageDialog}
			/>
			<FansGap height={20} />
		</FansScreen3>
	);
};

const SubscriptionsScreen = () => {
	return SettingsNavigationLayout(<SettingsSubscriptionsNativeStack />);
};

export default SubscriptionsScreen;
