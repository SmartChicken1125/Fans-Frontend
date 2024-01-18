import {
	createDELETEWithParams,
	createGET,
	createGETWithParams,
	createPOST,
	createPOSTWithParams,
} from "@helper/RequesterBase";
import { IMessage } from "@usertypes/types";
import {
	ChatConversationByUserRespBody,
	ChatConversationMessagesPostReqBody,
	ChatConversationMessagesRespBody,
	ChatFansListRespBody,
	ChatIdParams,
	ChatUserIdParams,
	ChatWSInfoRespBody,
	ChatNoteReqBody,
	ChatNoteRespBody,
	ChatAutomatedMessageWelcomeReqBody,
	ChatAutomatedMessageWelcomeRespBody,
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
