import {
	FypNullableView,
	FypHorizontalScrollView2,
} from "@components/common/base";
import { FansView } from "@components/controls";
import { ISocialLink } from "@usertypes/types";
import React, { FC } from "react";
import SocialLink from "./socialLink";

interface Props {
	data: ISocialLink[];
	onClickLink: (url: string) => void;
}

const SocialLinkList: FC<Props> = (props) => {
	const { data, onClickLink } = props;

	return (
		<FansView margin={{ b: 24 }}>
			<FypNullableView
				visible={data.filter((el) => el.url !== "").length > 0}
			>
				<FypHorizontalScrollView2>
					<FansView flexDirection="row" gap={5}>
						{data
							.filter((el) => el.url !== "")
							.map((social) => (
								<SocialLink
									key={social.id}
									data={social}
									onPress={() => onClickLink(social.url)}
								/>
							))}
					</FansView>
				</FypHorizontalScrollView2>
			</FypNullableView>
		</FansView>
	);
};

export default SocialLinkList;
