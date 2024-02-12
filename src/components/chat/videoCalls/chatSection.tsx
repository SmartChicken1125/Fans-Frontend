import ChatItem from "@components/chat/ChatItem";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { chatInboxAtom } from "@state/chat";
import { ISendOptions, useMessageView } from "@state/messagesView";
import { IMessage, IProfile } from "@usertypes/types";
import React, { FC, useRef, useState } from "react";
import { Animated as ReAnimated, VirtualizedList } from "react-native";
import { useRecoilValue } from "recoil";
import MessageInput from "../MessageInput";

interface Props {
	chatId: string;
	profile: IProfile;
}

const ChatSection: FC<Props> = (props) => {
	const { profile, chatId } = props;

	const listMessages = useRef<VirtualizedList<IMessage> | null>(null);
	const [imageViewModalData, setImageViewModalData] = useState<
		{ data: IMessage; index: number } | undefined
	>();
	const messagesView = useMessageView(chatId);
	const animatedValue = useRef(new ReAnimated.Value(0)).current;
	const inbox = useRecoilValue(chatInboxAtom);
	const conversation = inbox.data.get(chatId);

	const handlePressImage = (data: IMessage, index: number) => {
		console.log("handlePressImage", data, index);
		setImageViewModalData({ data, index });
	};

	const handleSend = async (options: ISendOptions) => {
		await messagesView?.sendMessage(options);

		animatedValue.setValue(37);
		ReAnimated.timing(animatedValue, {
			toValue: 0,
			duration: 400,
			useNativeDriver: true,
		}).start();
	};

	const handleStartReached = () => {
		messagesView?.scrolledToBottom();
	};

	const handleEndReached = () => {
		messagesView?.scrolledToTop();
	};

	const handleDeleteMessage = (message: IMessage) => {
		messagesView?.deleteMessageById(message.id);
	};

	const handleReplyMessage = (message: IMessage) => {
		messagesView?.setReplyToMessage(message);
	};

	const handleReportMessage = (message: IMessage) => {};

	return (
		<FansView flex="1">
			<FansView height={0} grow>
				<VirtualizedList
					ref={listMessages}
					keyExtractor={(item) => item.id}
					renderItem={({ item }: { item: IMessage }) => (
						<ChatItem
							isSelf={item.user.id === profile.userId}
							message={item}
							animatedValue={animatedValue}
							handleActivatedDoubleTapMessage={() => {}}
							handleActivatedTapMessage={() => {}}
							onPressMedia={handlePressImage}
							onDeleteMessage={handleDeleteMessage}
							onReplyMessage={handleReplyMessage}
							onReportMessage={handleReportMessage}
						/>
					)}
					style={tw.style("pt-5")}
					data={[...(messagesView?.messages ?? [])].reverse()}
					getItem={(data, index) => data[index]}
					getItemCount={(data) => data.length}
					inverted
					showsVerticalScrollIndicator={false}
					onStartReached={handleStartReached}
					onStartReachedThreshold={0.1}
					onEndReached={handleEndReached}
					onEndReachedThreshold={0.1}
				/>
			</FansView>
			{conversation ? (
				<MessageInput
					onSend={handleSend}
					creator={conversation.otherParticipant}
				/>
			) : null}
		</FansView>
	);
};

export default ChatSection;
