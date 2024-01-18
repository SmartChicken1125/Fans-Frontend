import RoundButton from "@components/common/RoundButton";
import { FypText } from "@components/common/base";
import BottomSheetWrapper from "@components/common/bottomSheetWrapper";
import { cdnURL } from "@helper/Utils";
import {
	createTextMessage,
	getOrCreateConversation,
} from "@helper/endpoints/chat/apis";
import tw from "@lib/tailwind";
import { RoundButtonType } from "@usertypes/commonEnums";
import { IProfile, MessageType } from "@usertypes/types";
import { useRouter } from "expo-router";
import React, { FC, useState } from "react";
import { Image, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";
const defaultAvatar = require("@assets/images/default-avatar.png");

interface Props {
	open: boolean;
	onClose: () => void;
	reciever?: IProfile;
}

const SendMessageDialog: FC<Props> = (props) => {
	const { open, onClose, reciever } = props;
	const router = useRouter();
	const [message, setMessage] = useState("");
	const [inProgress, setInProgress] = useState(false);

	const handleSubmit = async () => {
		if (reciever?.userId && !inProgress) {
			setInProgress(true);
			const resp = await getOrCreateConversation(
				{},
				{
					userId: reciever.userId,
				},
			);
			if (resp.ok) {
				const channelId = resp.data.id;
				const messageRes = await createTextMessage(
					{
						content: message,
						messageType: MessageType.TEXT,
					},
					{
						id: channelId,
					},
				);
				setInProgress(false);
				if (messageRes.ok) {
					setMessage("");
					Toast.show({
						type: "success",
						text1: "Sent message!",
					});
					onClose();
					router.push(`/chat?id=${channelId}`);
				} else {
					Toast.show({
						type: "error",
						text1: "Failed to send message",
					});
				}
			} else {
				setInProgress(false);
				Toast.show({
					type: "error",
					text1: resp.data.message,
				});
			}
			onClose();
		}
	};

	return (
		<BottomSheetWrapper open={open} onClose={onClose}>
			<View style={tw.style("px-[18px] pb-5")}>
				<FypText
					fontSize={19}
					lineHeight={26}
					fontWeight={700}
					margin={{ b: 24 }}
					textAlign="center"
					numberOfLines={1}
				>
					{`Message ${reciever?.displayName}`}
				</FypText>
				<Image
					source={
						reciever?.avatar
							? { uri: cdnURL(reciever?.avatar) }
							: defaultAvatar
					}
					alt="User"
					style={tw.style(
						"w-[79px] h-[79px] rounded-[7px] mx-auto mb-6",
					)}
					resizeMode="cover"
				/>

				<View>
					<TextInput
						editable
						multiline
						numberOfLines={4}
						maxLength={40}
						onChangeText={(text: string) => setMessage(text)}
						style={tw.style(
							"bg-fans-grey dark:bg-fans-grey-43 py-3 px-5 rounded-[7px] h-[128px]",
							"text-fans-black dark:text-fans-white",
						)}
					/>
				</View>

				<RoundButton
					variant={RoundButtonType.OUTLINE_PRIMARY}
					customStyles={"mt-5"}
					onPress={handleSubmit}
					loading={inProgress}
				>
					Send message
				</RoundButton>
			</View>
		</BottomSheetWrapper>
	);
};

export default SendMessageDialog;
