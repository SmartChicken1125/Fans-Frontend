import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { IComment } from "@usertypes/types";
import React, { FC } from "react";
import Comment from "./comment";

interface Props {
	data: IComment;
	userId: string;
	onClickReply: (commentId: string) => void;
	onClickLike: (comment: IComment) => void;
	onDelete: (commentId: string) => void;
}

const CommentParent: FC<Props> = (props) => {
	const { data, onClickReply, onClickLike, onDelete, userId } = props;

	return (
		<FansView
			style={tw.style(
				"py-[18px] border-b border-fans-grey-f0 dark:border-fans-grey-43",
			)}
			border={{ b: 1 }}
		>
			<Comment
				data={data}
				onClickReply={() => onClickReply(data.id)}
				onClickLike={() => onClickLike(data)}
				onDelete={onDelete}
				userId={userId}
			>
				{data.replies.map((reply) => (
					<Comment
						data={reply}
						key={reply.id}
						onClickReply={() => {}}
						onClickLike={() => onClickLike(reply)}
						isChildren
						onDelete={onDelete}
						userId={userId}
					></Comment>
				))}
			</Comment>
		</FansView>
	);
};

export default CommentParent;
