import {
	PlaySvg,
	AudioPrevSvg,
	AudioNextSvg,
	PauseSvg,
} from "@assets/svgs/common";
import { FansIconButton, FansText, FansView } from "@components/controls";
import { cdnURL } from "@helper/Utils";
import tw from "@lib/tailwind";
import Slider from "@react-native-community/slider";
import { IFypPostContent } from "@usertypes/components";
import { convertTrackingTime } from "@utils/stringHelper";
import { Audio } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import { Image } from "react-native";

const AudioContent: IFypPostContent = (props) => {
	const { data } = props;
	const [duration, setDuration] = useState(0);
	const [position, setPosition] = useState(0);

	const sound = useRef(new Audio.Sound());
	const [isPlaying, setIsPlaying] = useState(false);

	const loadAudio = async () => {
		await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
		const checkLoading = await sound.current.getStatusAsync();
		if (!checkLoading.isLoaded) {
			try {
				const result = await sound.current.loadAsync({
					uri: cdnURL(data.medias[0].url) ?? "",
				});
			} catch (error) {
				return;
			}
		}
	};

	const playAudio = async () => {
		try {
			const result = await sound.current.getStatusAsync();
			if (result?.isLoaded) {
				if (result.isPlaying === false) {
					await sound.current.playAsync();
					setIsPlaying(true);
				}
			}
		} catch (err) {
			return;
		}
	};

	const pauseAudio = async () => {
		try {
			const result = await sound.current.getStatusAsync();
			if (result.isLoaded) {
				if (result.isPlaying === true) {
					await sound.current.pauseAsync();
					setIsPlaying(false);
					// const _soundStatus = await sound.current.getStatusAsync();
					// setStatus(_soundStatus);
				}
			}
		} catch (err) {
			return;
		}
	};

	const onClickPlayPause = async () => {
		const result = await sound.current.getStatusAsync();
		if (result?.isLoaded) {
			if (result.isPlaying) {
				pauseAudio();
			} else {
				playAudio();
			}
		}
	};

	const onSeekPosition = async (val: number) => {
		if (sound) {
			let newPosition = val;
			if (val < 0) {
				newPosition = 0;
			}
			if (val > duration) {
				newPosition = position;
			}
			setPosition(newPosition);
			await sound.current.setPositionAsync(newPosition * 1000);
		}
	};

	useEffect(() => {
		loadAudio();
	}, [data.medias]);

	useEffect(() => {
		if (sound && isPlaying) {
			const updatePosition = setInterval(async () => {
				const status = await sound.current.getStatusAsync();
				if (status.isLoaded) {
					setPosition(
						Math.trunc(
							!Number.isNaN(status.positionMillis)
								? status.positionMillis / 1000
								: 0,
						),
					);
					setDuration(
						Math.trunc(
							!Number.isNaN(status.durationMillis)
								? Math.round(
										(status?.durationMillis ?? 0) / 1000,
								  )
								: 0,
						),
					);
					setIsPlaying(status.isPlaying);
					if (status.didJustFinish) {
						setPosition(0);
					}
				}
			}, 500);

			return () => clearInterval(updatePosition);
		}
	}, [sound, isPlaying]);

	return (
		<FansView style={tw.style("px-[18px] mb-2 md:px-0")}>
			<FansView
				style={tw.style(
					"border rounded-[7px] border-fans-grey-f0 dark:border-fans-grey-43",
				)}
			>
				<Image
					source={{ uri: cdnURL(data.thumb?.url) }}
					resizeMode="cover"
					style={tw.style("h-[112px] w-full rounded-t-[7px]")}
				/>

				<FansView style={tw.style("pt-[10px] px-5 pb-6 ")}>
					<FansText
						fontFamily="inter-semibold"
						fontSize={17}
						lineHeight={22}
						style={tw.style("text-fans-black dark:text-fans-white")}
					>
						{data.title}
					</FansText>
					<FansText
						fontSize={16}
						lineHeight={21}
						style={tw.style(
							"mb-[14px] text-fans-grey-70 dark:text-fans-grey-b1",
						)}
					>
						{data.caption}
					</FansText>

					<FansView>
						<Slider
							maximumValue={duration}
							minimumValue={0}
							minimumTrackTintColor="#a854f5"
							maximumTrackTintColor={
								tw.prefixMatch("dark") ? "#434343" : "#f0f0f0"
							}
							thumbTintColor="#a854f5"
							step={0.1}
							value={position}
							disabled
						/>
						<FansView
							style={tw.style(
								"flex-row items-center justify-between mt-[2px]",
							)}
						>
							<FansText
								style={tw.style(
									"text-fans-grey-70 dark:text-fans-grey-b1",
								)}
								fontSize={14}
								lineHeight={19}
							>
								{duration === 0
									? ""
									: convertTrackingTime(position)}
							</FansText>
							<FansText
								style={tw.style(
									"text-fans-grey-70 dark:text-fans-grey-b1",
								)}
								fontSize={14}
								lineHeight={19}
							>
								{duration === 0
									? ""
									: convertTrackingTime(duration)}
							</FansText>
						</FansView>
					</FansView>

					<FansView
						style={tw.style(
							"flex-row items-center gap-x-7 justify-center",
						)}
					>
						<FansIconButton
							size={24}
							style={tw.style("rounded-none")}
							backgroundColor="bg-fans-white dark:bg-fans-black-1d"
							onPress={() => onSeekPosition(position - 15)}
						>
							<AudioPrevSvg width={23.6} height={23.6} />
						</FansIconButton>
						<FansIconButton
							size={68}
							backgroundColor="bg-fans-purple"
							onPress={onClickPlayPause}
						>
							{isPlaying ? (
								<PauseSvg size={36} color="#fff" />
							) : (
								<PlaySvg size={27} color="#fff" />
							)}
						</FansIconButton>
						<FansIconButton
							size={24}
							style={tw.style("rounded-none")}
							backgroundColor="bg-fans-white dark:bg-fans-black-1d"
							onPress={() => onSeekPosition(position + 15)}
						>
							<AudioNextSvg width={23.6} height={23.6} />
						</FansIconButton>
					</FansView>
				</FansView>
			</FansView>
		</FansView>
	);
};

export default AudioContent;
