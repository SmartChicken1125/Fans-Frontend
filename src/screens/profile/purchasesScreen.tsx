import { postsData } from "@assets/dummyData/post";
import CustomTopNavBar from "@components/common/customTopNavBar";
import AppLayout from "@components/common/layout";
import SearchTextInput from "@components/common/searchTextInput";
import { FansView } from "@components/controls";
import { FilterButton } from "@components/posts/common";
import PostCard from "@components/posts/postCard";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StorageKeyTypes } from "@usertypes/commonEnums";
import { ProfileNavigationStacks } from "@usertypes/navigations";
import { getStorage } from "@utils/storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView } from "react-native";

const PurchasesScreen = (
	props: NativeStackScreenProps<ProfileNavigationStacks, "Purchases">,
) => {
	const { navigation } = props;
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");

	const handlePressPrev = async () => {
		// const redirectUrl =
		// 	(await getStorage(StorageKeyTypes.PreviousUrl)) ?? "/posts";
		// router.replace(redirectUrl);
		navigation.goBack();
	};

	return (
		<AppLayout
			title="Edit Profile | FYP.Fans"
			description="FYP.Fans allows creators to make an income doing what they love!"
		>
			<FansView flex="1">
				<ScrollView style={tw.style("flex-1")}>
					<FansView style={tw.style("md:px-[140px]")}>
						<CustomTopNavBar
							title="Purchases"
							onClickLeft={handlePressPrev}
						/>
						<FansView
							style={tw.style(
								"pt-6 md:pt-[46px] w-full md:max-w-[674px] md:mx-auto",
							)}
						>
							<FansView style={tw.style("px-[18px] md:px-0")}>
								<SearchTextInput
									value={searchQuery}
									onChangeText={setSearchQuery}
									placeholder="Search product"
								/>
							</FansView>

							<FansView
								flexDirection="row"
								gap={7}
								margin={{ b: 38, t: 16 }}
								style={tw.style("px-[18px] md:px-0")}
							>
								<FilterButton
									title="Digital Library"
									onClick={() => {}}
									isSelected={true}
								/>
							</FansView>
							<FansView gap={18}>
								<PostCard
									data={postsData[0]}
									purchaseCard
									onClickUnlock={() => {}}
									onClickBookmark={() => {}}
									onClickLike={() => {}}
									onClickActionMenu={() => {}}
									onClickMessage={() => {}}
									onClickComment={() => {}}
								/>
							</FansView>
						</FansView>
					</FansView>
				</ScrollView>
			</FansView>
		</AppLayout>
	);
};

export default PurchasesScreen;
