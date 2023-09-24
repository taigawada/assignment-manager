import admin from "firebase-admin";
import { initializeApp as initializeFirebaseApp } from "firebase-admin/app";

const initializeApp = () => {
  if (admin.apps.length === 0) {
    const account = process.env.SERVICE_ACCOUNT;
    if (!account) {
      throw new Error("The environment variable SERVICE_ACCOUNT is not set");
    }
    initializeFirebaseApp({
      credential: admin.credential.cert(JSON.parse(account)),
    });
  }
};

export { admin, initializeApp };
