import * as Factory from "factory.ts";
import type { AuthToken } from "~/models/authToken.model";

export const authTokenFactory = Factory.Sync.makeFactory<AuthToken>({
    access: "fake-access-token",
    refresh: "fake-refresh-token",
});
