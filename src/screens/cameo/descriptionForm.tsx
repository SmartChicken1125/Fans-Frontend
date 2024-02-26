import { ImageImage } from "@assets/svgs/images";
import RoundTextInput from "@components/common/RoundTextInput";
import { FypText, FypSwitch } from "@components/common/base";
import { FansDivider, FansGap, FansText, FansView } from "@components/controls";
import { updateCustomVideoSettings } from "@helper/endpoints/cameo/apis";
import tw from "@lib/tailwind";
import { ICustomVideoSettings } from "@usertypes/types";
import { getDocumentAsync } from "expo-document-picker";
import React, { FC, useState, useEffect } from "react";
import { Image } from "react-native";
import Toast from "react-native-toast-message";

const LIMIT_OF_FILES = 8;

interface File {
	uri?: string;
	name: string;
	type: string;
}

interface Props {
	videoSettings: ICustomVideoSettings;
	handleUpdateSettings: (videoSettings: ICustomVideoSettings) => void;
}

const DescriptionForm: FC<Props> = (props) => {
	const { videoSettings, handleUpdateSettings } = props;

	const [files, setFiles] = useState<File[]>([]);
	const [localDescription, setLocalDescription] = useState<string>("");

	const updateSettings = async (name: string, value: string | boolean) => {
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

	const handleUpdateDescription = async () => {
		if (localDescription !== videoSettings.description) {
			await updateSettings("description", localDescription);
		}
	};

	const onUpload = async () => {
		const result = await getDocumentAsync({
			type: "image/*", // Specify that only image files are allowed
			multiple: true, // Allow multiple file selection
		});

		if (!result.canceled && result.output) {
			const filesArray: File[] = [];

			if (result.output instanceof FileList) {
				for (
					let i = 0;
					i < Math.min(result.output.length, LIMIT_OF_FILES);
					i++
				) {
					const file = result.output[i];
					filesArray.push({
						name: file.name,
						type: file.type || "",
						uri: URL.createObjectURL(file),
					});
				}
			}

			setFiles(filesArray);
		}
	};

	useEffect(() => {
		setLocalDescription(videoSettings.description);
	}, [videoSettings.description]);

	return (
		<FansView>
			<FansView>
				<FypText fontWeight={600} fontSize={17} margin={{ b: 15 }}>
					Description
				</FypText>
				<RoundTextInput
					value={localDescription}
					placeholder="Enter description here"
					multiline
					numberOfLines={4}
					maxLength={1000}
					customStyles="py-3 px-5 rounded-[7px] h-[128px]"
					onChangeText={(value) => setLocalDescription(value)}
					onBlur={handleUpdateDescription}
				/>
				<FansGap height={23} />
				<FansView margin={{ b: 38 }}>
					<FansText fontFamily="inter-semibold" fontSize={17}>
						Upload video previews (optional)
					</FansText>
					<FansGap height={21} />
					<FansView
						pressableProps={{
							onPress: onUpload,
						}}
					>
						<FansView
							style={tw.style(
								"h-[162px]",
								"border border-fans-grey-dark border-dashed rounded-[7px]",
								"flex justify-center items-center",
							)}
						>
							<FansView
								style={tw.style("w-[77.44px] h-[70.96px]")}
							>
								<ImageImage />
							</FansView>
							<FansGap height={13.3} />
							<FansText style={tw.style("text-[17px]")}>
								Drop image here or{" "}
								<FansText
									style={tw.style(
										"font-inter-semibold",
										"text-[17px] text-fans-purple",
									)}
								>
									browse
								</FansText>
							</FansText>
						</FansView>
					</FansView>
					<FansGap height={21} />
					{files.length !== 0 && (
						<FansView style={tw.style("flex flex-row flex-wrap")}>
							{files.map((file, index) => (
								<FansView
									key={index}
									style={tw.style(
										"w-[77.44px] h-[70.96px] m-2",
										"border border-fans-grey-dark rounded-[7px]",
									)}
								>
									{/* Assuming file.type.startsWith("image/") for image files */}
									{file.type.startsWith("image/") ? (
										<Image
											source={{
												uri: file.uri,
											}}
											style={tw.style(
												"flex-1 rounded-[7px]",
											)}
											resizeMode="cover"
										/>
									) : (
										<FansText
											style={tw.style("text-[17px]")}
										>
											{file.name}
										</FansText>
									)}
								</FansView>
							))}
						</FansView>
					)}
				</FansView>

				<FansView gap={20} margin={{ b: 94 }}>
					<FansView
						flexDirection="row"
						alignItems="center"
						justifyContent="between"
					>
						<FypText fontSize={18}>Show reviews from fans</FypText>
						<FypSwitch value={true} onValueChange={() => {}} />
					</FansView>
					<FansDivider
						style={tw.style("bg-fans-grey dark:bg-fans-grey-43")}
					/>
					<FansView
						flexDirection="row"
						alignItems="center"
						justifyContent="between"
					>
						<FypText fontSize={18}>
							Allow fan to download video
						</FypText>
						<FypSwitch value={true} onValueChange={() => {}} />
					</FansView>
				</FansView>
			</FansView>
		</FansView>
	);
};

export default DescriptionForm;
