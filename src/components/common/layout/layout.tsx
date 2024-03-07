import {
	FairTransactionDialog,
	LoadingModal,
	ManageSubscriptionDialog,
	NoticeChargeBackDialog,
} from "@components/common/dialog";
import { FansView } from "@components/controls";
import { PostTypesDialog } from "@components/posts/dialogs";
import {
	FAIR_TRANSACTION_DIALOG_ID,
	MANAGE_SUBSCRIPTION_DIALOG_ID,
	NOTICE_CHARGEBACKS_DIALOG_ID,
} from "@constants/modal";
import { ModalActionType, useAppContext } from "@context/useAppContext";
import { popupStatus } from "@helper/endpoints/profile/apis";
import tw from "@lib/tailwind";
import { Subscription } from "@usertypes/types";
import Head from "expo-router/head";
import React, { FC, ReactNode, useEffect, useState } from "react";
import Sidebar from "./sidebar";

interface Props {
	title?: string;
	description?: string;
	children: ReactNode;
}

const AppLayout: FC<Props> = (props) => {
	const { children, title = "FYP.Fans", description = "" } = props;
	const { state, dispatch } = useAppContext();
	const { toggleTheme } = dispatch;
	const [subscription, setSubscription] = useState<Subscription>();

	useEffect(() => {
		if (state.user.userInfo.id === "0") return;

		const fetchPopupStatus = async () => {
			const resp = await popupStatus();

			if (resp.ok) {
				if (resp.data.popupStatus.showFairTransactionDialog) {
					dispatch.setModal({
						type: ModalActionType.showModal,
						data: { id: FAIR_TRANSACTION_DIALOG_ID, show: true },
					});
				}

				if (resp.data.popupStatus.showNoticeChargeBackDialog) {
					dispatch.setModal({
						type: ModalActionType.showModal,
						data: { id: NOTICE_CHARGEBACKS_DIALOG_ID, show: true },
					});
				}

				if (
					resp.data.popupStatus.showManageSubscriptionDialog &&
					resp.data.popupStatus.paymentSubscription
				) {
					setSubscription(resp.data.popupStatus.paymentSubscription);
					dispatch.setModal({
						type: ModalActionType.showModal,
						data: { id: MANAGE_SUBSCRIPTION_DIALOG_ID, show: true },
					});
				}
			}
		};
		fetchPopupStatus();
	}, [state.user.userInfo.id]);

	return (
		<FansView
			flex="1"
			background="relative"
			flexDirection="row"
			style={tw.style(
				"md:pl-[251px] lg:pl-[327px] xl:pl-[401px]",
				"bg-fans-white dark:bg-fans-black-1d",
			)}
		>
			<Head>
				<title>{title}</title>
				<meta name="description" content={description} />
			</Head>
			<Sidebar toggleTheme={toggleTheme} />
			{children}
			<PostTypesDialog />
			<LoadingModal />
			<ManageSubscriptionDialog subscription={subscription} />
			<NoticeChargeBackDialog />
			<FairTransactionDialog />
		</FansView>
	);
};

export default AppLayout;
