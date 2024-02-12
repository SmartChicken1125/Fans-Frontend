import { MediaType, SortType } from "@usertypes/commonEnums";

export type IdParams = {
	id: string;
};

export type PaginationParams = {
	page?: number;
	size?: number;
};

export type NameQueryParams = PaginationParams & { name?: string };
export interface IQuery {
	page?: number;
	size?: number;
	query?: string;
}

export interface IPostFilterQuery {
	page: number;
	size: number;
	sort?: SortType;
	categoryId?: string;
	schedule?: boolean;
}
export interface IMediaFilterQuery {
	page: number;
	size: number;
	type?: MediaType | string;
	sort?: "newest" | "latest";
}
