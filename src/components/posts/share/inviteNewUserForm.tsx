import RoundButton from "@components/common/RoundButton";
import RoundTextInput from "@components/common/RoundTextInput";
import { FypText } from "@components/common/base";
import { EmailChip } from "@components/posts/common";
import { sendInvitation } from "@helper/endpoints/post/apis";
import tw from "@lib/tailwind";
import { RoundButtonType } from "@usertypes/commonEnums";
import React, { useState, FC } from "react";
import { View, Pressable } from "react-native";
import Toast from "react-native-toast-message";

interface Props {
	inProgress: boolean;
	handleToggleLoading: (val: boolean) => void;
}

const InviteNewUserForm: FC<Props> = (props) => {
	const { handleToggleLoading, inProgress } = props;
	const [message, setMessage] = useState("");
	const [email, setEmail] = useState("");
	const [imported, setImported] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const onDeleteEmail = () => {
		// setEmail('');
		setImported(false);
	};

	const onClickImport = () => {
		setImported(true);
	};

	const handleSubmit = async () => {
		setIsSubmitted(true);
		if (email === "" || message === "") {
			return;
		}
		handleToggleLoading(true);
		const postbody = {
			emails: [email],
			message: message,
		};
		const resp = await sendInvitation(postbody);
		handleToggleLoading(false);
		if (resp.ok) {
			Toast.show({
				type: "success",
				text1: "Successfuly sent message!",
			});
			setEmail("");
			setMessage("");
			setIsSubmitted(false);
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message || "Failed to invite user",
			});
		}
	};

	return (
		<View>
			<View style={tw.style("mb-[34px]")}>
				<View
					style={tw.style(
						"mb-[15px] flex-row items-center justify-between",
					)}
				>
					<FypText
						fontWeight={600}
						fontSize={17}
						lineHeight={22}
						style={tw.style("text-fans-black dark:text-fans-white")}
					>
						Add email
					</FypText>
					{/* <Pressable
							style={tw.style("flex-row items-center")}
							onPress={onClickImport}
						>
							<ContactSvg
								width={14.33}
								height={14.82}
								color="#a854f5"
							/>
							<CustomText
								size="lg"
								style="text-fans-purple ml-[6px]"
							>
								Import contacts
							</CustomText>
						</Pressable> */}
				</View>

				{imported ? (
					<View
						style={tw.style(
							"px-1 py-1 flex-row h-[42px] rounded-[42px] bg-fans-grey",
						)}
					>
						<EmailChip email={email} onCancel={onDeleteEmail} />
					</View>
				) : (
					<RoundTextInput
						placeholder="e.g.user@gmail.com"
						value={email}
						onChangeText={(val) => setEmail(val)}
						hasError={isSubmitted && email === ""}
						maxLength={50}
					/>
				)}
			</View>

			<View style={tw.style("mb-6")}>
				<FypText
					fontSize={17}
					lineHeight={22}
					fontWeight={600}
					margin={{ b: 15 }}
					style={tw.style("text-fans-black dark:text-fans-white")}
				>
					Message
				</FypText>
				<RoundTextInput
					value={message}
					onChangeText={(val) => setMessage(val)}
					placeholder="Write a message..."
					multiline
					numberOfLines={4}
					maxLength={1000}
					customStyles="py-3 px-5 rounded-[7px] h-[128px]"
					hasError={isSubmitted && message === ""}
				/>
			</View>

			<RoundButton
				variant={RoundButtonType.OUTLINE_PRIMARY}
				onPress={handleSubmit}
				loading={inProgress}
			>
				Send invitation
			</RoundButton>
		</View>
	);
};

export default InviteNewUserForm;
