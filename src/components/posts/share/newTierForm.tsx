import { ListMarkSvg } from "@assets/svgs/common";
import FormControl from "@components/common/FormControl";
import RoundButton from "@components/common/RoundButton";
import RoundTextInput from "@components/common/RoundTextInput";
import { FypSvg, FypText } from "@components/common/base";
import FileDropzone from "@components/common/fileDropzone";
import { FansView } from "@components/controls";
import { TierPerk } from "@components/profiles";
import { defaultPickerMedia } from "@constants/common";
import { defaultTierFormData } from "@constants/defaultFormData";
import { cdnURL } from "@helper/Utils";
import { createTier } from "@helper/endpoints/profile/apis";
import tw from "@lib/tailwind";
import { MediaType } from "@usertypes/commonEnums";
import { IPickerMedia, ISubscriptionTier } from "@usertypes/types";
import useDocumentPicker from "@utils/useDocumentPicker";
import useUploadFiles from "@utils/useUploadFile";
import React, { FC, useState } from "react";
import { Image } from "react-native";
import Toast from "react-native-toast-message";

interface Props {
	onCreateCallback: (tier: ISubscriptionTier) => void;
}

const NewTierForm: FC<Props> = (props) => {
	const { onCreateCallback } = props;
	const { uploadFiles } = useUploadFiles();
	const { useImagePicker } = useDocumentPicker();

	const [tierForm, setTierForm] =
		useState<ISubscriptionTier>(defaultTierFormData);
	const [coverImg, setCoverImg] = useState<IPickerMedia>(defaultPickerMedia);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [inProgress, setInProgress] = useState(false);

	const onChange = (name: string, value: string) => {
		setTierForm({
			...tierForm,
			[name]: value,
		});
	};

	const onChangePerk = (index: number, val: string) => {
		const perks = tierForm.perks;
		setTierForm({
			...tierForm,
			perks: perks.map((el, i) => (i === index ? val : el)),
		});
	};

	const onDeletePerk = (index: number) => {
		const perks = tierForm.perks;
		setTierForm({
			...tierForm,
			perks: perks.filter((el, i) => i !== index),
		});
	};

	const handleAddNewPerk = () => {
		setTierForm({
			...tierForm,
			perks: [...tierForm.perks, ""],
		});
	};

	const onPickDocument = async () => {
		const result = await useImagePicker();
		if (result.ok) {
			const medias = result.data;
			if (medias.length > 0) {
				setCoverImg(medias[0]);
			}
		} else {
			Toast.show({
				type: "error",
				text1: result?.message ?? "",
			});
		}
	};

	const handleSave = async () => {
		setIsSubmitted(true);
		if (
			tierForm.title === "" ||
			tierForm.price === "" ||
			parseFloat((tierForm.price as string) ?? "") > 200 ||
			tierForm.description === "" ||
			tierForm.perks.length === 0
		) {
			return;
		}
		setInProgress(true);

		let newCoverImg = coverImg.uri;
		if (coverImg.isPicker && coverImg.uri) {
			const resp = await uploadFiles([
				{ uri: coverImg.uri, type: MediaType.Image },
			]);
			if (resp.ok) {
				newCoverImg = resp.data[0].url;
			} else {
				newCoverImg = "";
			}
		}

		const resp = await createTier({
			...tierForm,
			price: parseFloat(tierForm.price as string),
			cover: newCoverImg,
		});

		if (resp.ok) {
			onCreateCallback({
				id: resp.data.id,
				title: resp.data.title,
				currency: resp.data.currency,
				description: resp.data.description,
				cover: resp.data.cover,
				perks: resp.data.perks,
				price: resp.data.price.toString(),
			});
		} else {
			Toast.show({
				type: "error",
				text1: "Failed to create tier",
			});
		}

		setInProgress(false);
	};

	return (
		<FansView>
			<FormControl
				value={tierForm.title}
				placeholder="e.g.Diamond"
				onChangeText={(val: string) => onChange("title", val)}
				styles="mb-8"
				label="Tier name"
				hasError={isSubmitted && tierForm.title === ""}
				validateString="required field"
			/>

			<FormControl
				value={tierForm.price as string}
				placeholder="e.g.0"
				onChangeText={(val: string) => onChange("price", val)}
				styles="mb-8"
				label="Cost per month (USD)"
				keyboardType="numeric"
				hasError={
					(isSubmitted && tierForm.price === "") ||
					parseFloat((tierForm.price as string) ?? "") > 200
				}
				validateString={
					tierForm.price === ""
						? "required field"
						: "Price should be max $200"
				}
			/>

			<FansView margin={{ b: 36 }}>
				<FypText
					fontSize={17}
					lineHeight={22}
					fontWeight={600}
					margin={{ b: 15 }}
					style={tw.style("text-fans-black dark:text-fans-white")}
				>
					Tier description
				</FypText>
				<RoundTextInput
					value={tierForm.description}
					onChangeText={(val) => onChange("description", val)}
					placeholder="Write a description..."
					multiline
					numberOfLines={4}
					maxLength={100}
					customStyles="py-3 px-5 rounded-[7px] h-[128px]"
					hasError={isSubmitted && tierForm.description === ""}
				/>
			</FansView>

			<FansView margin={{ b: 16 }}>
				<FypText
					fontSize={17}
					lineHeight={22}
					margin={{ b: 15 }}
					style={tw.style(
						isSubmitted && tierForm.perks.length === 0
							? "red"
							: "text-fans-black dark:text-fans-white",
					)}
				>
					Tier perks
				</FypText>

				<FansView style={tw.style("gap-y-3")}>
					{tierForm.perks.map((el, index) => (
						<TierPerk
							key={index}
							value={el}
							onCancel={() => onDeletePerk(index)}
							onChange={(val) => onChangePerk(index, val)}
						/>
					))}
				</FansView>
				<FansView
					margin={{ t: 12 }}
					padding={{ l: 42 }}
					style={tw.style(tierForm.perks.length > 9 && "hidden")}
				>
					<FansView
						height={42}
						flexDirection="row"
						alignItems="center"
						padding={{ l: 44 }}
						borderRadius={42}
						style={tw.style("bg-[rgba(240,240,240,0.4)]")}
						pressableProps={{
							onPress: handleAddNewPerk,
						}}
					>
						<FansView position="absolute" left={18}>
							<FypSvg
								svg={ListMarkSvg}
								width={14.88}
								height={14.89}
								color="fans-grey-70/50 dark:fans-grey-b1/50"
							/>
						</FansView>
						<FypText
							fontSize={18}
							lineHeight={24}
							style={tw.style(
								"text-fans-black/50 dark:text-fans-white/50",
							)}
						>
							Add perk
						</FypText>
					</FansView>
				</FansView>
			</FansView>

			<FansView margin={{ b: 36 }}>
				<FypText
					fontSize={17}
					lineHeight={22}
					fontWeight={600}
					margin={{ b: 15 }}
					style={tw.style("text-fans-black dark:text-fans-white")}
				>
					Cover image
				</FypText>
				<FansView>
					{coverImg.uri ? (
						<Image
							source={{
								uri: coverImg.isPicker
									? coverImg.uri
									: cdnURL(coverImg.uri),
							}}
							style={tw.style("w-full h-[390px] mb-4")}
							resizeMode="cover"
						/>
					) : null}
					<FileDropzone fileCounts={0} onPress={onPickDocument} />
				</FansView>
			</FansView>

			<RoundButton onPress={handleSave} loading={inProgress}>
				Save tier
			</RoundButton>
		</FansView>
	);
};

export default NewTierForm;
