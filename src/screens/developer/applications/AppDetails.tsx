import { EditSvg, TrashSvg } from "@assets/svgs/common";
import { AppIcon } from "@components/applications";
import { FypLink } from "@components/common/base";
import CopyText from "@components/common/copyText";
import {
	FansButton,
	FansDivider,
	FansText,
	FansTextInput,
} from "@components/controls";
import { DeveloperAddWebhookSheet } from "@components/dialogs";
import {
	getApplicationById,
	updateApplication,
	updateApplicationIcon,
} from "@helper/endpoints/application/apis";
import { ApplicationRespBody } from "@helper/endpoints/application/schemas";
import tw from "@lib/tailwind";
import { MediaType } from "@usertypes/commonEnums";
import { FansColors } from "@usertypes/enums";
import { DeveloperApplicationsNativeStackScreenProps } from "@usertypes/navigations";
import useUploadFiles from "@utils/useUploadFile";
import { MediaTypeOptions, launchImageLibraryAsync } from "expo-image-picker";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

const AppDetailsScreen = (
	props: DeveloperApplicationsNativeStackScreenProps<"AppDetails">,
) => {
	const { route } = props;
	const { id } = route.params ?? { id: "0" };

	const [application, setApplication] = useState<ApplicationRespBody>();
	const [name, setName] = useState<string>("");

	const [isAddWebhookSheetOpened, setAddWebhookSheetOpened] = useState(false);
	const { uploadFiles } = useUploadFiles();

	const handleCloseAddWebhookSheet = () => {
		setAddWebhookSheetOpened(false);
	};

	const handlePressAddWebhook = () => {
		setAddWebhookSheetOpened(true);
	};

	const fetchData = useCallback(async () => {
		if (!id) return;

		const resp = await getApplicationById({
			appId: id,
		});
		if (resp.ok) {
			setApplication(resp.data);
		}
	}, [setApplication]);

	const handleSave = async () => {
		if (!id || !application) return;
		if (name === application.name) return;

		if (name.length === 0) {
			Toast.show({
				type: "error",
				text1: "Please input your app name.",
			});
			return;
		}
		if (name.length > 30) {
			Toast.show({
				type: "error",
				text1: "Your app name is too long.",
			});
			return;
		}

		const res = await updateApplication(
			{
				name: name,
			},
			{ appId: id },
		);
		if (res.ok) {
			Toast.show({
				type: "success",
				text1: "Your Application Name Updated.",
			});
			setApplication({
				...application,
				name: name,
			});
		} else {
			Toast.show({
				type: "error",
				text1: res.data.message,
			});
		}
	};

	const onChangeIcon = async () => {
		if (!id) return;

		try {
			const result = await launchImageLibraryAsync({
				mediaTypes: MediaTypeOptions.All,
				allowsEditing: false,
				aspect: [4, 3],
				quality: 1,
				allowsMultipleSelection: false,
			});

			if (!result.canceled) {
				if (result.assets.length > 0) {
					// dispatch.setShowLoading();

					const res = await uploadFiles([
						{ uri: result.assets[0].uri, type: MediaType.Image },
					]);
					if (res?.ok) {
						const iconRes = await updateApplicationIcon({
							appId: id,
							icon: res.data[0].url as string,
						});
						if (iconRes.ok) {
							Toast.show({
								type: "success",
								text1: "Updated successfully.",
							});
							fetchData();
						} else {
							Toast.show({
								type: "error",
								text1: iconRes.data.message,
							});
						}
					}
				}
			}
		} catch (error) {
			Toast.show({
				type: "error",
				text1: "Failed picking image",
			});
		}
		// dispatch.setHideLoading();
	};

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	useEffect(() => {
		application && setName(application.name);
	}, [application]);

	return (
		<ScrollView
			style={tw.style("h-screen bg-[#FFF] py-[20px] px-[20px]")}
			showsVerticalScrollIndicator
		>
			<View style={tw.style("flex md:flex-row gap-10")}>
				<View
					style={tw.style(
						"hidden md:flex gap-5 min-w-[150px] lg:min-w-[220px] mt-[20px]",
					)}
				>
					<View
						style={tw.style(
							"w-[120px] h-[120px]",
							"lg:w-[178px] lg:h-[178px]",
							"border border-fans-grey rounded-full",
							"flex justify-center items-center",
							"self-center",
						)}
					>
						<AppIcon icon={application?.icon} size={120} />
					</View>
					<FansButton
						onPress={onChangeIcon}
						fillMode="outline"
						title="Change icon"
					/>
				</View>
				<View style={tw.style("flex-1 flex gap-[30px]")}>
					<FansText
						style={tw.style("font-inter-semibold", "text-[19px]")}
					>
						App details
					</FansText>
					<View style={tw.style("flex gap-[15px]")}>
						<FansText
							style={tw.style(
								"font-inter-semibold",
								"text-[17px]",
							)}
						>
							Name
						</FansText>
						<FansTextInput
							value={name}
							onChange={(e) => setName(e.nativeEvent.text)}
							onBlur={handleSave}
							placeholder="Your App Name.."
						/>
					</View>
					<View style={tw.style("flex md:hidden gap-[15px]")}>
						<FansText
							style={tw.style(
								"font-inter-semibold",
								"text-[17px]",
							)}
						>
							App Icon
						</FansText>
						<View
							style={tw.style(
								"w-[102px] h-[102px]",
								"border border-fans-grey rounded-full",
								"flex justify-center items-center",
								"self-center",
							)}
						>
							<AppIcon icon={application?.icon} size={102} />
						</View>
						<FansButton
							onPress={onChangeIcon}
							fillMode="outline"
							title="Change icon"
						/>
					</View>
					<View style={tw.style("flex gap-[15px]")}>
						<FansText
							style={tw.style(
								"font-inter-semibold",
								"text-[17px]",
							)}
						>
							App ID
						</FansText>
						<CopyText text={application?.id || ""} />
					</View>
					<View style={tw.style("flex gap-[15px]")}>
						<FansText
							style={tw.style(
								"font-inter-semibold",
								"text-[17px]",
							)}
						>
							Description
						</FansText>
						<FansText
							style={tw.style("text-[16px] text-fans-grey-dark")}
						>
							This information will be visible to people who've
							authorized your app
						</FansText>
						<View
							style={tw.style(
								"h-[128px]",
								"bg-fans-grey",
								"px-[20px] pt-[15px]",
								"rounded-[7px]",
							)}
						>
							<FansText style={tw.style("text-[18px]")}>
								This app was created to use the FYP.Fans API
							</FansText>
						</View>
					</View>
					<FansDivider />
					<View style={tw.style("flex gap-[15px]")}>
						<View
							style={tw.style(
								"flex-row justify-between items-center",
							)}
						>
							<FansText
								style={tw.style(
									"font-inter-semibold",
									"text-[17px]",
								)}
							>
								Description
							</FansText>
							<TouchableOpacity onPress={handlePressAddWebhook}>
								<FansText
									style={tw.style(
										"font-inter-semibold",
										"text-[17px] text-fans-purple",
									)}
								>
									+ Add webhook
								</FansText>
							</TouchableOpacity>
						</View>
						<FansText
							style={tw.style("text-[16px] text-fans-grey-dark")}
						>
							Webhooks allow external services to be notified when
							certain events happen. When the specified events
							happen, we`ll send a POST to request each of the
							URLs you provide.{" "}
							<FypLink url="/">Learn more</FypLink>
						</FansText>
						<FansText
							style={tw.style("text-[16px] text-fans-grey-dark")}
						>
							We will also send events from this repository to
							your&nbsp;
							<FypLink url="/">Webhooks Guide</FypLink>
						</FansText>
						<View>
							<View
								style={tw.style(
									"h-[70px]",
									"flex-row gap-[10px] justify-between items-center",
								)}
							>
								<View style={tw.style("grow")}>
									<FansText
										style={tw.style(
											"font-inter-semibold",
											"text-[14px]",
										)}
									>
										fyp.fans/janelove/campaign1
									</FansText>
								</View>
								<View
									style={tw.style(
										"w-[34px] h-[34px]",
										"bg-fans-grey",
										"flex justify-center items-center",
										"rounded-full",
									)}
								>
									<View style={tw.style("w-[13px] h-[13px]")}>
										<EditSvg />
									</View>
								</View>
								<View
									style={tw.style(
										"w-[34px] h-[34px]",
										"bg-fans-grey",
										"flex justify-center items-center",
										"rounded-full",
									)}
								>
									<View style={tw.style("w-[12px] h-[15px]")}>
										<TrashSvg color={FansColors.Red} />
									</View>
								</View>
							</View>
							<FansDivider />
							<View
								style={tw.style(
									"h-[70px]",
									"flex-row gap-[10px] justify-between items-center",
								)}
							>
								<View style={tw.style("grow")}>
									<FansText
										style={tw.style(
											"font-inter-semibold",
											"text-[14px]",
										)}
									>
										fyp.fans/janelove/campaign1
									</FansText>
								</View>
								<View
									style={tw.style(
										"w-[34px] h-[34px]",
										"bg-fans-grey",
										"flex justify-center items-center",
										"rounded-full",
									)}
								>
									<View style={tw.style("w-[13px] h-[13px]")}>
										<EditSvg />
									</View>
								</View>
								<View
									style={tw.style(
										"w-[34px] h-[34px]",
										"bg-fans-grey",
										"flex justify-center items-center",
										"rounded-full",
									)}
								>
									<View style={tw.style("w-[12px] h-[15px]")}>
										<TrashSvg color={FansColors.Red} />
									</View>
								</View>
							</View>
							<FansDivider />
						</View>
					</View>
				</View>
			</View>
			<DeveloperAddWebhookSheet
				open={isAddWebhookSheetOpened}
				onClose={handleCloseAddWebhookSheet}
			/>
		</ScrollView>
	);
};

export default AppDetailsScreen;
