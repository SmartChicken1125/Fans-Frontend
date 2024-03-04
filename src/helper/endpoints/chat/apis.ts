import {
	createDELETEWithParams,
	createGET,
	createGETWithParams,
	createPOST,
	createPOSTWithParams,
	createPUT,
} from "@helper/RequesterBase";
import { IMessage } from "@usertypes/types";
import {
	ChatAutomatedMessageWelcomeReqBody,
	ChatAutomatedMessageWelcomeRespBody,
	ChatConversationByUserRespBody,
	ChatConversationMessagesPostReqBody,
	ChatConversationMessagesRespBody,
	ChatDeleteMessageId,
	ChatFansListRespBody,
	ChatIdParams,
	ChatNoteReqBody,
	ChatNoteRespBody,
	ChatPaidPostPriceResBody,
	ChatUserIdParams,
	ChatWSInfoRespBody,
	CreateMessageReportReqBody,
	MediasRespBody,
	PurchaseChatPaidPostReqBody,
	UpdateChatAutomatedMessageWelcomeReqBody,
	TopFanNotificationReqBody,
	UpdateTopFanNotificationReqBody,
} from "./schemas";

export const getWSInfo = createGET<ChatWSInfoRespBody>("/chat/ws-info", false);

export const getOrCreateConversation = createPOSTWithParams<
	unknown,
	ChatConversationByUserRespBody,
	ChatUserIdParams
>("/chat/conversations/users/:userId", true);

export const getFansList = createGETWithParams<ChatFansListRespBody>(
	"/chat/fans-list/:category/:limit",
	true,
);

export const getMessages = createGETWithParams<
	ChatConversationMessagesRespBody,
	ChatIdParams
>("/chat/conversations/:id/messages", true);

export const createTextMessage = createPOSTWithParams<
	ChatConversationMessagesPostReqBody,
	IMessage,
	ChatIdParams
>("/chat/conversations/:id/messages", true);

export const deleteMessage = createDELETEWithParams<
	ChatDeleteMessageId,
	unknown,
	ChatIdParams
>("/chat/conversations/:id/messages", true);

export const getNotes = createGET<ChatNoteRespBody>("/chat/notes", true);

export const createNote = createPOST<ChatNoteReqBody>("/chat/notes", true);

export const getWelcomeAutomatedMessage =
	createGET<ChatAutomatedMessageWelcomeRespBody>(
		"/chat/automated-messages/welcome",
		true,
	);

export const createWelcomeAutomatedMessage =
	createPOST<ChatAutomatedMessageWelcomeReqBody>(
		"/chat/automated-messages/welcome",
		true,
	);

export const updateWelcomeAutomatedMessageSettings =
	createPUT<UpdateChatAutomatedMessageWelcomeReqBody>(
		"/chat/automated-messages/welcome/settings",
		true,
	);

export const getTopFanNotification = createGET<TopFanNotificationReqBody>(
	"/chat/automated-messages/topfan",
	true,
);

export const createTopFanNotification = createPOST<TopFanNotificationReqBody>(
	"/chat/automated-messages/topfan",
	true,
);

export const updateTopFanNotification =
	createPUT<UpdateTopFanNotificationReqBody>(
		"/chat/automated-messages/topfan/settings",
		true,
	);

export const pinInbox = createPOSTWithParams<ChatIdParams>(
	"/chat/conversations/:id/pin",
	true,
);

export const deleteInbox = createDELETEWithParams<ChatIdParams>(
	"/chat/conversations/:id/delete",
	true,
);

export const createMessageReport = createPOST<CreateMessageReportReqBody>(
	"/chat/message/report",
	true,
);

export const getChannelMedias = createGETWithParams<
	MediasRespBody,
	ChatIdParams
>("/chat/conversation/:id/medias", true);

export const getChatPaidPostPrice = createGET<ChatPaidPostPriceResBody>(
	"/chat/paid-post/price",
	true,
);

export const purchaseChatPaidPost = createPOST<PurchaseChatPaidPostReqBody>(
	"/chat/paid-post/purchase",
	true,
);
