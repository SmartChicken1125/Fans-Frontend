import { OutlinedInfoSvg } from "@assets/svgs/common";
import RoundTextInput from "@components/common/RoundTextInput";
import { FypText, FypSvg } from "@components/common/base";
import { FansGap, FansSwitch, FansText, FansView } from "@components/controls";
import { PreferenceItem, SexualPolicyModal } from "@components/videoCall";
import { updateCustomVideoSettings } from "@helper/endpoints/cameo/apis";
import tw from "@lib/tailwind";
import { ICustomVideoSettings } from "@usertypes/types";
import React, { FC, useState, useEffect } from "react";
import { Image } from "react-native";
import Toast from "react-native-toast-message";

interface Props {
	videoSettings: ICustomVideoSettings;
	handleUpdateSettings: (videoSettings: ICustomVideoSettings) => void;
}

const ContentPreferenceForm: FC<Props> = (props) => {
	const { videoSettings, handleUpdateSettings } = props;

	const [openSexualPolicyModal, setOpenSexualPolicyModal] = useState(false);
	const [localCustomContentType, setLocalCustomContentType] =
		useState<string>("");

	const handleUpdate = async (
		name: string,
		value: string[] | boolean | string,
	) => {
		const resp = await updateCustomVideoSettings({ [name]: value });
		if (resp.ok) {
			handleUpdateSettings({
				...videoSettings,
				[name]: value,
			});
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const handleCustomContentTypeBlur = async () => {
		if (localCustomContentType !== videoSettings.customContentType) {
			await handleUpdate("customContentType", localCustomContentType);
		}
	};

	const handleSexualContentToggle = async (value: boolean) => {
		if (value) {
			setOpenSexualPolicyModal(true);
		} else {
			await handleUpdate("sexualContentEnabled", false);
		}
	};

	const handleAgreeSexual = async (agreedToTerms: boolean) => {
		setOpenSexualPolicyModal(false);
		await handleUpdate("sexualContentEnabled", true);
		await handleUpdate("agreedToTerms", agreedToTerms);
	};

	const toggleSelection = async (id: string) => {
		const updatedContentPreferences = videoSettings.contentTypes.includes(
			id,
		)
			? videoSettings.contentTypes.filter((item) => item !== id)
			: [...videoSettings.contentTypes, id];
		await handleUpdate("contentTypes", updatedContentPreferences);
	};

	const options = [
		{
			id: "Shoutout",
			title: "Shoutout",
			iconToRender: (
				<Image
					source={require("@assets/images/preferences/shoutout.png")}
					resizeMode="contain"
					style={tw.style(
						"w-[50px] h-[50px] md:w-[63px] md:h-[63px]",
					)}
				/>
			),
		},
		{
			id: "Advice",
			title: "Advice",
			iconToRender: (
				<Image
					source={require("@assets/images/preferences/advice.png")}
					resizeMode="contain"
					style={tw.style(
						"w-[54px] h-[54px] md:w-[73px] md:h-[73px]",
					)}
				/>
			),
		},
		{
			id: "Performance",
			title: "Performance",
			iconToRender: (
				<Image
					source={require("@assets/images/preferences/performance.png")}
					resizeMode="contain"
					style={tw.style(
						"w-[56px] h-[34px] md:w-[76px] md:h-[45px]",
					)}
				/>
			),
		},
		{
			id: "EighteenPlusAdult",
			title: "18+ Adult",
			iconToRender: (
				<Image
					source={require("@assets/images/preferences/adult.png")}
					resizeMode="contain"
					style={tw.style(
						"w-[46px] h-[51px] md:w-[66px] md:h-[66px]",
					)}
				/>
			),
		},
		{
			id: "Endorsement",
			title: "Endorsements",
			iconToRender: (
				<Image
					source={require("@assets/images/preferences/endorsements.png")}
					resizeMode="contain"
					style={tw.style(
						"w-[41px] h-[46px] md:w-[77px] md:h-[66px]",
					)}
				/>
			),
		},
		{
			id: "Roast",
			title: "Roast",
			iconToRender: (
				<Image
					source={require("@assets/images/preferences/roast.png")}
					resizeMode="contain"
					style={tw.style(
						"w-[61px] h-[44px] md:w-[76px] md:h-[55px]",
					)}
				/>
			),
		},
	];

	useEffect(() => {
		setLocalCustomContentType(videoSettings.customContentType);
	}, [videoSettings.customContentType]);

	return (
		<FansView>
			<FansSwitch
				text="Allow sexual content"
				value={videoSettings.sexualContentEnabled}
				onValueChange={handleSexualContentToggle}
			/>

			<FansView
				padding={{ y: 16, x: 16 }}
				margin={{ t: 28 }}
				alignItems="center"
				justifyContent="center"
				borderRadius={15}
				style={tw.style("bg-fans-purple-light")}
			>
				<FypText
					fontSize={16}
					lineHeight={21}
					textAlign="center"
					style={tw.style("max-w-[460px]")}
				>
					<FypSvg svg={OutlinedInfoSvg} width={15} height={15} /> When
					selected, all fans have to go through ID verification to
					purchase custom videos
				</FypText>
			</FansView>

			<FansView
				flexDirection="row"
				flexWrap="wrap"
				margin={{ t: 20 }}
				style={tw.style("mx-[-4px] md:mx-[-8px]")}
			>
				{options.map((item) => (
					<FansView
						style={tw.style("w-1/3 md:w-1/4 p-1 md:p-2")}
						key={item.id}
					>
						<PreferenceItem
							title={item.title}
							selected={videoSettings.contentTypes.includes(
								item.id,
							)}
							onPress={() => toggleSelection(item.id)}
							iconToRender={item.iconToRender}
						/>
					</FansView>
				))}
			</FansView>
			<FansGap height={34} />
			<FansText fontFamily="inter-semibold" fontSize={17}>
				Additional content preferences (optional)
			</FansText>
			<FansGap height={15} />
			<RoundTextInput
				value={localCustomContentType}
				onChangeText={setLocalCustomContentType}
				placeholder="Describe additional preferences"
				multiline
				numberOfLines={4}
				maxLength={1000}
				customStyles="py-3 px-5 rounded-[7px] h-[128px]"
				onBlur={handleCustomContentTypeBlur}
			/>
			<FansGap height={36} />

			<SexualPolicyModal
				open={openSexualPolicyModal}
				handleClose={() => setOpenSexualPolicyModal(false)}
				handleAgree={handleAgreeSexual}
			/>
		</FansView>
	);
};

export default ContentPreferenceForm;
