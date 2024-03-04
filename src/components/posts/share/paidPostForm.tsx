import { CropSvg, PlusSvg, TrashSvg } from "@assets/svgs/common";
import { MediaSetImage } from "@assets/svgs/images";
import FormControl from "@components/common/FormControl";
import RoundButton from "@components/common/RoundButton";
import {
	FypNullableView,
	FypText,
	FypSvg,
	FypVideo,
} from "@components/common/base";
import { ArrowButton } from "@components/common/carousel";
import { ImageEditor } from "@components/common/imageEditor/imageEditor";
import { FansView, FansGap } from "@components/controls";
import tw from "@lib/tailwind";
import { PostType, MediaType, ResizeMode } from "@usertypes/commonEnums";
import {
	IPickerMedia,
	IPostForm,
	ISubscriptionTier,
	IRole,
} from "@usertypes/types";
import useDocumentPicker from "@utils/useDocumentPicker";
import React, { FC, useState } from "react";
import { Image } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { AccessItem } from "./paidPostAccessForm";

interface PreviewFieldProps {
	previews: IPickerMedia[];
	onAddPreviews: (medias: IPickerMedia[]) => void;
	onRemovePreview: (mediaId: string) => void;
	onChangePreview: (media: IPickerMedia) => void;
}

const PreviewField: FC<PreviewFieldProps> = (props) => {
	const { previews, onAddPreviews, onRemovePreview, onChangePreview } = props;
	const { useMediaPicker } = useDocumentPicker();

	const [width, setWidth] = useState(0);
	const [previewIndex, setPreviewIndex] = useState(0);
	const [openImageEditor, setOpenImageEditor] = useState(false);
	const offset = useSharedValue(0);

	const carouselStyles = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateX: withSpring(offset.value * width * -1, {
						damping: 90,
						stiffness: 90,
					}),
				},
			],
		};
	});

	const handlePrev = () => {
		if (previewIndex === 0 || previews.length === 0) {
			return;
		}
		setPreviewIndex(previewIndex - 1);
		offset.value = offset.value - 1;
	};

	const handleNext = () => {
		if (previewIndex === previews.length - 1 || previews.length === 0) {
			return;
		}
		setPreviewIndex(previewIndex + 1);
		offset.value = offset.value + 1;
	};

	const handlePressDropzone = async () => {
		const result = await useMediaPicker(true);
		if (result.ok) {
			const medias = result.data;
			if (medias.length > 0) {
				onAddPreviews(medias);
			}
		}
	};

	const handleRemove = () => {
		onRemovePreview(previews[previewIndex]?.id ?? "");
		if (previewIndex === previews.length - 1) {
			setPreviewIndex(previewIndex - 1);
		}
	};

	const handleImageEditingComplete = (uri: string) => {
		setOpenImageEditor(false);
		const selectedPreview = previews[previewIndex];
		if (selectedPreview) {
			onChangePreview({
				...selectedPreview,
				uri: uri,
			});
		}
	};

	return (
		<FansView onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
			<FypText fontSize={17} lineHeight={22} fontWeight={600}>
				Preview (optional)
			</FypText>
			<FansGap height={22} />

			{previews.length > 0 ? (
				<FansView>
					<FansView height={width} position="relative">
						<FansView
							position="relative"
							height="full"
							style={tw.style("relative overflow-hidden")}
						>
							<Animated.View
								style={[
									tw.style("absolute flex-row top-0"),
									carouselStyles,
								]}
							>
								{previews.map((item, index) => (
									<FansView
										key={index}
										style={{
											width: width,
											height: width,
										}}
									>
										<FansView
											borderRadius={15}
											width={width}
											height={width}
										>
											<FypNullableView
												visible={
													item.type ===
													MediaType.Image
												}
											>
												{openImageEditor ? (
													<ImageEditor
														visible={
															openImageEditor
														}
														onCloseEditor={() =>
															setOpenImageEditor(
																false,
															)
														}
														imageUri={
															previews[
																previewIndex
															]?.uri ?? ""
														}
														fixedCropAspectRatio={
															16 / 9
														}
														lockAspectRatio={false}
														minimumCropDimensions={{
															width: 100,
															height: 100,
														}}
														onEditingComplete={(
															result,
														) => {
															handleImageEditingComplete(
																result.uri,
															);
														}}
													/>
												) : (
													<Image
														source={{
															uri: item.uri,
														}}
														resizeMode="cover"
														style={tw.style(
															"w-full h-full rounded-[15px]",
														)}
													/>
												)}
											</FypNullableView>

											{item.type === MediaType.Video ? (
												<FypVideo
													id={`${item.id}-${index}`}
													source={{
														uri: item.uri ?? "",
													}}
													style={[
														tw.style(
															"w-full h-full rounded-[15px]",
														),
													]}
													resizeMode={
														ResizeMode.COVER
													}
												/>
											) : null}
										</FansView>
									</FansView>
								))}
							</Animated.View>
							<FypNullableView visible={!openImageEditor}>
								<FansView
									padding={{ x: 8, y: 4 }}
									borderRadius={20}
									position="absolute"
									top={20}
									left={18}
									style={tw.style("bg-fans-black/25")}
								>
									<FypText
										fontSize={14}
										lineHeight={19}
										color="white"
									>
										{`${previewIndex + 1}/${
											previews.length
										}`}
									</FypText>
								</FansView>
							</FypNullableView>
						</FansView>
						<FypNullableView visible={!openImageEditor}>
							<FansView
								flexDirection="row"
								alignItems="center"
								position="absolute"
								gap={16}
								padding={{ y: 9, x: 14 }}
								borderRadius={34}
								right={0}
								top={-9}
								style={tw.style(
									"bg-fans-grey-f0 dark:bg-fans-grey-43",
								)}
							>
								<FypNullableView
									visible={
										previews[previewIndex]?.type ===
										MediaType.Image
									}
								>
									<FansView
										pressableProps={{
											onPress: () =>
												setOpenImageEditor(true),
										}}
									>
										<FypSvg
											svg={CropSvg}
											width={17}
											height={17}
											color="fans-black dark:fans-white"
										/>
									</FansView>
								</FypNullableView>

								<FansView
									pressableProps={{
										onPress: handleRemove,
									}}
								>
									<FypSvg
										svg={TrashSvg}
										width={12}
										height={15}
										color="fans-red"
									/>
								</FansView>
							</FansView>
							<ArrowButton
								type="left"
								onPress={handlePrev}
								style={tw.style(
									"left-4 top-1/2 md:w-[25px] md:h-[25px] bg-fans-black/25",
								)}
								hide={
									previewIndex === 0 || previews.length === 0
								}
							/>
							<ArrowButton
								type="right"
								onPress={handleNext}
								style={tw.style(
									"right-4 top-1/2 md:w-[25px] md:h-[25px] bg-fans-black/25",
								)}
								hide={
									previewIndex === previews.length - 1 ||
									previews.length === 0
								}
							/>
						</FypNullableView>
					</FansView>
					<FansGap height={13} />
				</FansView>
			) : null}

			<FansView
				borderRadius={15}
				padding={{
					t: previews.length > 0 ? 17 : 19,
					b: previews.length > 0 ? 17 : 21,
				}}
				alignItems="center"
				style={tw.style(
					"border border-dashed border-fans-grey-de dark:border-fans-grey-50",
				)}
				pressableProps={{
					onPress: handlePressDropzone,
				}}
			>
				<FypNullableView visible={previews.length === 0}>
					<FypSvg svg={MediaSetImage} width={56} height={59} />
					<FansGap height={8} />
					<FypText fontSize={17} lineHeight={22}>
						Drop files here or{" "}
						<FypText
							fontSize={17}
							lineHeight={22}
							fontWeight={600}
							color="purple"
						>
							browse
						</FypText>
					</FypText>
				</FypNullableView>
				<FypNullableView visible={previews.length > 0}>
					<FansView
						height={47}
						width={47}
						borderRadius={47}
						alignItems="center"
						justifyContent="center"
						style={tw.style("bg-fans-black dakr:bg-fans-white")}
					>
						<FypSvg
							svg={PlusSvg}
							width={23}
							height={23}
							color="fans-white dark:fans-black-1d"
						/>
					</FansView>
					<FansGap height={8} />
					<FypText fontSize={17} lineHeight={22}>
						Browse library
					</FypText>
				</FypNullableView>
			</FansView>
		</FansView>
	);
};

