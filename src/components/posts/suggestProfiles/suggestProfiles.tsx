import { ChevronLeftSvg, ChevronRightSvg } from "@assets/svgs/common";
import { FypSvg, FypText } from "@components/common/base";
import { FansView } from "@components/controls";
import { getSuggestedProfiles } from "@helper/endpoints/profile/apis";
import tw from "@lib/tailwind";
import { IProfile } from "@usertypes/types";
import React, { useEffect, useState } from "react";
import SuggestProfile from "./suggestProfile";

const SuggestProfiles = () => {
	const [profiles, setProfiles] = useState<IProfile[]>([]);
	const [pages, setPages] = useState(0);
	const [page, setPage] = useState(0);

	const fetchSuggestedProfiles = async () => {
		const resp = await getSuggestedProfiles();
		if (resp.ok) {
			setProfiles(resp.data.profiles);
			setPages(Math.ceil(resp.data.profiles.length / 3));
			setPage(0);
		}
	};

	useEffect(() => {
		fetchSuggestedProfiles();
	}, []);

	return (
		<FansView padding={{ x: 18 }}>
			<FansView
				flexDirection="row"
				alignItems="center"
				justifyContent="between"
				margin={{ b: 20 }}
			>
				<FypText
					fontSize={19}
					lineHeight={26}
					fontWeight={700}
					style={tw.style("text-fans-black dark:text-fans-white")}
				>
					Suggested Profiles
				</FypText>

				<FansView flexDirection="row" gap={16}>
					<FansView
						width={15}
						height={15}
						alignItems="center"
						justifyContent="center"
						touchableOpacityProps={{
							disabled: page === 0,
							onPress: () => setPage(page - 1),
						}}
					>
						<FypSvg
							width={9}
							height={15}
							svg={ChevronLeftSvg}
							color={
								page === 0
									? "fans-grey-f0 dark:fans-grey-43"
									: "fans-grey-70 dark:fans-grey-b1"
							}
						/>
					</FansView>

					<FansView
						touchableOpacityProps={{
							disabled: page === pages - 1,
							onPress: () => setPage(page + 1),
						}}
						width={15}
						height={15}
						alignItems="center"
						justifyContent="center"
					>
						<FypSvg
							width={9}
							height={15}
							svg={ChevronRightSvg}
							color="fans-grey-70 dark:fans-grey-b1"
						/>
					</FansView>
				</FansView>
			</FansView>

			<FansView gap={10}>
				{profiles.slice(page * 3, (page + 1) * 3).map((profile) => (
					<SuggestProfile data={profile} key={profile.id} />
				))}
			</FansView>
		</FansView>
	);
};

export default SuggestProfiles;
