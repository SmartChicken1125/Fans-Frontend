import { CallSvg, DiscordSvg, EmailSvg } from "@assets/svgs/common";
import RoundButton from "@components/common/RoundButton";
import RoundTextInput from "@components/common/RoundTextInput";
import {
	FansGap,
	FansHorizontalDivider,
	FansScreen3,
	FansSvg,
	FansText,
	FansView,
	FansWhiteButton,
} from "@components/controls";
import { CONTACT_EMAIL, CONTACT_PHONE, DISCORD_LINK } from "@constants/contact";
import { SEND_MESSAGE_SUCCESS_MODAL_ID } from "@constants/modal";
import { ModalActionType, useAppContext } from "@context/useAppContext";
import { sendMessageToContact } from "@helper/endpoints/contact/apis";
import tw from "@lib/tailwind";
import { SupportNativeStackScreenProps } from "@usertypes/navigations";
import { ColorStyle1 } from "@usertypes/styles";
import { useRouter } from "expo-router";
import React, { Fragment, useCallback, useState } from "react";
import { Linking, Text, View } from "react-native";

const handlePressCallUs = () => Linking.openURL(`tel:${CONTACT_PHONE}`);

const handlePressEmail = () => Linking.openURL(`mailto:${CONTACT_EMAIL}`);

const handlePressJoin = () => Linking.openURL(`${DISCORD_LINK}`);

const icons = [
	{
		// TODO: put this outside icon: () => (
		icon: (
			<FansSvg
				width={23.57}
				height={18.11}
				svg={EmailSvg}
				color={tw.color(ColorStyle1.White)}
			/>
		),
		iconBackground: ColorStyle1.Purple,
		text1: "Email address",
		text2: CONTACT_EMAIL,
		button: "Email",
		onPress: handlePressEmail,
	},
	{
		icon: (
			<FansSvg
				width={26.73}
				height={20.21}
				svg={DiscordSvg}
				color={tw.color(ColorStyle1.White)}
			/>
		),
		iconBackground: ColorStyle1.Blue,
		text1: "Discord",
		text2: DISCORD_LINK,
		button: "Join",
		onPress: handlePressJoin,
	},
	{
		icon: (
			<FansSvg
				width={21.42}
				height={23}
				svg={CallSvg}
				color={tw.color(ColorStyle1.White)}
			/>
		),
		iconBackground: "fans-purple-D8",
		text1: "Phone",
		text2: CONTACT_PHONE,
		button: "Call us",
		onPress: handlePressCallUs,
	},
];

const ContactUsScreen = ({
	navigation,
	route,
}: SupportNativeStackScreenProps<"ContactUs">) => {
	const { state, dispatch } = useAppContext();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [subject, setSubject] = useState("");
	const [question, setQuestion] = useState("");

	const handlePressFillOutForm = () =>
		navigation.navigate("LawEnforcementGuide");

	const initializeForm = () => {
		setName("");
		setEmail("");
		setSubject("");
		setQuestion("");
	};

	const handleSendMessage = useCallback(async () => {
		if (name && email && subject && question) {
			const resp = await sendMessageToContact({
				name,
				email,
				subject,
				question,
			});

			if (resp.ok) {
				initializeForm();
				dispatch.setModal({
					type: ModalActionType.showModal,
					data: { id: SEND_MESSAGE_SUCCESS_MODAL_ID, show: true },
				});
			}
		}
	}, [name, email, subject, question]);

	const NeedLegalAssistance = () => (
		<Fragment>
			<FansText fontFamily="inter-semibold" fontSize={17}>
				Need legal assistance?
			</FansText>
			<FansGap height={21} />
			<FansWhiteButton
				title="Fill out form"
				style={tw.style("h-fans-button")}
				textStyle={tw.style("text-[19px]")}
				onPress={handlePressFillOutForm}
			/>
		</Fragment>
	);

	return (
		<FansScreen3>
			<Text
				style={tw`font-inter-bold text-[23px] text-center md:text-left`}
			>
				How can we help you?
			</Text>
			<View style={tw`h-[23px] md:h-[59px]`} />
			<View style={tw`md:flex-row`}>
				<View style={tw`md:mt-auto md:min-w-[350px] lg:min-w-[400px]`}>
					<View style={tw`flex gap-[9px]`}>
						{icons.map((item, index) => {
							const {
								icon,
								iconBackground,
								text1,
								text2,
								button,
								onPress,
							} = item;

							return (
								<FansView
									key={index}
									height={86}
									style={tw.style(
										"border border-fans-grey",
										"flex-row",
										"pl-[16.4px] pr-[19.4px]",
									)}
									borderRadius={15}
									center
								>
									<FansView
										width={46}
										height={46}
										background={iconBackground}
										borderRadius="full"
										center
									>
										{icon}
									</FansView>
									<FansGap width={13.1} />
									<FansView grow>
										<FansText
											fontFamily="inter-semibold"
											fontSize={19}
										>
											{text1}
										</FansText>
										<FansText color="grey-70" fontSize={16}>
											{text2}
										</FansText>
									</FansView>
									<FansWhiteButton
										title={button}
										onPress={onPress}
										style={tw.style("w-[93.5px] px-0")}
									/>
								</FansView>
							);
						})}
					</View>
					<FansView style={tw.style("hidden sm:flex")}>
						<FansView style={tw.style("h-[43px]")} />
						<NeedLegalAssistance />
					</FansView>
				</View>
				<FansGap
					width={{ xs: 0, sm: 129 }}
					height={{ xs: 32, sm: 0 }}
				/>
				<FansView style={tw.style("sm:grow md:mt-auto")}>
					<FansText fontFamily="inter-semibold" fontSize={17}>
						Send us a message
					</FansText>
					<FansGap height={{ xs: 15, sm: 23.5 }} />
					<RoundTextInput
						placeholder="Name"
						value={name}
						autoComplete="name"
						onChangeText={setName}
					/>
					<FansGap height={{ xs: 16, sm: 17 }} />
					<RoundTextInput
						placeholder="Email address"
						value={email}
						autoComplete="email"
						onChangeText={setEmail}
					/>
					<FansGap height={16} />
					<RoundTextInput
						placeholder="Subject"
						value={subject}
						onChangeText={setSubject}
					/>
					<FansGap height={{ xs: 16, sm: 15.5 }} />
					<RoundTextInput
						value={question}
						onChangeText={setQuestion}
						placeholder="Explain your questions..."
						multiline
						numberOfLines={5}
						customStyles="py-3 px-5 rounded-[7px] h-[128px]"
					/>
					<FansGap height={16} />
					<RoundButton onPress={handleSendMessage}>
						Send message
					</RoundButton>
				</FansView>
				<FansView style={tw.style("sm:hidden")}>
					<FansGap height={38.3} />
					<FansHorizontalDivider />
					<FansGap height={32.7} />
					<NeedLegalAssistance />
				</FansView>
			</View>
		</FansScreen3>
	);
};

export default ContactUsScreen;
