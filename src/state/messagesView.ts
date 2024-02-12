import { emitEvent, useEvent } from "@helper/EventBus";
import {
	createTextMessage,
	deleteMessage,
	getMessages,
} from "@helper/endpoints/chat/apis";
import { IMessage, MessageType } from "@usertypes/types";
import { IUploadedFile } from "@utils/useUploadFile";
import { useCallback, useEffect, useState } from "react";

export interface IGifMessageContent {
	source: "tenor" | "giphy";
	id: string;
}

export interface ISendOptions {
	message?: string;
	uploadedFiles?: IUploadedFile[];
	gif?: IGifMessageContent;
}

enum MessageViewState {
	Uninitialized,
	Loading,
	Rendered,
	Error,
}

const maxMessagesInView = 150;
const messagesLimit = 50;

interface MessageViewData {
	channelId: string;
	messages: IMessage[];
	atTop: boolean;
	atBottom: boolean;
	state: MessageViewState;
	replyToMessage?: IMessage;
}

export class MessageView implements MessageViewData {
	channelId: string;
	messages: IMessage[];
	atTop: boolean;
	atBottom: boolean;
	state: MessageViewState;
	replyToMessage?: IMessage;

	constructor(channelId: string) {
		this.channelId = channelId;
		this.messages = [];
		this.atTop = true;
		this.atBottom = false;
		this.state = MessageViewState.Uninitialized;
	}

	emitUpdate() {
		emitEvent("messagesView:update", this.channelId, this);
	}

	retry() {
		if (this.state !== MessageViewState.Error) return;
		this.state = MessageViewState.Uninitialized;
		this.initIfNeeded();
	}

	async initIfNeeded() {
		if (this.state !== MessageViewState.Uninitialized) return;

		this.state = MessageViewState.Loading;

		const resp = await getMessages(
			{
				id: this.channelId,
			},
			{
				limit: messagesLimit,
			},
		);
		if (!resp.ok) {
			this.state = MessageViewState.Error;
			return;
		}

		this.messages = resp.data.messages;
		this.atTop = resp.data.messages.length < messagesLimit;
		this.atBottom = true;
		this.state = MessageViewState.Rendered;
		this.emitUpdate();
	}

	acceptMessage(message: IMessage) {
		if (this.channelId !== message.channelId) return;
		if (this.state !== MessageViewState.Rendered) return;
		if (!this.atBottom) return;
		const currentMsgIndex = this.messages.findIndex(
			(m) => m.id === message.id,
		);
		console.log(currentMsgIndex);

		if (currentMsgIndex !== -1) {
			this.messages[currentMsgIndex] = message;
			this.emitUpdate();
			return;
		}

		this.replyToMessage = undefined;
		this.messages.push(message);
		while (this.messages.length > maxMessagesInView) {
			this.messages.shift();
			this.atTop = false;
		}

		this.emitUpdate();
	}

	deleteMessage(messageId: string) {
		const index = this.messages.findIndex((m) => m.id === messageId);
		if (index === -1) return;

		this.messages.splice(index, 1);
		this.emitUpdate();
	}

	setReplyToMessage(message?: IMessage) {
		this.replyToMessage = message;
		this.emitUpdate();
	}

	async sendTextMessage(content: string) {
		const resp = await createTextMessage(
			{
				content,
				messageType: MessageType.TEXT,
				parentId: this.replyToMessage?.id,
			},
			{
				id: this.channelId,
			},
		);

		if (!resp.ok) {
			return;
		}

		this.acceptMessage(resp.data);
	}

	async sendImageMessage(uploadedFiles: IUploadedFile[]) {
		const resp = await createTextMessage(
			{
				content: "",
				uploadIds: uploadedFiles.map((f) => f.id),
				messageType: MessageType.MEDIA,
				parentId: this.replyToMessage?.id,
			},
			{
				id: this.channelId,
			},
		);

		if (!resp.ok) {
			return;
		}

		this.acceptMessage(resp.data);
	}

	async sendGifMessage(gif: IGifMessageContent) {
		const resp = await createTextMessage(
			{
				content: JSON.stringify(gif),
				messageType: MessageType.GIF,
				parentId: this.replyToMessage?.id,
			},
			{
				id: this.channelId,
			},
		);

		if (!resp.ok) {
			return;
		}

		this.acceptMessage(resp.data);
	}

