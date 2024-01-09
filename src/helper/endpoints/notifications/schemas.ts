import { INotification } from "@helper/CommonAPISchemas";

export interface NotificationsListRespBody {
	notifications: INotification[];
}

export interface NotificationsMarkReadParams {
	id: string;
}

export interface NotificationSettingsReqBody {
	newSubscriberCreatorEmail: boolean;
	tipCreatorEmail: boolean;
	paidPostCreatorEmail: boolean;
	messageCreatorEmail: boolean;
	chargebackCreatorEmail: boolean;
	messageFanEmail: boolean;
	transactionFanEmail: boolean;
	chargebackFanEmail: boolean;
	newPostFanEmail: boolean;
	newSubscriberCreatorInApp: boolean;
	cancelSubscriptionCreatorInApp: boolean;
	tipCreatorInApp: boolean;
	paidPostCreatorInApp: boolean;
	chargebackCreatorInApp: boolean;
	messageCreatorInApp: boolean;
	commentCreatorInApp: boolean;
	likeCreatorInApp: boolean;
	messageFanInApp: boolean;
	transactionFanInApp: boolean;
	chargebackFanInApp: boolean;
	replyCommentInApp: boolean;
	mentionedInApp: boolean;
}

export interface NotificationSettingsRespBody {
	newSubscriberCreatorEmail: boolean;
	tipCreatorEmail: boolean;
	paidPostCreatorEmail: boolean;
	messageCreatorEmail: boolean;
	chargebackCreatorEmail: boolean;
	messageFanEmail: boolean;
	transactionFanEmail: boolean;
	chargebackFanEmail: boolean;
	newPostFanEmail: boolean;
	newSubscriberCreatorInApp: boolean;
	cancelSubscriptionCreatorInApp: boolean;
	tipCreatorInApp: boolean;
	paidPostCreatorInApp: boolean;
	chargebackCreatorInApp: boolean;
	messageCreatorInApp: boolean;
	commentCreatorInApp: boolean;
	likeCreatorInApp: boolean;
	messageFanInApp: boolean;
	transactionFanInApp: boolean;
	chargebackFanInApp: boolean;
	replyCommentInApp: boolean;
	mentionedInApp: boolean;
}
