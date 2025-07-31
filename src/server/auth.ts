import type { SolidAuthConfig } from "@solid-mediakit/auth";
import Discord from "@auth/core/providers/discord";
import { serverEnv } from "~/env/server";


declare module "@auth/core/types" {
  export interface Session {
    user?: DefaultSession["user"] & {
      providerId: string
    };
  }
  export interface User {
    providerId: string;
  }
}


export const authOptions: SolidAuthConfig = {
  providers: [
    Discord({
      clientId: serverEnv.DISCORD_ID,
      clientSecret: serverEnv.DISCORD_SECRET,
    }),
  ],
  debug: false,
  basePath: import.meta.env.VITE_AUTH_PATH,
  callbacks: {
    async session({ session, token }) {

      const picture = token?.picture
      if (!picture) throw new Error('No picture')
      const providerId = picture.split('/')[picture.split('/').length - 2]

      if (!providerId.match(/^[0-9]+$/)) throw new Error('No providerId')

      return {
        ...session,
        user: {
          ...session.user,
          providerId,
        }
      }
    }
  }
};
