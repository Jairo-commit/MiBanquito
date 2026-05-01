import * as Factory from "factory.ts";
import type { UserResponse } from "~/models/user.model";

export const userResponseFactory = Factory.Sync.makeFactory<UserResponse>({
    id: Factory.each((i: number) => String(i + 1)),
    username: Factory.each((i: number) => `testuser${i + 1}`),
    email: Factory.each((i: number) => `test${i + 1}@example.com`),
    document_type: "CC",
    document_number: Factory.each((i: number) => `${123456789 + i}`),
    full_name: Factory.each((i: number) => `Test User ${i + 1}`),
    city: "Bogotá",
    phone: "3001234567",
    is_superuser: false,
});