	async sendMessage(options: ISendOptions) {
		const { message, uploadedFiles, gif } = options;

		if (uploadedFiles && uploadedFiles.length > 0) {
			await this.sendImageMessage(uploadedFiles);
		}

		if (message && message.length > 0) {
			await this.sendTextMessage(message);
		}

		if (gif) {
			await this.sendGifMessage(gif);
		}
	}

	async deleteMessageById(messageId: string) {
		const resp = await deleteMessage(
			{ id: this.channelId },
			{ messageId: messageId },
		);

		if (!resp.ok) {
			return;
		}

		this.deleteMessage(messageId);
	}

	async scrolledToTop() {
		if (this.state !== MessageViewState.Rendered) return;
		if (this.atTop) return;

		this.state = MessageViewState.Loading;

		const firstMessage = this.messages[0];
		const resp = await getMessages(
			{
				id: this.channelId,
			},
			firstMessage
				? {
						before: firstMessage.id,
				  }
				: {},
		);

		if (!resp.ok) {
			this.state = MessageViewState.Error;
			return;
		}

		if (resp.data.messages.length === 0) {
			this.atTop = true;
			this.state = MessageViewState.Rendered;
			this.emitUpdate();
			return;
		}

		if (!firstMessage) {
			this.messages = resp.data.messages;
		} else {
			this.messages = [...resp.data.messages, ...this.messages];
		}

		if (resp.data.messages.length < messagesLimit) {
			this.atTop = true;
		}

		if (this.messages.length > maxMessagesInView) {
			this.messages = this.messages.slice(0, maxMessagesInView);
			this.atBottom = false;
		}

		console.log(
			`scrolledToTop: ${this.messages.length} atTop: ${this.atTop} atBottom: ${this.atBottom}`,
		);

		this.state = MessageViewState.Rendered;
		this.emitUpdate();
	}

	async scrolledToBottom() {
		if (this.state !== MessageViewState.Rendered) return;
		if (this.atBottom) return;

		this.state = MessageViewState.Loading;

		const lastMessage = this.messages[this.messages.length - 1];
		const resp = await getMessages(
			{
				id: this.channelId,
			},
			lastMessage
				? {
						after: lastMessage.id,
				  }
				: {},
		);

		if (!resp.ok) {
			this.state = MessageViewState.Error;
			return;
		}

		if (resp.data.messages.length === 0) {
			this.atBottom = true;
			this.state = MessageViewState.Rendered;
			this.emitUpdate();
			return;
		}

		if (!lastMessage) {
			this.messages = resp.data.messages;
		} else {
			this.messages = [...this.messages, ...resp.data.messages];
		}

		if (resp.data.messages.length < messagesLimit) {
			this.atBottom = true;
		}

		if (this.messages.length > maxMessagesInView) {
			this.messages.splice(0, this.messages.length - maxMessagesInView);
			this.atTop = false;
		}
		console.log(
			`scrolledToBottom: ${this.messages.length} atTop: ${this.atTop} atBottom: ${this.atBottom}`,
		);

		this.state = MessageViewState.Rendered;
		this.emitUpdate();
	}

	getData(): MessageViewData {
		return {
			channelId: this.channelId,
			messages: this.messages,
			atTop: this.atTop,
			atBottom: this.atBottom,
			state: this.state,
		};
	}
}

export class MessageViewManager {
	viewMap: Map<string, MessageView>;

	constructor() {
		this.viewMap = new Map();
	}

	getOrCreateMessageView(channelId: string) {
		let view = this.viewMap.get(channelId);
		if (!view) {
			view = new MessageView(channelId);
			this.viewMap.set(channelId, view);
		}
		return view;
	}

	getMessageView(channelId: string) {
		return this.viewMap.get(channelId);
	}
}

export const globalMessageViewManager = new MessageViewManager();

export function useMessageView(channelId: string) {
	const messageView =
		globalMessageViewManager.getOrCreateMessageView(channelId);
	const [state, setState] = useState(messageView.getData());

	const setMessageViewCallback = useCallback(
		(mv: MessageView) => setState(mv.getData()),
		[],
	);

	useEffect(() => {
		setState(messageView.getData());
	}, [messageView]);

	useEvent("messagesView:update", channelId, setMessageViewCallback, [
		channelId,
	]);

	return messageView;
}
