import { createGET } from "@helper/RequesterBase";
import { UsersRespBody } from "./schemas";

export const getUsers = createGET<UsersRespBody>("/users", true);
