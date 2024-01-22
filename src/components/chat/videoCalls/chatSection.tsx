import ChatItem from "@components/chat/ChatItem";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { chatInboxAtom } from "@state/chat";
import { useMessageView } from "@state/messagesView";
import { IMessage, IProfile } from "@usertypes/types";
import { IUploadedFile } from "@utils/useUploadFile";
import { useLocalSearchParams } from "expo-router";
import React, { FC, useState, useRef } from "react";
import { Animated as ReAnimated, VirtualizedList } from "react-native";
import { useRecoilValue } from "recoil";
import ChatInput from "./chatInput";

interface Props {
	profile: IProfile;
}

const ChatSection: FC<Props> = (props) => {
	const { profile } = props;
	const { id } = useLocalSearchParams();
	const chatId = (id as string) ?? "0";

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

	const handleSend = async (
		message: string,
		uploadedFiles: IUploadedFile[],
	) => {
		if (uploadedFiles.length > 0) {
			await messagesView?.sendImageMessage(uploadedFiles);
		}
		if (message.length !== 0) {
			await messagesView?.sendTextMessage(message);
		}

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
							onPressImage={handlePressImage}
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
				<ChatInput
					onSend={handleSend}
					creator={conversation.otherParticipant}
				/>
			) : null}
		</FansView>
	);
};

export default ChatSection;
