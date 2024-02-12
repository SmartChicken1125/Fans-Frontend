import { MediaType, UploadUsageType } from "@usertypes/commonEnums";
import { IMedia, IUpload } from "@usertypes/types";

export interface MediaUploadReqBody {
	type: string;
}

export interface MediaUploadRespBody {
	paths: string[];
}

export interface MediaTypeParam {
	type: MediaType;
}

export interface MediasRespBody {
	medias: IMedia[];
	page: number;
	size: number;
	total: number;
	videoTotal: number;
	imageTotal: number;
}

export interface GeneratePresignedUrlReqBody {
	usage: UploadUsageType;
	origin?: string;
}

export interface PresignedUrlRespBody extends IUpload {
	presignedUrl: string;
}

export interface TusUploadReqBody {
	usage?: string;
}

export interface TusUploadRespBody extends IUpload {
	uploadUrl: string;
}

export interface FinishUploadReqBody {
	isSuccess: boolean;
}

export interface PostMediaPageQuery {
	type?: MediaType;
	page?: number;
	size?: number;
}
