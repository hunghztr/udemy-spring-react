import type { IRoleResponse } from "../../../type/role.module";
import { getAll } from "./crud.thunk";

export const getAllRoles = getAll<IRoleResponse>(
  "roles/getAll",
  "/admin/roles"
);
