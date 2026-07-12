"use server";

import { getActingUser } from "./acting-user";
import { getPostLoginPath } from "./post-login-redirect";

export async function getAuthenticatedRedirectPath(): Promise<string | null> {
  const user = await getActingUser();

  if (!user) {
    return null;
  }

  return getPostLoginPath(user.role);
}
