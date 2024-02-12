import {
	createDELETEWithParams,
	createGET,
	createGETWithParams,
	createPOST,
	createPOSTWithParams,
	createPUTWithParams,
} from "@helper/RequesterBase";
import { IdParams } from "@usertypes/params";
import { ICategory } from "@usertypes/types";
import { CategoriesRespBody, CategoryReqBody } from "./schemas";

export const getCategory = createGETWithParams<ICategory, IdParams>(
	"/categories/:id",
	true,
);

export const createCategory = createPOST<Partial<CategoryReqBody>, ICategory>(
	"/categories",
	true,
);

export const updateCategory = createPUTWithParams<
	Partial<CategoryReqBody>,
	never,
	IdParams
>("/categories/:id", true);

export const deleteCategory = createDELETEWithParams<IdParams, never, IdParams>(
	"/categories/:id",
	true,
);

export const getCategories = createGET<CategoriesRespBody>("/categories", true);

export const moveUpCategoryById = createPOSTWithParams<
	null,
	CategoriesRespBody,
	IdParams
>("/categories/up/:id", true);

export const moveDownCategoryById = createPOSTWithParams<
	null,
	CategoriesRespBody,
	IdParams
>("/categories/down/:id", true);
