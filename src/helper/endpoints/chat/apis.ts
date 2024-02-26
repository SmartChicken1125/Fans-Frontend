import {
	createDELETEWithParams,
	createGET,
	createGETWithParams,
	createPOST,
	createPOSTWithParams,
} from "@helper/RequesterBase";
import { IMessage } from "@usertypes/types";
import {
	ChatAutomatedMessageWelcomeReqBody,
	ChatAutomatedMessageWelcomeRespBody,
	ChatConversationByUserRespBody,
	ChatConversationMessagesPostReqBody,
	ChatConversationMessagesRespBody,
	ChatDeleteMessageIdParams,
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
	ChatIdParams,
	ChatDeleteMessageIdParams
>("/chat/conversations/:id/messages/:messageId", true);

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
