import {
	CloseSvg,
	DollarCircled1Svg,
	EditSvg,
	GallerySvg,
	PlusSvg,
	SendOneSvg,
	SoundWaveSvg,
	TrashSvg,
	VideoCameraSvg,
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
import { ISendOptions } from "@state/messagesView";
import {
	MediaType,
	UploadUsageType,
	UserRoleTypes,
} from "@usertypes/commonEnums";
import { Colors } from "@usertypes/enums";
import { IPickerMedia, IProfile } from "@usertypes/types";
import useDocumentPicker from "@utils/useDocumentPicker";
import useUploadFiles, { IUploadedFile } from "@utils/useUploadFile";
import { Audio, ResizeMode, Video } from "expo-av";
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

function AudioRecorder(props: IAudioRecorderProps) {
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
}

function RecordButton(props: {
	onPressIn: () => void;
	onPressOut: () => void;
}) {
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
}

function SendButton(props: { onPress: () => void }) {
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
}

function MediaTile(props: {
	item: IPickerMedia;
	type: MediaType;
	isUploading?: boolean;
	individualProgress?: number;
	onPressEdit?: () => void;
	onPressDelete?: () => void;
}) {
	const {
		item,
		type,
		isUploading = false,
		individualProgress = 0,
		onPressEdit,
		onPressDelete,
	} = props;
	return (
		<FansView
			borderColor="white"
			backgroundColor="black-2e"
			borderRadius={15}
			overflow="hidden"
			width={250}
			height={250}
			position="relative"
			margin={2}
		>
			{type === MediaType.Image && (
				<FansImage2
					width="full"
					height="full"
					source={{ uri: item.uri }}
					viewStyle={isUploading ? tw`opacity-900` : tw``}
				/>
			)}
			{type === MediaType.Video && (
				<Video
					source={{ uri: item.uri }}
					style={{
						width: 250,
						height: 250,
					}}
					videoStyle={tw.style(isUploading ? "opacity-90" : "", {
						width: "250px",
						height: "250px",
					})}
					resizeMode={ResizeMode.CONTAIN}
				/>
			)}

			<TouchableOpacity
				onPress={onPressDelete}
				style={tw.style("absolute", "top-0", "right-0", "z-10")}
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
					<CloseSvg height={10} width={10} color="white" />
				</FansView>
			</TouchableOpacity>

			{!isUploading && (
				<TouchableOpacity onPress={onPressEdit}>
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
						<EditSvg height={15} width={15} color="white" />
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
}

interface IMessageInput {
	isTipAndPhotoVisible?: boolean;
	textOnly?: boolean;
	onSend?: (options: ISendOptions) => void;
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

	const { useImagePicker, useVideoPicker } = useDocumentPicker();
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
	const [videos, setVideos] = useState<IPickerMedia[]>([]);
	const [gif, setGif] = useState<IGif | undefined>(undefined);

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

		if (isAddSheetOpened) handleCloseAddSheet();
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

	const handlePressVideo = async (index?: number) => {
		if (isAddSheetOpened) handleCloseAddSheet();

		const result = await useVideoPicker(true);
		if (result.ok) {
			setVideos((currentVideos) => {
				const updatedVideos =
					index !== undefined
						? currentVideos.filter((_, i) => i !== index)
						: currentVideos;
				return [...updatedVideos, ...result.data];
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

	const handleDeleteVideo = (index: number) => {
		if (isUploading) return;
		setVideos((videos) => videos.filter((_, i) => i !== index));
	};

	const handleEditVideo = (index: number) => {
		if (isUploading) return;
		handlePressVideo(index);
	};

	const handleUploadMedia = async (): Promise<IUploadedFile[]> => {
		if (isUploading) return [];

		const mediaToUpload = [
			...videos.map((item) => ({
				...item,
				type: MediaType.Video,
			})),
			...images.map((item) => ({
				...item,
				type: MediaType.Image,
			})),
		];

		const result = await uploadFiles(mediaToUpload, UploadUsageType.CHAT);
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
		let uploadedFiles: IUploadedFile[] = [];
		let uploadedPreviewImages: IUploadedFile[] = [];
		if (images.length > 0 || videos.length > 0) {
			uploadedFiles = await handleUploadMedia();
		}
		if (previewFiles.length > 0) {
			uploadedPreviewImages = await handleUploadPreviewImages();
		}
		onSend({
			message,
			uploadedFiles,
			previewUploadedFiles: uploadedPreviewImages,
			value: price,
			gif: gif && {
				source: "giphy",
				id: String(gif.id),
			},
		});
		setMessage("");
		setImages([]);
		setVideos([]);
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

	const progressPerMedia = 100 / Math.max(images.length + videos.length, 1);

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
						{videos.map((item, index) => {
							const individualProgress = Math.min(
								Math.max(
									progress - index * progressPerMedia,
									0,
								) / progressPerMedia,
								1,
							);

							return (
								<MediaTile
									key={item.id ?? index}
									item={item}
									type={MediaType.Video}
									isUploading={isUploading}
									individualProgress={individualProgress}
									onPressEdit={() => handleEditVideo(index)}
									onPressDelete={() =>
										handleDeleteVideo(index)
									}
								/>
							);
						})}
						{images.map((item, index) => {
							const individualProgress = Math.min(
								Math.max(
									progress -
										(index - videos.length) *
											progressPerMedia,
									0,
								) / progressPerMedia,
								1,
							);

							return (
								<MediaTile
									key={item.id ?? index}
									item={item}
									type={MediaType.Image}
									isUploading={isUploading}
									individualProgress={individualProgress}
									onPressEdit={() => handleEditImage(index)}
									onPressDelete={() =>
										handleDeleteImage(index)
									}
								/>
							);
						})}
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
									<FansGap width={18.2} />
									<TouchableOpacity
										onPress={() => handlePressVideo()}
									>
										<FansView
											style={tw.style(
												"w-[18.7px] h-[18.7px]",
											)}
										>
											<FypSvg
												svg={VideoCameraSvg}
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
					onGifSelect={(gif: IGif) => setGif(gif)}
					onTipSelect={handleDollarPress}
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
