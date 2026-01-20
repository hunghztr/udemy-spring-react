import type { IProfile } from "../../../type/user.module";
import { update } from "../admin/crud.thunk";

export const updateProfile = update<IProfile, boolean>(
    "profiles/update",
    (data) => `/profiles/${data.id}`
);