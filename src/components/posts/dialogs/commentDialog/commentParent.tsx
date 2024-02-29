import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { IComment, IStoryReply } from "@usertypes/types";
import React, { FC } from "react";
import Comment from "./comment";

interface Props<T extends IComment | IStoryReply> {
	data: T;
	userId: string;
	onClickReply: (commentId: string) => void;
	onClickLike: (comment: T) => void;
	onDelete: (commentId: string) => void;
	onCloseModal: () => void;
}

function CommentParent<T extends IComment | IStoryReply>(props: Props<T>) {
	const { data, onClickReply, onClickLike, onDelete, userId, onCloseModal } =
		props;

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
				onCloseModal={onCloseModal}
			>
				{data.replies.map((reply) => (
					<Comment
						data={reply}
						key={reply.id}
						onClickReply={() => {}}
						onClickLike={() => onClickLike(reply as T)}
						isChildren
						onDelete={onDelete}
						userId={userId}
						onCloseModal={onCloseModal}
					></Comment>
				))}
			</Comment>
		</FansView>
	);
}

export default CommentParent;
