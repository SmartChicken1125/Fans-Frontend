import FormControl from "@components/common/FormControl";
import RoundButton from "@components/common/RoundButton";
import { FypNullableView, FypText, FypRadio } from "@components/common/base";
import { FansView, FansDivider } from "@components/controls";
import { PreviewImageField } from "@components/posts/common";
import tw from "@lib/tailwind";
import { useFeatureGates } from "@state/featureGates";
import { PostType, MediaType } from "@usertypes/commonEnums";
import {
	IPickerMedia,
	IPostForm,
	ISubscriptionTier,
	IRole,
} from "@usertypes/types";
import useDocumentPicker from "@utils/useDocumentPicker";
import React, { FC, useState } from "react";
import { AccessItem } from "./paidPostAccessForm";
import PaymentFansForm from "./paymentFansForm";

interface Props {
	postForm: IPostForm;
	inProgress: boolean;
	tiers: ISubscriptionTier[];
	roles: IRole[];
	handleUpdatePostForm: (data: Partial<IPostForm>) => void;
	handlePressAccess: () => void;
	price: string;
	onChangePrice: (val: string) => void;
	coverImg: IPickerMedia;
	onChangeCoverImage: (img: IPickerMedia) => void;
	isSubmitted: boolean;
	handleSave: () => void;
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
		coverImg,
		onChangeCoverImage,
		isSubmitted,
		onChangePrice,
		handleSave,
	} = props;
	const featureGates = useFeatureGates();
	const { useImagePicker } = useDocumentPicker();
	const { roleIds, tierIds, fanUsers } = postForm.paidPostAccess;
	const [isAllSubscribers, setIsAllSubscribers] = useState(true);

	const handleChangeImage = async () => {
		const result = await useImagePicker();
		if (result.ok) {
			const medias = result.data;
			if (medias.length > 0) {
				onChangeCoverImage(medias[0]);
			}
		}
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
				thumb: coverImg,
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
				<PreviewImageField
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
				/>
			</FypNullableView>
			{featureGates.has("2024_01-new-exclusive-post") ? (
				<FansView
					style={tw.style("px-[18px] md:px-0")}
					margin={{ b: 43 }}
				>
					<FypText
						fontSize={17}
						lineHeight={22}
						fontWeight={600}
						margin={{ b: 15 }}
					>
						Who has to pay
					</FypText>
					<FansView margin={{ b: 14 }}>
						<FansView padding={{ y: 16 }}>
							<FypRadio
								label="All subscribers"
								checked={isAllSubscribers}
								onPress={() => setIsAllSubscribers(true)}
							/>
						</FansView>
						<FansDivider />
						<FansView padding={{ y: 16 }}>
							<FypRadio
								label="Specific tiers"
								checked={!isAllSubscribers}
								onPress={() => setIsAllSubscribers(false)}
							/>
						</FansView>
					</FansView>
					{/* <PaymentFansForm collapsed={isAllSubscribers} /> */}
				</FansView>
			) : null}

			<FansView style={tw.style("px-[18px] md:px-0 mb-13")}>
				<RoundButton onPress={handleSave} loading={inProgress}>
					Save
				</RoundButton>
			</FansView>
		</FansView>
	);
};

export default PaidPostForm;
