import { builder } from "./builder";

import "#features/auth/schema";

export const schema = builder.toSchema();
