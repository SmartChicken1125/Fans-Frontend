import {
	CloseSvg,
	DollarCircled1Svg,
	EditSvg,
	GallerySvg,
	PlusSvg,
	SendOneSvg,
	SoundWaveSvg,
	TrashSvg,
	VoiceRecordSvg,
} from "@assets/svgs/common";
import { FypSvg } from "@components/common/base";
import {
	FansGap,
	FansImage2,
	FansSvg,
	FansText,
	FansView,
} from "@components/controls";
import AddSheet from "@components/dialogs/chat/Add";
import PaidPostCreateSheet from "@components/dialogs/chat/PaidPostCreate";
import { CommonActionType, useAppContext } from "@context/useAppContext";
import { IGif } from "@giphy/js-types";
import tw from "@lib/tailwind";
import {
	MediaType,
	UploadUsageType,
	UserRoleTypes,
} from "@usertypes/commonEnums";
import { Colors } from "@usertypes/enums";
import { IPickerMedia, IProfile } from "@usertypes/types";
import useDocumentPicker from "@utils/useDocumentPicker";
import useUploadFiles, { IUploadedFile } from "@utils/useUploadFile";
import { Audio } from "expo-av";
import React, {
	FC,
	Fragment,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { ProgressBar } from "react-native-paper";
import Toast from "react-native-toast-message";

interface IAudioRecorder {
	startRecording: () => Promise<void>;
	stopRecording: () => Promise<string | undefined>;
	isRecording: boolean;
	time: string;
}

interface IAudioRecorderProps {
	onSend: (uri: string) => void;
	recorder: IAudioRecorder;
}

function useRecorder(): IAudioRecorder {
	const duration = useRef(0);
	const interval = useRef<NodeJS.Timeout | undefined>(undefined);
	const audio = useRef<Audio.Recording>();

	const [isRecording, setRecording] = useState(false);
	const [time, setTime] = useState("00:00");

	const tickTimer = () => {
		duration.current++;
		const minutes = Math.floor(duration.current / 60);
		const seconds = duration.current % 60;
		const minutesStr = minutes < 10 ? "0" + minutes : minutes;
		const secondsStr = seconds < 10 ? "0" + seconds : seconds;
		setTime(minutesStr + ":" + secondsStr);
	};

	const startRecording = useCallback(async () => {
		try {
			await Audio.requestPermissionsAsync();
			await Audio.setAudioModeAsync({
				allowsRecordingIOS: true,
				playsInSilentModeIOS: true,
			});
			const { recording } = await Audio.Recording.createAsync();
			audio.current = recording;
			interval.current = setInterval(tickTimer, 1000);
			setRecording(true);
		} catch (e) {
			setRecording(false);
			return;
		}
		console.log("Audio started", interval);
	}, []);

	const stopRecording = useCallback(async () => {
		console.log("Audio ended", interval);
		const aud = audio.current;
		let uri = undefined;
		if (aud) {
			await aud.stopAndUnloadAsync();
			await Audio.setAudioModeAsync({
				allowsRecordingIOS: false,
			});
			uri = aud.getURI() ?? undefined;
		}
		clearInterval(interval.current);
		setRecording(false);

		return uri;
	}, []);

	useEffect(() => {
		return () => {
			// cleanup
			if (interval.current) clearInterval(interval.current);
		};
	}, []);

	return {
		startRecording,
		stopRecording,
		isRecording,
		time,
	};
}

const AudioRecorder: FC<IAudioRecorderProps> = (props) => {
	const { onSend, recorder } = props;

	const handlePressDelete = () => {
		recorder.stopRecording();
	};

	const handlePressSend = async () => {
		const uri = await recorder.stopRecording();
		if (uri) onSend(uri);
	};

	return (
		<FansView
			style={tw.style(
				"h-[42px]",
				"bg-fans-purple",
				"flex-row justify-between items-center",
				"grow",
				"px-[4px]",
				"rounded-full",
			)}
		>
			<TouchableOpacity onPress={handlePressDelete}>
				<View
					style={tw.style(
						"w-[34px] h-[34px]",
						"bg-fans-white",
						"flex justify-center items-center",
						"rounded-full",
					)}
				>
					<TrashSvg size={14} color={Colors.Purple} />
				</View>
			</TouchableOpacity>
			<FansGap width={10} />
			<View style={tw.style("grow")}>
				<SoundWaveSvg size={28} color={Colors.White} />
			</View>
			<FansText color="white" fontFamily="inter-semibold" fontSize={15}>
				{recorder.time}
			</FansText>
			<FansGap width={10} />
			{!recorder.isRecording && (
				<TouchableOpacity onPress={handlePressSend}>
					<View
						style={tw.style(
							"w-[34px] h-[34px]",
							"bg-fans-white",
							"flex justify-center items-center",
							"rounded-full",
						)}
					>
						<SendOneSvg size={16} color={Colors.Purple} />
					</View>
				</TouchableOpacity>
			)}
		</FansView>
	);
};

const RecordButton: FC<{
	onPressIn: () => void;
	onPressOut: () => void;
}> = (props) => {
	const { onPressIn, onPressOut } = props;
	return (
		<TouchableOpacity onPressIn={onPressIn} onPressOut={onPressOut}>
			<FansView
				width={42}
				height={42}
				alignItems="center"
				justifyContent="center"
			>
				<FansSvg
					width={16.81}
					height={20.67}
					svg={VoiceRecordSvg}
					color1="grey-70"
				/>
			</FansView>
		</TouchableOpacity>
	);
};

const SendButton: FC<{ onPress: () => void }> = (props) => {
	const { onPress } = props;
	return (
		<TouchableOpacity onPress={onPress}>
			<View
				style={tw.style(
					"w-[34px] h-[34px]",
					"bg-fans-purple",
					"flex justify-center items-center",
					"rounded-full",
				)}
			>
				<SendOneSvg size={16} color={Colors.White} />
			</View>
		</TouchableOpacity>
	);
};

interface IMessageInput {
	isTipAndPhotoVisible?: boolean;
	textOnly?: boolean;
	onSend?: (message: string, uploadedImages: IUploadedFile[]) => void;
	creator?: Partial<IProfile> | null;
}

const MessageInput: FC<IMessageInput> = (props) => {
	const {
		isTipAndPhotoVisible = true,
		textOnly: textonly = false,
		onSend,
		creator,
	} = props;

	const { state, dispatch } = useAppContext();
	const { userInfo } = state.user;
	const { type } = userInfo;

	const isCreator = type === UserRoleTypes.Creator;

	const { useImagePicker } = useDocumentPicker();
	const { uploadFiles, isUploading, progress } = useUploadFiles();

	const recorder = useRecorder();
	const duration = useRef(0);

	const [isAddSheetOpened, setAddSheetOpened] = useState(false);
	const [isPaidPostCreateSheetOpened, setPaidPostCreateSheetOpened] =
		useState(false);
	const [message, setMessage] = useState("");
	const [audio, setAudio] = useState<Audio.Recording>();
	const [price, setPrice] = useState("0");
	const [previewFiles, setPreviewFiles] = useState<IPickerMedia[]>([]);
	const [images, setImages] = useState<IPickerMedia[]>([]);

	const handleChangeText = (text: string) => setMessage(text);

	const handleCloseAddSheet = () => setAddSheetOpened(false);
	const handlePressAdd = () => setAddSheetOpened(true);

	const handleClosePaidPost = () => setPaidPostCreateSheetOpened(false);
	const handlePressPaidPost = () => setPaidPostCreateSheetOpened(true);

	const handleDollarPress = () => {
		if (isCreator) {
			handlePressPaidPost();
		} else {
			handleOpenGemModal();
		}
	};

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

	const handlePaidPostCreate = async (
		price: string,
		previewFiles: IPickerMedia[],
	) => {
		handleClosePaidPost();
		setPrice(price);
		setPreviewFiles(previewFiles);
		await handlePressPhoto();
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

	const handlePressIn = async () => {};
	const handlePressOut = async () => {};

	const handlePressSend = async () => {
		if (!onSend) return;
		const uploadedImages = await handleUploadImages();
		const uploadedPreviewImages = await handleUploadPreviewImages();
		//TODO Alula: Handle uploaded preview images
		onSend(message, uploadedImages); // Add uploaded preview images, price
		setMessage("");
		setImages([]);
	};

	const handleSendAudio = (audioUri: string) => {
		console.log("Audio send", audioUri);
	};

	const handleOpenGemModal = () => {
		dispatch.setCommon({
			type: CommonActionType.toggleSendTipModal,
			data: {
				visible: true,
				creator: creator,
			},
		});
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
					{recorder.isRecording ? (
						<AudioRecorder
							onSend={handleSendAudio}
							recorder={recorder}
						/>
					) : (
						<Fragment>
							<View
								style={tw.style(
									"h-[42px]",
									"bg-fans-grey dark:bg-fans-grey-43",
									"flex-row items-center",
									"grow",
									"rounded-full",
								)}
							>
								<FansGap width={8.7} />
								<FansView style={tw.style("w-[0px]", "grow")}>
									<TextInput
										value={message}
										style={tw.style(
											"font-inter-regular",
											"text-[18px] text-fans-black dark:text-fans-white",
										)}
										placeholder="Message..."
										placeholderTextColor={tw.color(
											"fans-grey-dark",
										)}
										onChangeText={handleChangeText}
										onSubmitEditing={handlePressSend}
									/>
								</FansView>
								{
									isSendable ? (
										<SendButton onPress={handlePressSend} />
									) : null
									// TODO: Audio recording
									// (<RecordButton
									//  onPressIn={handlePressIn}
									//  onPressOut={handlePressOut}
									// />)
								}
							</View>
							{isSendable || !isTipAndPhotoVisible ? (
								<FansGap width={13.6} />
							) : (
								<Fragment>
									<FansGap width={17} />
									<TouchableOpacity
										onPress={handleDollarPress}
									>
										<FypSvg
											width={20.78}
											height={20.77}
											svg={DollarCircled1Svg}
											color="fans-black dark:fans-white"
										/>
									</TouchableOpacity>
									<FansGap width={18.2} />
									<TouchableOpacity
										onPress={() => handlePressPhoto()}
									>
										<FansView
											style={tw.style(
												"w-[18.7px] h-[18.7px]",
											)}
										>
											<FypSvg
												svg={GallerySvg}
												width={19}
												height={19}
												color="fans-black dark:fans-white"
											/>
										</FansView>
									</TouchableOpacity>
									<FansGap width={18} />
								</Fragment>
							)}
							<TouchableOpacity onPress={handlePressAdd}>
								<FypSvg
									svg={PlusSvg}
									width={18}
									height={18}
									color="fans-black dark:fans-white"
								/>
							</TouchableOpacity>
						</Fragment>
					)}
					{/*
    <View style={tw.style("flex-1 relative")}>
      <TextInput
        placeholder="Message..."
        value={value}
        onChangeText={onChange}
        onFocus={() => setFocus(true)}
        style={tw.style(
          "text-[18px] leading-6 text-black py-2 bg-fans-grey rounded-[21px] pl-[42px] pr-2",
        )}
        multiline
      />
      <TouchableOpacity
        style={tw.style(
          `flex justify-center items-center w-[34px] h-[34px] rounded-full absolute left-1 bottom-1 ${
            isfocus ? "bg-transparent" : "bg-fans-purple"
          }`,
        )}
      >
        <OutlineCamera
          size={16}
          style={tw.style(
            `${isfocus ? "text-fans-purple" : "text-white"}`,
          )}
        />
      </TouchableOpacity>

      {isfocus ? (
        <TouchableOpacity
          style={tw.style(
            "flex justify-center items-center w-[34px] h-[34px] rounded-full absolute right-1 bottom-1 bg-fans-purple",
          )}
          onPress={() => {
            onSend();
          }}
        >
          <SendSvg width={34} height={34} style={tw.style("")} />
        </TouchableOpacity>
      ) : (
      )}
          </View>*/}
				</FansView>
				<AddSheet
					open={isAddSheetOpened}
					onClose={handleCloseAddSheet}
					onPressPhoto={handlePressPhoto}
					onGifSelect={(gif: IGif) => {
						// Todo Alula: Handle gif
						console.log("GIF selected", gif);
					}}
				/>
				<PaidPostCreateSheet
					open={isPaidPostCreateSheetOpened}
					onClose={handleClosePaidPost}
					onSubmit={handlePaidPostCreate}
				/>
			</View>
		</Fragment>
	);
};

export default MessageInput;
