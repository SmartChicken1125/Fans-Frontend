import { Photos1Svg, Search1Svg, WarningCircledSvg } from "@assets/svgs/common";
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
import { JoinProgramCard } from "@components/refer";
import SettingsNavigationHeader from "@components/screens/settings/SettingsNavigationHeader";
import SettingsNavigationLayout from "@components/screens/settings/SettingsNavigationLayout";
import tw from "@lib/tailwind";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SettingsReportAbuseNativeStackParams } from "@usertypes/navigations";
import { getColorStyle } from "@usertypes/styles";
import { useRouter } from "expo-router";
import React, { useState } from "react";

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
	const [isReportModalVisible, setReportModalVisible] = useState(false);
	/*return (
		<ScrollView>
			<View style={tw.style("flex-column gap-[20px]", "m-[15px]")}>
				<View>
					<Text>User you wish to report</Text>
				</View>
				<View style={tw.style("flex-row gap-[10px] items-center")}>
					<Checkbox status="checked" />
					<Image source={require("@assets/images/default-avatar.png")} />
					<View>
						<Text>Jane Love</Text>
						<Text>@janelove</Text>
					</View>
				</View>
				<View style={tw.style("flex-row gap-[10px] items-center")}>
					<Checkbox status="unchecked" />
					<Image source={require("@assets/images/default-avatar.png")} />
					<View>
						<Text>Jane Love</Text>
						<Text>@janelove</Text>
					</View>
				</View>
				<View style={tw.style("flex-row gap-[10px] items-center")}>
					<Checkbox status="unchecked" />
					<Image source={require("@assets/images/default-avatar.png")} />
					<View>
						<Text>Jane Love</Text>
						<Text>@janelove</Text>
					</View>
				</View>
				<View style={tw.style("flex-row gap-[10px] items-center")}>
					<Checkbox status="unchecked" />
					<Image source={require("@assets/images/default-avatar.png")} />
					<View>
						<Text>Jane Love</Text>
						<Text>@janelove</Text>
					</View>
				</View>
				<View style={tw.style("flex-row gap-[10px] items-center")}>
					<Checkbox status="unchecked" />
					<Image source={require("@assets/images/default-avatar.png")} />
					<View>
						<Text>Jane Love</Text>
						<Text>@janelove</Text>
					</View>
				</View>
			</View>
		</ScrollView>
	);*/

	const handleCloseReportModal = () => {
		setReportModalVisible(false);
	};

	const handlePressContact = () => {
		window.open("https://support.fyp.fans/", "_blank");
	};

	const handlePressReport = () => {
		setReportModalVisible(true);
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
			<FansView gap={16}>
				<FansText fontFamily="inter-bold" fontSize={17}>
					User you wish to report
				</FansText>
				<FansTextInput5
					iconNode={
						<FansSvg
							width={13.14}
							height={13.26}
							svg={Search1Svg}
						/>
					}
					textInputStyle={{
						placeholder: "Search user",
						placeholderTextColor: getColorStyle("black"),
					}}
				/>
			</FansView>
			{/* ~ User you wish to report */}
			<FansGap height={32} />
			{/* Reason ~ */}
			<FansView gap={15}>
				<FansText fontFamily="inter-bold" fontSize={17}>
					Reason
				</FansText>
				<FansDropdown
					data={[
						{ text: "Underage User" },
						{ text: "Illegal Content" },
						{ text: "Impersonation or Identity Theft" },
						{ text: "Promoting Hate Speech" },
						{ text: "Promoting Violence" },
						{ text: "Profile involved in Spam" },
						{ text: "Infringement of My Rights" },
						{ text: "Other" },
					]}
					onSelect={() => {}}
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
			/>
			<FansGap height={33.4} />
			<FansText style={tw.style("font-inter-bold", "text-[17px]")}>
				Add image
			</FansText>
			<FansGap height={15} />
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
			<FansGap height={33.6} />
			<FansButton3 title="Report" onPress={handlePressReport} />
			<FansGap height={16.4} />
			<FansText
				style={tw.style(
					"font-inter-semibold",
					"text-[17px] text-center leading-[25px]",
				)}
			>
				Need help?{"\n"}
				<FansView
					touchableOpacityProps={{ onPress: handlePressContact }}
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
				visible={isReportModalVisible}
				onClose={handleCloseReportModal}
				onSubmit={() => {}}
			/>
		</FansScreen3>
	);
};

const ReportAbuseScreen = () => {
	return SettingsNavigationLayout(<SettingsReportAbuseNativeStack />);
};

export default ReportAbuseScreen;
