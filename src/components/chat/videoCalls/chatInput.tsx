import {
	CloseSvg,
	EditSvg,
	SendOneSvg,
	OutlineCamera,
} from "@assets/svgs/common";
import { FypSvg, FypLinearGradientView } from "@components/common/base";
import { FansImage2, FansText, FansView } from "@components/controls";
import AddSheet from "@components/dialogs/chat/Add";
import tw from "@lib/tailwind";
import { MediaType, UploadUsageType } from "@usertypes/commonEnums";
import { Colors } from "@usertypes/enums";
import { IPickerMedia, IProfile } from "@usertypes/types";
import useDocumentPicker from "@utils/useDocumentPicker";
import useUploadFiles, { IUploadedFile } from "@utils/useUploadFile";
import React, { FC, Fragment, useState } from "react";
import { TextInput, TouchableOpacity, View, Platform } from "react-native";
import { ProgressBar } from "react-native-paper";
import Toast from "react-native-toast-message";

const SendButton: FC<{ onPress: () => void }> = (props) => {
	const { onPress } = props;
	return (
		<FansView
			width={{ xs: 34, md: 43 }}
			height={{ xs: 34, md: 43 }}
			position="absolute"
			style={tw.style("top-1 right-1 md:top-[5px] md:right-[5px]")}
			pressableProps={{ onPress: onPress }}
		>
			<FypLinearGradientView
				colors={["#1d21e5", "#d885ff"]}
				width={{ xs: 34, md: 43 }}
				height={{ xs: 34, md: 43 }}
				borderRadius={43}
				alignItems="center"
				justifyContent="center"
			>
				<FypSvg
					svg={SendOneSvg}
					width={{ xs: 16, md: 21 }}
					height={{ xs: 16, md: 21 }}
					color="fans-white"
				/>
			</FypLinearGradientView>
		</FansView>
	);
};

interface IChatInput {
	isTipAndPhotoVisible?: boolean;
	textOnly?: boolean;
	onSend?: (message: string, uploadedImages: IUploadedFile[]) => void;
	creator?: Partial<IProfile> | null;
}

