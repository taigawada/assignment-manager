import { Request as Req, Response as Res, NextFunction } from "express";
import { type UserRecord } from "firebase-admin/lib/auth/user-record";
import { H3Event } from "h3";
import { admin, initializeApp } from "../firebase";

export default eventHandler(async (event) => {
  const loginReuired = event.path.startsWith("/api");
  if (loginReuired) {
    initializeApp();
    const idtoken = event.headers.get("x-user-id-token");
    if (!idtoken || typeof idtoken !== "string") {
      event.node.res.statusCode = 401;
      return "Unauthorized";
    }
    try {
      const auth = admin.auth();
      const verify = await auth.verifyIdToken(idtoken);
      event.context.uid = verify.uid;
    } catch (e) {
      event.node.res.statusCode = 401;
      return "Unauthorized";
    }
  }
});
interface BackendUser {
  uid: string;
  user: UserRecord;
}
export const loadUser = async (event: H3Event): Promise<BackendUser> => {
  const auth = admin.auth();
  const { uid } = event.context;
  const user = await auth.getUser(uid);
  return { uid, user };
};
