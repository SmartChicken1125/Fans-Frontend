import { Photos1Svg, WarningCircledSvg } from "@assets/svgs/common";
import SearchTextInput from "@components/common/searchTextInput";
import {
	FansButton3,
	FansDropdown,
	FansGap,
	FansScreen3,
	FansSvg,
	FansText,
	FansTextInput5,
	FansView,
} from "@components/controls";
import { ReportModal } from "@components/modals/report";
import UserLine from "@components/posts/dialogs/userListDialog/userLine";
import SettingsNavigationHeader from "@components/screens/settings/SettingsNavigationHeader";
import SettingsNavigationLayout from "@components/screens/settings/SettingsNavigationLayout";
import { createReport } from "@helper/endpoints/creator/apis";
import { getUsers } from "@helper/endpoints/users/apis";
import { UsersRespBody } from "@helper/endpoints/users/schemas";
import tw from "@lib/tailwind";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MediaType, ReportType } from "@usertypes/commonEnums";
import { SettingsReportAbuseNativeStackParams } from "@usertypes/navigations";
import { IUserInfo } from "@usertypes/types";
import useUploadFiles, { IUploadFileParam } from "@utils/useUploadFile";
import { getDocumentAsync } from "expo-document-picker";
import { router, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Image,
	NativeScrollEvent,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";

const LIMIT_OF_FILES = 1;

interface File {
	uri?: string;
	name: string;
	type: string;
}

const REPORT_FLAG = [
	{ code: ReportType.ILLEGAL_CONTENT, text: "Illegal content" },
	{ code: ReportType.UNDERAGE_USER, text: "Underage user" },
	{
		code: ReportType.IMPERSONATION_OR_IDENTITY_THEFT,
		text: "Impersonation or identity theft",
	},
	{
		code: ReportType.PROMOTING_HATE_SPEECH_OR_DISCRIMINATION,
		text: "Promoting hate speech or discrimination",
	},
	{
		code: ReportType.PROMOTING_DANGEROUS_BEHAVIORS,
		text: "Promoting dangerous behaviors",
	},
	{
		code: ReportType.INVOLVED_IN_SPAN_OR_SCAM_ACTIVITIES,
		text: "Involved in spam or scam activities",
	},
	{
		code: ReportType.UNDERAGE_USER,
		text: "Infringement of my copyright",
	},
	{ code: ReportType.OTHER, text: "Other" },
];

const Stack =
	createNativeStackNavigator<SettingsReportAbuseNativeStackParams>();

const SettingsReportAbuseNativeStack = () => {
	const router = useRouter();

	return (
		<Stack.Navigator
			initialRouteName="REPORTABUSE"
			screenOptions={{
				header: (props) => SettingsNavigationHeader(props, router),
			}}
		>
			<Stack.Screen
				name="REPORTABUSE"
				component={ReportAbuseContentView}
				options={{ title: "Report abuse" }}
			/>
		</Stack.Navigator>
	);
};

const ReportAbuseContentView = () => {
	const [files, setFiles] = useState<File[]>([]);
	const [isReportModalVisible, setReportModalVisible] = useState(false);

	const [isLoading, setIsLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [users, setUsers] = useState<UsersRespBody>({
		users: [],
		page: 1,
		total: 0,
		size: 10,
	});
	const [isSearching, setIsSearching] = useState(false);
	const [selectedUser, setSelectedUser] = useState<IUserInfo | null>(null);
	const [selectedReason, setSelectedReason] = useState("");
	const [issue, setIssue] = useState("");

	const handleCloseReportModal = () => {
		setReportModalVisible(false);
	};

	const handlePressContact = () => {
		window.open("https://support.fyp.fans/", "_blank");
	};

	const handlePressReport = () => {
		if (
			selectedUser !== null &&
			searchQuery === selectedUser?.username &&
			selectedReason !== ""
		) {
			setReportModalVisible(true);
		}
	};

	const onUpload = async () => {
		const result = await getDocumentAsync({
			type: "image/*", // Specify that only image files are allowed
			multiple: true, // Allow multiple file selection
		});

		if (!result.canceled && result.output) {
			const filesArray: File[] = [];

			if (result.output instanceof FileList) {
				for (
					let i = 0;
					i < Math.min(result.output.length, LIMIT_OF_FILES);
					i++
				) {
					const file = result.output[i];
					filesArray.push({
						name: file.name,
						type: file.type || "",
						uri: URL.createObjectURL(file),
					});
				}
			}

			setFiles(filesArray);
		}
	};

	const onChangeSearch = (query: string) => {
		setSearchQuery(query);
		setUsers({
			...users,
			page: 1,
			total: 0,
		});
	};

	const fetchUsers = async () => {
		const params = {
			page: users.page,
			size: 10,
			query: searchQuery,
		};
		const resp = await getUsers(params);
		if (resp.ok) {
			setUsers({
				...resp.data,
				users:
					resp.data.page === 1
						? resp.data.users
						: [...users.users, ...resp.data.users],
			});
		}
		setIsLoading(false);
	};

	const onScrollView = (nativeEvent: NativeScrollEvent) => {
		const paddingToBottom = 20;
		const isScrollEnd =
			nativeEvent.layoutMeasurement.height +
				nativeEvent.contentOffset.y >=
			nativeEvent.contentSize.height - paddingToBottom;
		if (isScrollEnd && !isLoading) {
			if (users.total > 10 * users.page) {
				setIsLoading(true);
				setUsers({
					...users,
					page: users.page + 1,
				});
			}
		}
	};

	useEffect(() => {
		setSearchQuery("");
	}, []);

	useEffect(() => {
		if (searchQuery.length > 0) {
			fetchUsers();
		} else {
			setUsers({
				...users,
				users: [],
				page: 1,
				total: 0,
			});
		}
	}, [searchQuery, users.page]);

	const { uploadFiles, progress, cancelUpload, isUploading } =
		useUploadFiles();
	const [inProgress, setInProgress] = useState(false);

	const handleSubmit = async () => {
		handleCloseReportModal();

		setInProgress(true);

		const fileParams: IUploadFileParam[] = files.map((uri) => ({
			uri: uri.uri ?? "",
			type: MediaType.Image,
		}));
		const uploadResp = await uploadFiles(fileParams);
		if (fileParams.length > 0 && !uploadResp.ok) {
			Toast.show({
				type: "error",
				text1: uploadResp.errorString ?? "Failed to upload files",
			});
			setInProgress(false);
			return;
		}

		const res = await createReport({
			userId: selectedUser?.id ?? "",
			flag: REPORT_FLAG.find((e) => e.text === selectedReason)!.code,
			reason: issue,
			image: uploadResp.data[0]?.url,
		});

		setInProgress(false);

		if (res.ok) {
			router.push("/");
		} else {
			Toast.show({
				type: "error",
				text1: res.data.message,
			});
		}
	};

	return (
		<FansScreen3 contentStyle1={{ maxWidth: { lg: 670 } }}>
			<FansGap height={{ lg: 40 }} />
			<FansText fontSize={16} textAlign="center">
				Please report any user violations of our{" "}
				<FansText color="purple" textDecorationLine="underline">
					Acceptable Use Policy
				</FansText>{" "}
				using the form{"\n"}below. We will promptly investigate and
				remove any offending content.
			</FansText>
			<FansGap height={26} />
			<FansView
				backgroundColor="purple-f6"
				borderRadius={15}
				padding={{ t: 17, r: 19, b: 21, l: 20 }}
			>
				<FansText color="purple-a8" fontSize={16} textAlign="center">
					<FansSvg
						width={14.23}
						height={14.23}
						svg={WarningCircledSvg}
					/>{" "}
					Should you encounter illegal activity or immediate danger,
					please prioritize contacting your local authorities. They’re
					best suited to provide urgent assistance
				</FansText>
			</FansView>
			<FansGap height={40} />
			{/* User you wish to report ~ */}
			<FansView gap={16} style={{ zIndex: 1 }}>
				<FansText fontFamily="inter-bold" fontSize={17}>
					User you wish to report
				</FansText>

				<FansView
					flexDirection="row"
					alignItems="center"
					gap={19}
					margin={{ b: 24 }}
				>
					<FansView flex="1">
						<SearchTextInput
							value={searchQuery}
							onChangeText={onChangeSearch}
							onFocus={(e) => {
								setIsSearching(true);
							}}
						/>

						<FansView
							style={tw.style(
								`absolute bg-white top-100% left-0 right-0 h-[${
									67 * Math.min(users.users.length, 5)
								}px] ${isSearching ? "" : "hidden"}`,
							)}
						>
							<ScrollView
								showsVerticalScrollIndicator={true}
								onScroll={({ nativeEvent }) =>
									onScrollView(nativeEvent)
								}
								scrollEventThrottle={30}
								style={tw.style("w-full h-full")}
							>
								{users.users.map((user) => (
									<FansView
										style={{
											paddingHorizontal: 15,
										}}
										pressableProps={{
											onPress: () => {
												setSearchQuery(user.username);
												setSelectedUser(user);
												setIsSearching(false);
											},
										}}
									>
										<UserLine
											avatar={user.avatar ?? ""}
											username={user.username}
											displayName={user.displayName}
											key={user.username}
										/>
									</FansView>
								))}
							</ScrollView>
						</FansView>
					</FansView>
				</FansView>
			</FansView>
			{/* ~ User you wish to report */}
			<FansGap height={32} />
			{/* Reason ~ */}
			<FansView gap={15}>
				<FansText fontFamily="inter-bold" fontSize={17}>
					Reason
				</FansText>
				<FansDropdown
					data={REPORT_FLAG}
					onSelect={(value) => {
						setSelectedReason(value.text);
					}}
				/>
			</FansView>
			{/* ~ Reason */}
			<FansGap height={32} />
			<FansText style={tw.style("font-inter-bold", "text-[17px]")}>
				Issue
			</FansText>
			<FansGap height={15} />
			<FansTextInput5
				height={128}
				viewStyle={{ borderRadius: 7, padding: { t: 13 } }}
				textInputStyle={{
					multiline: true,
					placeholder: "Briefly describe the issue",
				}}
				value={issue}
				onChangeText={setIssue}
			/>
			<FansGap height={33.4} />
			<FansText style={tw.style("font-inter-bold", "text-[17px]")}>
				Add image
			</FansText>
			<FansGap height={15} />
			<TouchableOpacity onPress={onUpload}>
				<FansView
					style={tw.style(
						"h-[162px]",
						"border border-fans-grey-dark border-dashed rounded-[7px]",
						"flex justify-center items-center",
					)}
				>
					<FansSvg width={77.44} height={70.96} svg={Photos1Svg} />
					<FansGap height={13.3} />
					<FansText style={tw.style("text-[17px]")}>
						Drop image here or{" "}
						<FansText
							style={tw.style(
								"font-inter-semibold",
								"text-[17px] text-fans-purple",
							)}
						>
							browse
						</FansText>
					</FansText>
				</FansView>
			</TouchableOpacity>
			{files.length !== 0 && <FansGap height={21} />}
			{files.length !== 0 && (
				<FansView style={tw.style("flex flex-row flex-wrap")}>
					{files.map((file, index) => (
						<FansView
							key={index}
							style={tw.style(
								"w-[77.44px] h-[70.96px] m-2",
								"border border-fans-grey-dark rounded-[7px]",
							)}
						>
							{/* Assuming file.type.startsWith("image/") for image files */}
							{file.type.startsWith("image/") ? (
								<Image
									source={{
										uri: file.uri,
									}}
									style={tw.style("flex-1 rounded-[7px]")}
									resizeMode="cover"
								/>
							) : (
								<FansText style={tw.style("text-[17px]")}>
									{file.name}
								</FansText>
							)}
						</FansView>
					))}
				</FansView>
			)}

			<FansGap height={33.6} />
			<FansButton3
				title="Report"
				onPress={handlePressReport}
				disabled={
					selectedUser === null ||
					searchQuery !== selectedUser?.username ||
					selectedReason === ""
				}
			/>
			<FansGap height={16.4} />
			<FansText
				style={tw.style(
					"font-inter-semibold",
					"text-[17px] text-center leading-[25px]",
				)}
			>
				Need help?{"\n"}
				<FansView
					touchableOpacityProps={{
						onPress: handlePressContact,
					}}
				>
					<FansText
						color="purple-a8"
						fontFamily="inter-semibold"
						fontSize={17}
					>
						Contact
					</FansText>
				</FansView>{" "}
				our 24/7 support team
			</FansText>

			<ReportModal
				username={selectedUser?.username}
				visible={isReportModalVisible}
				onClose={handleCloseReportModal}
				onSubmit={handleSubmit}
			/>

			{inProgress && (
				<ActivityIndicator
					animating={true}
					color="#a854f5"
					style={[
						tw.style("absolute top-1/2 left-1/2"),
						{
							transform: [
								{
									translateX: -12,
								},
								{
									translateY: -12,
								},
							],
						},
					]}
				/>
			)}
		</FansScreen3>
	);
};

const ReportAbuseScreen = () => {
	return SettingsNavigationLayout(<SettingsReportAbuseNativeStack />);
};

export default ReportAbuseScreen;
