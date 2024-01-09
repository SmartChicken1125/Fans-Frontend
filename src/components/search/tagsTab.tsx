import { tagsData } from "@assets/dummyData/post";
import { ITag } from "@usertypes/types";
import React, { FC, useState, useEffect } from "react";
import { ScrollView } from "react-native";
import Tag from "./tag";

interface Props {
	searchKey: string;
	onClickTag: () => void;
}

const TagsTab: FC<Props> = (props) => {
	const { searchKey, onClickTag } = props;

	const [searchResult, setSearchResult] = useState<ITag[]>([]);

	useEffect(() => {
		setSearchResult(
			tagsData.filter((tag) => tag.title.includes(searchKey)),
		);
	}, [searchKey]);

	return (
		<ScrollView
			contentContainerStyle={{
				paddingHorizontal: 18,
			}}
		>
			{searchResult.map((tag) => (
				<Tag data={tag} key={tag.id} onClick={onClickTag} />
			))}
		</ScrollView>
	);
};

export default TagsTab;
