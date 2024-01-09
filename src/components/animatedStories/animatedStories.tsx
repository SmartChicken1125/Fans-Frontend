import tw from "@lib/tailwind";
import React, {
	forwardRef,
	useImperativeHandle,
	useState,
	useEffect,
	useRef,
	memo,
} from "react";
import { Image, ScrollView } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import {
	ANIMATION_DURATION,
	DEFAULT_COLORS,
	SEEN_LOADER_COLORS,
	STORY_AVATAR_SIZE,
	AVATAR_SIZE,
	BACKGROUND_COLOR,
	CLOSE_COLOR,
} from "./core/constants";
import { StoryModalPublicMethods } from "./core/dto/componentsDTO";
import { ProgressStorageProps } from "./core/dto/helpersDTO";
import {
	InstagramStoriesProps,
	InstagramStoriesPublicMethods,
	InstagramStoryProps,
} from "./core/dto/instagramStoriesDTO";
import {
	clearProgressStorage,
	getProgressStorage,
	setProgressStorage,
} from "./core/helpers/storage";
import StoryModal from "./modal";
import StoryAvatar from "./storyAvatar";

const defaultStories: InstagramStoryProps[] = [
	{
		id: "user1",
		name: "User 1",
		imgUrl: "https://fyp-fans-cdn-dev.harvestangels.co/media/ANBBx_I6YgHrmyXIlhjlD_KmFsqHZ9mtnr_ma1n8AZI.png",
		stories: [
			{
				id: "story1",
				sourceUrl:
					"https://fyp-fans-cdn-dev.harvestangels.co/media/ALAdbOd3rAHDFkn-pqn6zaEUshpIPDXV5PTDlsd3o64",
			},
			{
				id: "story2",
				sourceUrl:
					"https://fyp-fans-cdn-dev.harvestangels.co/media/ALAdbOd3rAHDFkn-pqn6zaEUshpIPDXV5PTDlsd3o64",
			},
			// { id: "story2", sourceUrl: "story1-video-url", mediaType: "video" },
		],
	},
	{
		id: "user2",
		name: "User 2",
		imgUrl: "https://fyp-fans-cdn-dev.harvestangels.co/media/ALAdbOd3rAHDFkn-pqn6zaEUshpIPDXV5PTDlsd3o64",
		stories: [
			{
				id: "story1",
				sourceUrl:
					"https://fyp-fans-cdn-dev.harvestangels.co/media/ALAdbOd3rAHDFkn-pqn6zaEUshpIPDXV5PTDlsd3o64",
			},
		],
	},
];

const AnimatedStories = forwardRef<
	InstagramStoriesPublicMethods,
	InstagramStoriesProps
>(
	(
		{
			stories = defaultStories,
			saveProgress = false,
			avatarBorderColors = DEFAULT_COLORS,
			avatarSeenBorderColors = SEEN_LOADER_COLORS,
			avatarSize = AVATAR_SIZE,
			storyAvatarSize = STORY_AVATAR_SIZE,
			listContainerStyle,
			listContainerProps,
			animationDuration = ANIMATION_DURATION,
			backgroundColor = BACKGROUND_COLOR,
			showName = false,
			nameTextStyle,
			videoAnimationMaxDuration,
			videoProps,
			closeIconColor = CLOSE_COLOR,
			...props
		},
		ref,
	) => {
		const [data, setData] = useState(stories);

		const seenStories = useSharedValue<ProgressStorageProps>({});
		const loadedStories = useSharedValue(false);
		const loadingStory = useSharedValue<string | undefined>(undefined);

		const modalRef = useRef<StoryModalPublicMethods>(null);

		const onPress = (id: string) => {
			loadingStory.value = id;

			if (loadedStories.value) {
				modalRef.current?.show(id);
			}
		};

		const onLoad = () => {
			loadingStory.value = undefined;
		};

		const onStoriesChange = async () => {
			seenStories.value = await (saveProgress
				? getProgressStorage()
				: {});

			const promises = stories.map((story) => {
				const seenStoryIndex = story.stories.findIndex(
					(item) => item.id === seenStories.value[story.id],
				);
				const seenStory =
					story.stories[seenStoryIndex + 1] || story.stories[0];

				if (!seenStory) {
					return true;
				}

				return seenStory.mediaType !== "video"
					? Image.prefetch(seenStory.sourceUrl)
					: true;
			});

			await Promise.all(promises);

			loadedStories.value = true;

			if (loadingStory.value) {
				onPress(loadingStory.value);
			}
		};

		const onSeenStoriesChange = async (user: string, value: string) => {
			if (!saveProgress) {
				return;
			}

			if (seenStories.value[user]) {
				const userData = data.find((story) => story.id === user);
				const oldIndex = userData?.stories.findIndex(
					(story) => story.id === seenStories.value[user],
				);
				const newIndex = userData?.stories.findIndex(
					(story) => story.id === value,
				);

				if (oldIndex! > newIndex!) {
					return;
				}
			}

			seenStories.value = await setProgressStorage(user, value);
		};

		useImperativeHandle(
			ref,
			() => ({
				spliceStories: (newStories, index) => {
					if (index === undefined) {
						setData([...data, ...newStories]);
					} else {
						const newData = [...data];
						newData.splice(index, 0, ...newStories);
						setData(newData);
					}
				},
				spliceUserStories: (newStories, user, index) => {
					const userData = data.find((story) => story.id === user);

					if (!userData) {
						return;
					}

					const newData =
						index === undefined
							? [...userData.stories, ...newStories]
							: [...userData.stories];

					if (index !== undefined) {
						newData.splice(index, 0, ...newStories);
					}

					setData(
						data.map((value) =>
							value.id === user
								? {
										...value,
										stories: newData,
								  }
								: value,
						),
					);
				},
				setStories: (newStories) => {
					setData(newStories);
				},
				clearProgressStorage,
				hide: () => modalRef.current?.hide(),
				show: (id) => {
					if (id) {
						onPress(id);
					} else if (data[0]?.id) {
						onPress(data[0]?.id);
					}
				},
			}),
			[data],
		);

		useEffect(() => {
			onStoriesChange();
		}, [data]);

		useEffect(() => {
			setData(stories);
		}, [stories]);

		return (
			<>
				<ScrollView
					horizontal
					style={tw.style("w-full")}
					testID="storiesList"
				>
					{data.map(
						(story) =>
							story.imgUrl && (
								<StoryAvatar
									{...story}
									loadingStory={loadingStory}
									seenStories={seenStories}
									onPress={() => onPress(story.id)}
									colors={avatarBorderColors}
									seenColors={avatarSeenBorderColors}
									size={avatarSize}
									showName={showName}
									nameTextStyle={nameTextStyle}
									key={`avatar${story.id}`}
								/>
							),
					)}
				</ScrollView>
				<StoryModal
					ref={modalRef}
					stories={data}
					seenStories={seenStories}
					duration={animationDuration}
					storyAvatarSize={storyAvatarSize}
					onLoad={onLoad}
					onSeenStoriesChange={onSeenStoriesChange}
					backgroundColor={backgroundColor}
					videoDuration={videoAnimationMaxDuration}
					videoProps={videoProps}
					closeIconColor={closeIconColor}
					{...props}
				/>
			</>
		);
	},
);

export default memo(AnimatedStories);
