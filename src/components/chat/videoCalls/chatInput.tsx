import { SendOneSvg } from "@assets/svgs/common";
import { FypSvg, FypLinearGradientView } from "@components/common/base";
import { FansView } from "@components/controls";
import AddSheet from "@components/dialogs/chat/Add";
import { IGif } from "@giphy/js-types";
import tw from "@lib/tailwind";
import { MediaType, UploadUsageType } from "@usertypes/commonEnums";
import { IPickerMedia, IProfile } from "@usertypes/types";
import useDocumentPicker from "@utils/useDocumentPicker";
import useUploadFiles, { IUploadedFile } from "@utils/useUploadFile";
import React, { FC, Fragment, useState } from "react";
import { TextInput, View, Platform } from "react-native";
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
	const { onSend } = props;

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

	return (
		<Fragment>
			<View style={tw.style("relative")}>
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
								"text-[18px] text-fans-white w-full h-full pl-5",
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
				</FansView>
				<AddSheet
					open={isAddSheetOpened}
					onClose={handleCloseAddSheet}
					onPressPhoto={handlePressPhoto}
					onGifSelect={(gif: IGif) => {
						console.log("GIF selected", gif);
					}}
				/>
			</View>
		</Fragment>
	);
};

export default ChatInput;