interface Props {
	postForm: IPostForm;
	inProgress: boolean;
	tiers: ISubscriptionTier[];
	roles: IRole[];
	handleUpdatePostForm: (data: Partial<IPostForm>) => void;
	handlePressAccess: () => void;
	price: string;
	onChangePrice: (val: string) => void;
	previews: IPickerMedia[];
	onChangePreview: (media: IPickerMedia) => void;
	isSubmitted: boolean;
	handleSave: () => void;
	onRemovePreview: (mediaId: string) => void;
	onAddPreviews: (medias: IPickerMedia[]) => void;
}

const PaidPostForm: FC<Props> = (props) => {
	const {
		postForm,
		handleUpdatePostForm,
		inProgress,
		handlePressAccess,
		roles,
		tiers,
		price,
		previews,
		onChangePreview,
		isSubmitted,
		onChangePrice,
		handleSave,
		onRemovePreview,
		onAddPreviews,
	} = props;
	const { useImagePicker } = useDocumentPicker();
	const { roleIds, tierIds, fanUsers } = postForm.paidPostAccess;

	const handleChangeImage = async () => {
		// const result = await useImagePicker();
		// if (result.ok) {
		// 	const medias = result.data;
		// 	if (medias.length > 0) {
		// 		onChangeCoverImage(medias[0]);
		// 	}
		// }
	};

	const handleSaveData = () => {
		if (
			price === "" ||
			parseFloat(price) > 200 ||
			parseFloat(price ?? "0") < 2
		) {
			return;
		}
		handleUpdatePostForm({
			paidPost: {
				currency: "USD",
				price: price,
				thumbs: previews,
			},
		});
	};

	const handleRemoveTier = (tierId: string) => {
		handleUpdatePostForm({
			paidPostAccess: {
				roleIds,
				fanUsers,
				tierIds: tierIds.filter((el) => el !== tierId),
			},
		});
	};

	const handleRemoveRole = (roleId: string) => {
		handleUpdatePostForm({
			paidPostAccess: {
				tierIds,
				fanUsers,
				roleIds: roleIds.filter((el) => el !== roleId),
			},
		});
	};

	const handleRemoveFanUser = (userId: string) => {
		handleUpdatePostForm({
			paidPostAccess: {
				tierIds,
				roleIds,
				fanUsers: fanUsers.filter((el) => el.id !== userId),
			},
		});
	};

	return (
		<FansView>
			<FansView style={tw.style("px-[18px] md:px-0 mb-7")}>
				<FypText
					fontSize={16}
					lineHeight={21}
					style={tw.style(
						"text-center mb-11 text-fans-black dark:text-fans-white",
					)}
				>
					Charge money for your subscribers to see this post. This can
					increase your earnings
				</FypText>

				<FormControl
					label="Price (USD)"
					placeholder="e.g.25"
					value={price}
					onChangeText={onChangePrice}
					hasError={
						isSubmitted &&
						(price === "" ||
							parseFloat(price ?? "0") > 200 ||
							parseFloat(price ?? "0") < 2)
					}
					validateString={
						!price
							? "Please enter price"
							: "Price should be between $2 ~ $200"
					}
					keyboardType="numeric"
					styles="mb-7"
					onPointerLeave={handleSaveData}
				/>
				<FansView>
					<FypText
						fontSize={17}
						lineHeight={22}
						fontWeight={600}
						margin={{ b: 15 }}
					>
						Who has access
					</FypText>
					<FansView
						height={42}
						justifyContent="center"
						padding={{ l: 20 }}
						borderRadius={42}
						style={tw.style("bg-fans-grey dark:bg-fans-grey-43")}
						pressableProps={{
							onPress: handlePressAccess,
						}}
					>
						<FypText fontSize={18} fontWeight={600} lineHeight={24}>
							Add:{" "}
							<FypText
								fontSize={18}
								fontWeight={400}
								lineHeight={24}
								style={tw.style(
									"text-fans-grey-70 dark:text-fans-grey-b1",
								)}
							>
								Member/Role/Tier
							</FypText>
						</FypText>
					</FansView>
					<FansView margin={{ t: 9 }}>
						{tiers
							.filter((el) => tierIds.includes(el.id))
							.map((tier) => (
								<AccessItem
									key={tier.id}
									selected={true}
									title={tier.title}
									subTitle="0 fans"
									image={tier.cover}
									handleSelect={() =>
										handleRemoveTier(tier.id)
									}
								/>
							))}
						{roles
							.filter((el) => roleIds.includes(el.id))
							.map((role) => (
								<AccessItem
									key={role.id}
									selected={true}
									title={role.name}
									subTitle={`${role.fans} fans`}
									image={role.icon}
									role={role}
									handleSelect={() =>
										handleRemoveRole(role.id)
									}
								/>
							))}
						{fanUsers.map((user) => (
							<AccessItem
								key={user.id}
								selected={true}
								title={user.displayName ?? ""}
								subTitle={user.username}
								image={user.avatar ?? ""}
								handleSelect={() =>
									handleRemoveFanUser(user.id)
								}
							/>
						))}
					</FansView>
				</FansView>
			</FansView>

			<FypNullableView visible={postForm.type !== PostType.Text}>
				<PreviewField
					previews={previews}
					onAddPreviews={onAddPreviews}
					onRemovePreview={onRemovePreview}
					onChangePreview={onChangePreview}
				/>
				{/* <PreviewImageField
					label="Preview image (optional)"
					style="mb-7"
					onChangeImage={handleChangeImage}
					data={coverImg}
					onCancel={() =>
						onChangeCoverImage({
							uri: "",
							isPicker: true,
							type: MediaType.Image,
						})
					}
				/> */}
			</FypNullableView>
			<FansGap height={26} />

			<FansView style={tw.style("px-[18px] md:px-0 mb-13")}>
				<RoundButton onPress={handleSave} loading={inProgress}>
					Save
				</RoundButton>
			</FansView>
		</FansView>
	);
};

export default PaidPostForm;
