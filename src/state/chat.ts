import { IConversationMeta } from "@usertypes/types";
import { atom, selector } from "recoil";
import { getRecoil, setRecoil } from "recoil-nexus";

interface IChatInboxState {
	data: Map<string, IConversationMeta>;
	sorted: IConversationMeta[];
}

export const chatInboxAtom = atom<IChatInboxState>({
	key: "chatInbox",
	default: {
		data: new Map(),
		sorted: [],
	},
});

export const chatUnreadCountSelector = selector({
	key: "chatUnreadCount",
	get: ({ get }) => {
		const inbox = get(chatInboxAtom);
		return inbox.sorted.reduce((acc, curr) => {
			const unread = curr.lastMessage
				? curr.lastMessage?.id !== curr.lastReadMessageId
				: false;
			if (!unread) return acc;
			return acc + 1;
		}, 0);
	},
});

export function updateInboxSetter(
	current: IChatInboxState,
	newMeta: IConversationMeta,
): IChatInboxState {
	const data = new Map(current.data);
	data.set(newMeta.id, newMeta);

	const sorted = [...data.values()];

	sorted.sort((b, a) =>
		(a.lastMessage?.id ?? a.id).localeCompare(b.lastMessage?.id ?? b.id),
	);

	return { data, sorted };
}

export function updateInbox(newMeta: IConversationMeta) {
	const current = getRecoil(chatInboxAtom);
	const updated = updateInboxSetter(current, newMeta);
	setRecoil(chatInboxAtom, updated);
}

export function getConversationMeta(id: string) {
	const inbox = getRecoil(chatInboxAtom);
	return inbox.data.get(id);
}

export function setInbox(conversations: IConversationMeta[]) {
	const data = new Map<string, IConversationMeta>();
	for (const conversation of conversations) {
		data.set(conversation.id, conversation);
	}

	const sorted = [...data.values()];

	sorted.sort((b, a) =>
		(a.lastMessage?.id ?? a.id).localeCompare(b.lastMessage?.id ?? b.id),
	);

	setRecoil(chatInboxAtom, { data, sorted });
}

export interface ISelectedFan {
	id: string;
	displayName?: string;
	username?: string;
	avatar?: string;
}

export const selectedFansAtom = atom<ISelectedFan[]>({
	key: "selectedFans",
	default: [],
});

export interface INote {
	isBorder: boolean;
	name: string;
	text: string;
}

export const notesAtom = atom<INote[]>({
	key: "notesState",
	default: [],
});

export const setNotes = (notes: INote[]) => {
	setRecoil(notesAtom, notes);
};

export const creatorNoteAtom = atom<INote>({
	key: "creatorNote",
	default: {
		isBorder: false,
		name: "",
		text: "",
	},
});

export const setCreatorNote = (note: INote | undefined) => {
	if (!note) return;
	setRecoil(creatorNoteAtom, note);
};