const ChatInput: FC<IChatInput> = (props) => {
	const {
		isTipAndPhotoVisible = true,
		textOnly: textonly = false,
		onSend,
	} = props;

	const { useImagePicker } = useDocumentPicker();
	const { uploadFiles, isUploading, progress } = useUploadFiles();

	const [isAddSheetOpened, setAddSheetOpened] = useState(false);
	const [message, setMessage] = useState("");
	const [previewFiles, setPreviewFiles] = useState<IPickerMedia[]>([]);
	const [images, setImages] = useState<IPickerMedia[]>([]);

	const handleChangeText = (text: string) => setMessage(text);

	const handleCloseAddSheet = () => setAddSheetOpened(false);

	const handlePressPhoto = async (index?: number) => {
		if (isAddSheetOpened) handleCloseAddSheet();

		const result = await useImagePicker(true);
		if (result.ok) {
			setImages((currentImages) => {
				const updatedImages =
					index !== undefined
						? currentImages.filter((_, i) => i !== index)
						: currentImages;
				return [...updatedImages, ...result.data];
			});
		} else {
			Toast.show({
				type: "error",
				text1: result?.message ?? "",
			});
		}
	};

	const handleDeleteImage = (index: number) => {
		if (isUploading) return;
		setImages((images) => images.filter((_, i) => i !== index));
	};

	const handleEditImage = (index: number) => {
		if (isUploading) return;
		handlePressPhoto(index);
	};

	const handleUploadImages = async (): Promise<IUploadedFile[]> => {
		if (isUploading) return [];
		if (images.length === 0) return [];

		const imagesToUpload = images.map((item) => ({
			...item,
			type: MediaType.Image,
		}));

		const result = await uploadFiles(imagesToUpload, UploadUsageType.CHAT);
		if (result.ok) {
			return result.data;
		}

		Toast.show({
			type: "error",
			text1: result?.errorString ?? "",
		});
		return [];
	};

	const handleUploadPreviewImages = async (): Promise<IUploadedFile[]> => {
		if (isUploading) return [];
		if (images.length === 0) return [];

		const imagesToUpload = previewFiles.map((item) => ({
			...item,
			type: MediaType.Image,
		}));

		const result = await uploadFiles(imagesToUpload, UploadUsageType.CHAT);
		if (result.ok) {
			return result.data;
		}

		Toast.show({
			type: "error",
			text1: result?.errorString ?? "",
		});
		return [];
	};

	const handlePressSend = async () => {
		if (!onSend) return;
		const uploadedImages = await handleUploadImages();
		const uploadedPreviewImages = await handleUploadPreviewImages();
		//TODO Alula: Handle uploaded preview images
		onSend(message, uploadedImages); // Add uploaded preview images, price
		setMessage("");
		setImages([]);
	};

	const isSendable = message.length !== 0 || images.length !== 0;

	if (textonly) {
		return (
			<FansView
				style={tw.style(
					"w-full h-[42px]",
					"bg-fans-grey dark:bg-fans-grey-43",
					"flex-row items-center",
					"rounded-full",
				)}
			>
				<FansView style={tw.style("grow", "mx-[20px]")}>
					<TextInput
						value={message}
						style={tw.style(
							"font-inter-regular",
							"text-[18px]",
							"text-fans-black dakr:text-fans-white",
						)}
						placeholder="Send Message..."
						placeholderTextColor={tw.color(
							"fans-grey-dark dark:text-fans-grey-b1",
						)}
						onChangeText={handleChangeText}
					/>
				</FansView>
				{isSendable && (
					<FansView
						style={tw.style(
							"w-[34px] h-[34px]",
							"bg-fans-purple",
							"flex justify-center items-center",
							"mr-[4px]",
							"rounded-full",
						)}
					>
						<FansView style={tw.style("w-[16.32px] h-[16.32px]")}>
							<SendOneSvg color={Colors.White} />
						</FansView>
					</FansView>
				)}
			</FansView>
		);
	}

	return (
		<Fragment>
			<View style={tw.style("relative")}>
				<View
					style={tw.style(
						"absolute",
						"bottom-10",
						"left-0",
						"right-0",
						"z-50",
					)}
				>
					<View
						style={tw.style(
							"flex-row flex-wrap justify-start items-center mb-2",
						)}
					>
						{images.map((item, index) => {
							const progressPerImage = 100 / images.length;
							const individualProgress = Math.min(
								Math.max(
									progress - index * progressPerImage,
									0,
								) / progressPerImage,
								1,
							);

							return (
								<FansView
									key={index}
									borderColor="white"
									width={250}
									height={250}
									position="relative"
									margin={2}
								>
									<FansImage2
										width="full"
										height="full"
										source={{ uri: item.uri }}
										viewStyle={
											isUploading ? tw`opacity-900` : tw``
										}
									/>

									<TouchableOpacity
										onPress={() => handleDeleteImage(index)}
										style={tw.style(
											"absolute",
											"top-0",
											"right-0",
											"z-10",
										)}
									>
										<FansView
											width={25}
											height={25}
											alignItems="center"
											justifyContent="center"
											position="absolute"
											right={10}
											top={10}
											borderRadius="full"
											backgroundColor="purple"
										>
											<CloseSvg
												height={10}
												width={10}
												color="white"
											/>
										</FansView>
									</TouchableOpacity>

									{!isUploading && (
										<TouchableOpacity
											onPress={() =>
												handleEditImage(index)
											}
										>
											<FansView
												width={30}
												height={30}
												alignItems="center"
												justifyContent="center"
												position="absolute"
												right={10}
												bottom={10}
												borderRadius="full"
												backgroundColor="grey-70"
											>
												<EditSvg
													height={15}
													width={15}
													color="white"
												/>
											</FansView>
										</TouchableOpacity>
									)}

									{isUploading && (
										<FansView
											justifyContent="center"
											alignItems="center"
											position="absolute"
											left={10}
											right={10}
											bottom={10}
										>
											<ProgressBar
												progress={individualProgress}
												color="#D2A8F9"
												style={{
													height: 8,
													borderRadius: 5,
												}}
											/>
										</FansView>
									)}
								</FansView>
							);
						})}
						{images.length > 0 && (
							<FansView
								borderColor="white"
								width={100}
								height={250}
								position="relative"
								margin={2}
							>
								<TouchableOpacity
									onPress={() => handlePressPhoto()}
									style={tw.style(
										"justify-center",
										"items-center",
										"border-2",
										"rounded",
										"border-gray-100",
										"bg-gray-100",
										"w-full",
										"h-full",
									)}
								>
									<FansText
										fontSize={50}
										style={tw.style("text-gray-400")}
									>
										+
									</FansText>
								</TouchableOpacity>
							</FansView>
						)}
					</View>
				</View>

				<FansView
					style={tw.style(
						"w-full",
						"flex-row items-center",
						"relative",
					)}
				>
					<FansView
						height={{ xs: 42, md: 54 }}
						borderRadius={54}
						position="relative"
						style={tw.style("bg-fans-grey-43 w-full")}
					>
						<TextInput
							value={message}
							style={tw.style(
								"font-inter-regular",
								"text-[18px] text-fans-white w-full h-full pl-[46px] md:pl-15",
								Platform.OS === "web" && {
									outlineWidth: 0,
								},
							)}
							placeholder="Message..."
							placeholderTextColor={tw.color("fans-grey-b1")}
							onChangeText={handleChangeText}
							onSubmitEditing={handlePressSend}
						/>
						{isSendable ? (
							<SendButton onPress={handlePressSend} />
						) : null}
					</FansView>
					{isSendable || !isTipAndPhotoVisible ? null : (
						<FansView
							width={{ xs: 34, md: 22 }}
							height={{ xs: 34, md: 20 }}
							position="absolute"
							alignItems="center"
							justifyContent="center"
							style={tw.style(
								"top-1 left-1 md:top-[17px] md:left-[17px]   rounded-full md:rounded-0",
								tw.prefixMatch("md")
									? "bg-transparent"
									: "bg-fans-white",
							)}
							pressableProps={{
								onPress: () => handlePressPhoto(),
							}}
						>
							<FypSvg
								svg={OutlineCamera}
								width={{ xs: 16, md: 22 }}
								height={{ xs: 25, md: 20 }}
								color={
									tw.prefixMatch("md")
										? "fans-white"
										: "fans-black-1d"
								}
							/>
						</FansView>
					)}
				</FansView>
				<AddSheet
					open={isAddSheetOpened}
					onClose={handleCloseAddSheet}
					onPressPhoto={handlePressPhoto}
				/>
			</View>
		</Fragment>
	);
};

export default ChatInput;
