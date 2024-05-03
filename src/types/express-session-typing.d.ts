import { Session } from "express-session";

declare module "express-session" {
  interface Session {
    user: {
      uid: string;
      usertype: "client" | "tailor";
    };
  }
}
