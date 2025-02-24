import * as schema from '#lib/db/schema';

export type User = typeof schema.user_table.$inferSelect
export type Session = typeof schema.session_table.$inferSelect
export type ValidAuthContext = { session: Session; user: User }
export type AuthContext = { session: null; user: null } | ValidAuthContext;