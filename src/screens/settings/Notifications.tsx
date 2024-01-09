import {
	FansGap,
	FansHorizontalDivider,
	FansScreen3,
	FansSwitch,
	FansText,
	FansView,
} from "@components/controls";
import { useAppContext } from "@context/useAppContext";
import {
	getNotificationSettings,
	updateNotificationSettings,
} from "@helper/endpoints/notifications/apis";
import { UserRoleTypes } from "@usertypes/commonEnums";
import React, { useEffect, useState } from "react";

const NotificationsScreen = () => {
	const { state } = useAppContext();
	const { user } = state;
	const { userInfo } = user;
	const { type } = userInfo;

	const isCreator = type === UserRoleTypes.Creator;

	const [newSubscriberCreatorEmail, setNewSubscriberCreatorEmail] =
		useState(false);
	const [tipCreatorEmail, setTipCreatorEmail] = useState(false);
	const [paidPostCreatorEmail, setPaidPostCreatorEmail] = useState(false);
	const [messageCreatorEmail, setMessageCreatorEmail] = useState(false);
	const [chargebackCreatorEmail, setChargebackCreatorEmail] = useState(false);
	const [messageFanEmail, setMessageFanEmail] = useState(false);
	const [transactionFanEmail, setTransactionFanEmail] = useState(false);
	const [chargebackFanEmail, setChargebackFanEmail] = useState(false);
	const [newPostFanEmail, setNewPostFanEmail] = useState(false);
	const [newSubscriberCreatorInApp, setNewSubscriberCreatorInApp] =
		useState(false);
	const [cancelSubscriptionCreatorInApp, setCancelSubscriptionCreatorInApp] =
		useState(false);
	const [tipCreatorInApp, setTipCreatorInApp] = useState(false);
	const [paidPostCreatorInApp, setPaidPostCreatorInApp] = useState(false);
	const [chargebackCreatorInApp, setChargebackCreatorInApp] = useState(false);
	const [messageCreatorInApp, setMessageCreatorInApp] = useState(false);
	const [commentCreatorInApp, setCommentCreatorInApp] = useState(false);
	const [likeCreatorInApp, setLikeCreatorInApp] = useState(false);
	const [messageFanInApp, setMessageFanInApp] = useState(false);
	const [transactionFanInApp, setTransactionFanInApp] = useState(false);
	const [chargebackFanInApp, setChargebackFanInApp] = useState(false);
	const [replyCommentInApp, setReplyCommentInApp] = useState(false);
	const [mentionedInApp, setMentionedInApp] = useState(false);

	useEffect(() => {
		const fetchSettings = async () => {
			const resp = await getNotificationSettings();

			if (resp.ok) {
				setNewSubscriberCreatorEmail(
					resp.data.newSubscriberCreatorEmail,
				);
				setTipCreatorEmail(resp.data.tipCreatorEmail);
				setPaidPostCreatorEmail(resp.data.paidPostCreatorEmail);
				setMessageCreatorEmail(resp.data.messageCreatorEmail);
				setChargebackCreatorEmail(resp.data.chargebackCreatorEmail);
				setMessageFanEmail(resp.data.messageFanEmail);
				setTransactionFanEmail(resp.data.transactionFanEmail);
				setChargebackFanEmail(resp.data.chargebackFanEmail);
				setNewPostFanEmail(resp.data.newPostFanEmail);
				setNewSubscriberCreatorInApp(
					resp.data.newSubscriberCreatorInApp,
				);
				setCancelSubscriptionCreatorInApp(
					resp.data.cancelSubscriptionCreatorInApp,
				);
				setTipCreatorInApp(resp.data.tipCreatorInApp);
				setPaidPostCreatorInApp(resp.data.paidPostCreatorInApp);
				setChargebackCreatorInApp(resp.data.chargebackCreatorInApp);
				setMessageCreatorInApp(resp.data.messageCreatorInApp);
				setCommentCreatorInApp(resp.data.commentCreatorInApp);
				setLikeCreatorInApp(resp.data.likeCreatorInApp);
				setMessageFanInApp(resp.data.messageFanInApp);
				setTransactionFanInApp(resp.data.transactionFanInApp);
				setChargebackFanInApp(resp.data.chargebackFanInApp);
				setReplyCommentInApp(resp.data.replyCommentInApp);
				setMentionedInApp(resp.data.mentionedInApp);
			}
		};
		fetchSettings();
	}, []);

	const settings = {
		newSubscriberCreatorEmail,
		tipCreatorEmail,
		paidPostCreatorEmail,
		messageCreatorEmail,
		chargebackCreatorEmail,
		messageFanEmail,
		transactionFanEmail,
		chargebackFanEmail,
		newPostFanEmail,
		newSubscriberCreatorInApp,
		cancelSubscriptionCreatorInApp,
		tipCreatorInApp,
		paidPostCreatorInApp,
		chargebackCreatorInApp,
		messageCreatorInApp,
		commentCreatorInApp,
		likeCreatorInApp,
		messageFanInApp,
		transactionFanInApp,
		chargebackFanInApp,
		replyCommentInApp,
		mentionedInApp,
	};

	useEffect(() => {
		const updateSettings = async () => {
			const resp = await updateNotificationSettings(settings);
		};
		updateSettings();
	}, [settings]);

	return (
		<FansScreen3 contentStyle1={{ maxWidth: { lg: 670 } }}>
			<FansView>
				<FansText fontFamily="inter-semibold" fontSize={17}>
					Email Notifications
				</FansText>
				<FansGap height={40} />
				{isCreator ? (
					<FansView>
						<FansSwitch
							text="When you get a new subscriber"
							value={newSubscriberCreatorEmail}
							onValueChange={setNewSubscriberCreatorEmail}
						/>
						<FansGap height={20} />
						<FansHorizontalDivider />
						<FansGap height={20} />
						<FansSwitch
							text="When you receive a tip"
							value={tipCreatorEmail}
							onValueChange={setTipCreatorEmail}
						/>
						<FansGap height={20} />
						<FansHorizontalDivider />
						<FansGap height={20} />
						<FansSwitch
							text="When you receive a paid post"
							value={paidPostCreatorEmail}
							onValueChange={setPaidPostCreatorEmail}
						/>
						<FansGap height={20} />
						<FansHorizontalDivider />
						<FansGap height={20} />
						<FansSwitch
							text="When a member sends you a message"
							value={messageCreatorEmail}
							onValueChange={setMessageCreatorEmail}
						/>
						<FansGap height={20} />
						<FansHorizontalDivider />
						<FansGap height={20} />
						<FansSwitch
							text="When a member makes a chargeback"
							value={chargebackCreatorEmail}
							onValueChange={setChargebackCreatorEmail}
						/>
					</FansView>
				) : (
					<FansView>
						<FansSwitch
							text="When a creator sends a message"
							value={messageFanEmail}
							onValueChange={setMessageFanEmail}
						/>
						<FansGap height={20} />
						<FansHorizontalDivider />
						<FansGap height={20} />
						<FansSwitch
							text="When you make a transaction"
							value={transactionFanEmail}
							onValueChange={setTransactionFanEmail}
						/>
						<FansGap height={20} />
						<FansHorizontalDivider />
						<FansGap height={20} />
						<FansSwitch
							text="When you make a chargeback"
							value={chargebackFanEmail}
							onValueChange={setChargebackFanEmail}
						/>
						<FansGap height={20} />
						<FansHorizontalDivider />
						<FansGap height={20} />
						<FansSwitch
							text="New posts from creators"
							value={newPostFanEmail}
							onValueChange={setNewPostFanEmail}
						/>
					</FansView>
				)}
			</FansView>
			<FansGap height={46} />
			<FansView>
				<FansText fontFamily="inter-semibold" fontSize={17}>
					Notifications
				</FansText>
				<FansGap height={40} />
				{isCreator ? (
					<FansView>
						<FansSwitch
							text="When you get a new subscriber"
							value={newSubscriberCreatorInApp}
							onValueChange={setNewSubscriberCreatorInApp}
						/>
						<FansGap height={20} />
						<FansHorizontalDivider />
						<FansGap height={20} />
						<FansSwitch
							text="When a member cancels their subscription"
							value={cancelSubscriptionCreatorInApp}
							onValueChange={setCancelSubscriptionCreatorInApp}
						/>
						<FansGap height={20} />
						<FansHorizontalDivider />
						<FansGap height={20} />
						<FansSwitch
							text="When you receive a tip"
							value={tipCreatorInApp}
							onValueChange={setTipCreatorInApp}
						/>
						<FansGap height={20} />
						<FansHorizontalDivider />
						<FansGap height={20} />
						<FansSwitch
							text="When you receive a paid post"
							value={paidPostCreatorInApp}
							onValueChange={setPaidPostCreatorInApp}
						/>
						<FansGap height={20} />
						<FansHorizontalDivider />
						<FansGap height={20} />
						<FansSwitch
							text="When a member makes a chargeback"
							value={chargebackCreatorInApp}
							onValueChange={setChargebackCreatorInApp}
						/>
						<FansGap height={20} />
						<FansHorizontalDivider />
						<FansGap height={20} />
						<FansSwitch
							text="When a member sends you a message"
							value={messageCreatorInApp}
							onValueChange={setMessageCreatorInApp}
						/>
						<FansGap height={20} />
						<FansHorizontalDivider />
						<FansGap height={20} />
						<FansSwitch
							text="When a member comments on your post"
							value={commentCreatorInApp}
							onValueChange={setCommentCreatorInApp}
						/>
						<FansGap height={20} />
						<FansHorizontalDivider />
						<FansGap height={20} />
						<FansSwitch
							text="When a member likes your post"
							value={likeCreatorInApp}
							onValueChange={setLikeCreatorInApp}
						/>
					</FansView>
				) : (
					<FansView>
						<FansSwitch
							text="When a creator sends a message"
							value={messageFanInApp}
							onValueChange={setMessageFanInApp}
						/>
						<FansGap height={20} />
						<FansHorizontalDivider />
						<FansGap height={20} />
						<FansSwitch
							text="When you make a transaction"
							value={transactionFanInApp}
							onValueChange={setTransactionFanInApp}
						/>
						<FansGap height={20} />
						<FansHorizontalDivider />
						<FansGap height={20} />
						<FansSwitch
							text="When you make a chargeback"
							value={chargebackFanInApp}
							onValueChange={setChargebackFanInApp}
						/>
					</FansView>
				)}
				<FansGap height={20} />
				<FansHorizontalDivider />
				<FansGap height={20} />
				<FansSwitch
					text="When you get a reply to your comment"
					value={replyCommentInApp}
					onValueChange={setReplyCommentInApp}
				/>
				<FansGap height={20} />
				<FansHorizontalDivider />
				<FansGap height={20} />
				<FansSwitch
					text="When you get mentioned"
					value={mentionedInApp}
					onValueChange={setMentionedInApp}
				/>
			</FansView>
			<FansGap height={20} />
		</FansScreen3>
	);
};

export default NotificationsScreen;
