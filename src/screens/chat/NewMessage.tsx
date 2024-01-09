import UserAvatar from "@components/avatar/UserAvatar";
import { MessageInput } from "@components/chat";
import { FansGap, FansScreen2, FansText } from "@components/controls";
import { getOrCreateConversation } from "@helper/endpoints/chat/apis";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ISelectedFan, selectedFansAtom, updateInbox } from "@state/chat";
import { globalMessageViewManager } from "@state/messagesView";
import { ChatNativeStackParams } from "@usertypes/navigations";
import { IUploadedFile } from "@utils/useUploadFile";
import React, { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";
import { useRecoilValue } from "recoil";

const SelectedFan = (props: { fan: ISelectedFan }) => {
	const { avatar, username, displayName } = props.fan;
	return (
		<View
			style={tw.style(
				"h-[34px]",
				"bg-fans-white",
				"flex-row gap-[5px] items-center",
				"px-[3px]",
				"rounded-full",
			)}
		>
			<UserAvatar size="29px" image={avatar} />
			<FansText>{username}</FansText>
		</View>
	);
};

const NewMessageScreen = (
	props: NativeStackScreenProps<ChatNativeStackParams, "NewMessage">,
) => {
	const { navigation } = props;
	const selectedFans = useRecoilValue(selectedFansAtom);
	const [sending, setSending] = useState(false);
	const handleSend = async (
		message: string,
		uploadedFiles: IUploadedFile[],
	) => {
		setSending(true);
		for (const fan of selectedFans) {
			const resp = await getOrCreateConversation(
				{},
				{
					userId: fan.id,
				},
			);

			if (resp.ok) {
				updateInbox(resp.data);
				const messagesView =
					globalMessageViewManager.getOrCreateMessageView(
						resp.data.id,
					);

				if (uploadedFiles.length > 0) {
					await messagesView?.sendImageMessage(uploadedFiles);
				}
				if (message.length !== 0) {
					await messagesView?.sendTextMessage(message);
				}
			}

			await new Promise((resolve) => setTimeout(resolve, 250));
		}

		Toast.show({
			type: "success",
			text1: `Messages sent to ${selectedFans.length} fans!`,
		});
		navigation.navigate("SendMessage");
	};

	return (
		<FansScreen2>
			{selectedFans.map((fan, index) => (
				<SelectedFan fan={fan} key={fan.id} />
			))}
			<FansGap grow />
			{!sending ? (
				<MessageInput
					isTipAndPhotoVisible={false}
					onSend={handleSend}
				/>
			) : (
				<ActivityIndicator
					color={tw.color("fans-purple")}
					size="large"
				/>
			)}
			<FansGap height={{ lg: 47 }} />
		</FansScreen2>
	);
};

export default NewMessageScreen;
