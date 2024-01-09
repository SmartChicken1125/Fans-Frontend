import { StarCheckSvg } from "@assets/svgs/common";
import UserAvatar from "@components/avatar/UserAvatar";
import RoundButton from "@components/common/RoundButton";
import {
	FansGap,
	FansScreen2,
	FansScreen3,
	FansSvg,
	FansText,
	FansView,
} from "@components/controls";
import { useAppContext } from "@context/useAppContext";
import { createNote, getNotes } from "@helper/endpoints/chat/apis";
import tw from "@lib/tailwind";
import { setCreatorNote } from "@state/chat";
import { RoundButtonType } from "@usertypes/commonEnums";
import { ChatNativeStackScreenProps } from "@usertypes/navigations";
import React, { useEffect, useState } from "react";
import { TextInput, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";

const ShareNoteScreen = (props: ChatNativeStackScreenProps<"ShareNote">) => {
	const { navigation } = props;

	const { state } = useAppContext();
	const { userInfo } = state.user;
	const { avatar, username } = userInfo;

	const [strNote, setNote] = useState("");

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<FansView style={tw.style("mr-[20px]")}>
					<TouchableOpacity>
						<FansText
							color="purple"
							fontFamily="inter-bold"
							fontSize={17}
						>
							Share
						</FansText>
					</TouchableOpacity>
				</FansView>
			),
		});
	});

	const fetchNotes = async () => {
		const res = await getNotes();
		if (res.ok) {
			const notes = res.data.notes.map((note) => ({
				isBorder: false,
				name: note.profile.displayName,
				text: note.note,
			}));
			setCreatorNote(
				notes.find(
					(note) => note.name === userInfo.profile?.displayName,
				),
			);
		} else {
			Toast.show({
				type: "error",
				text1: "Error",
				text2: "Cannot fetch notes",
			});
		}
	};

	const handleShare = async () => {
		const res = await createNote({
			note: strNote,
		});
		if (res.ok) {
			Toast.show({
				type: "success",
				text1: "Success",
				text2: "Note created successfully",
			});
			await fetchNotes();
			navigation.goBack();
		} else {
			Toast.show({
				type: "error",
				text1: "Error",
				text2: "Something went wrong",
			});
		}
	};

	return (
		<FansScreen3>
			<FansGap height={129.4} />
			<FansView alignItems="center">
				<FansView gap={8}>
					<UserAvatar image={avatar} size="95px" />
					<FansView alignItems="center" flexDirection="row" gap={6}>
						<FansText
							style={tw.style("font-inter-bold", "text-[19px]")}
						>
							{username}
						</FansText>
						<FansSvg width={15.66} height={15} svg={StarCheckSvg} />
					</FansView>
				</FansView>
				<FansGap height={35} />
				<FansView
					width={248}
					height={98}
					style={tw.style(
						"flex items-center",
						"p-[15px]",
						"rounded-[15px]",
						"shadow-black/16 shadow-offset-[3px]/[3px] shadow-radius-[6px]",
					)}
				>
					<TextInput
						value={strNote}
						style={tw.style(
							"w-full h-full",
							"font-inter-regular",
							"text-[18px]",
						)}
						maxLength={60}
						multiline
						placeholder="Write a note..."
						placeholderTextColor={tw.color("fans-grey-dark")}
						onChangeText={setNote}
					/>
				</FansView>
				<FansGap height={9.3} />
				<FansText style={tw.style("text-[14px] text-fans-grey-dark")}>
					{strNote.length}/60
				</FansText>
			</FansView>
			<FansGap grow />
			<RoundButton
				variant={RoundButtonType.OUTLINE_PRIMARY}
				onPress={handleShare}
			>
				Share
			</RoundButton>
		</FansScreen3>
	);
};

export default ShareNoteScreen;
