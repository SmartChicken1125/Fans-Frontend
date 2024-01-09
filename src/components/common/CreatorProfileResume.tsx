import { OutlinedDollarSvg, ClockSvg, Clock1Svg } from "@assets/svgs/common";
import AvatarWithStatus from "@components/common/AvatarWithStatus";
import { FansView, FansGap, FansText, FansDivider } from "@components/controls";
import tw from "@lib/tailwind";
import { Colors } from "@usertypes/enums";
import React from "react";
import { View, Text, Image, StyleSheet, Platform } from "react-native";

interface CreatorProfileResumeProps {
	username: string;
	description: string;
	availability: string;
	priceRange: string;
	avatarSrc?: string;
}

const CreatorProfileResume: React.FC<CreatorProfileResumeProps> = ({
	username,
	description,
	availability,
	priceRange,
	avatarSrc,
}) => {
	const isMobile = Platform.OS === "ios" || Platform.OS === "android";
	// Mobile version

	if (isMobile) {
		return (
			<View style={{ flexDirection: "row", alignItems: "center" }}>
				<View
					style={{
						flex: 1,
						alignItems: "center",
						justifyContent: "flex-start",
					}}
				>
					<AvatarWithStatus size={95} avatar={avatarSrc} />
				</View>
				<View style={{ flex: 3 }}>
					<View>
						<FansText fontFamily="inter-bold" fontSize={28}>
							{username}
						</FansText>
						<FansText fontSize={16}>{description}</FansText>
					</View>
					<View style={{ flexDirection: "row", marginTop: 10 }}>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "flex-start",
							}}
						>
							<FansText fontFamily="inter-bold" fontSize={15}>
								{availability.toUpperCase()}
							</FansText>
						</View>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "flex-start",
							}}
						>
							<FansText fontFamily="inter-bold" fontSize={15}>
								{priceRange}
							</FansText>
						</View>
					</View>
				</View>
			</View>
		);
	} else {
		// Desktop layout
		return (
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "flex-start",
				}}
			>
				<View
					style={{
						flex: 1,
						alignItems: "center",
						justifyContent: "flex-start",
					}}
				>
					<AvatarWithStatus size={120} avatar={avatarSrc} />
				</View>
				<View style={{ flex: 3 }}>
					<View>
						<FansText fontFamily="inter-bold" fontSize={32}>
							{username}
						</FansText>
						<FansGap width={11} />
						<FansText fontSize={18}>{description}</FansText>
					</View>
					<View style={{ flexDirection: "row", marginTop: 10 }}>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "flex-start",
							}}
						>
							<FansView style={{ width: 21, height: 21 }}>
								<Clock1Svg size={36} color={Colors.Purple} />
							</FansView>
							<View style={{ paddingLeft: 10 }}>
								<FansText fontFamily="inter-bold" fontSize={18}>
									{availability.toUpperCase()}
								</FansText>
							</View>
						</View>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "flex-start",
								//marginLeft: 20,
							}}
						>
							<FansView style={{ width: 21, height: 21 }}>
								<OutlinedDollarSvg
									size={36}
									color={Colors.Purple}
								/>
							</FansView>
							<View style={{ paddingLeft: 10 }}>
								<FansText fontFamily="inter-bold" fontSize={18}>
									{priceRange.toUpperCase() + " PRICES"}
								</FansText>
							</View>
						</View>
					</View>
				</View>
			</View>
		);
	}
};

export default CreatorProfileResume;
