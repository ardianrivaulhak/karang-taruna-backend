import admin from "firebase-admin";
const messaging = import("firebase-admin/messaging");

import serviceAccount from "../secrets/firebase/karang-taruna-ef215-firebase-adminsdk-s7jnq-8f7c270d8d.json" assert { type: "json" };

class Messaging {
  static initialize() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  static async sendToToken(tokens, data) {
    try {
      const message = {
        notification: {
          title: data.title,
          body: data.body,
        },
        tokens: tokens,
      };
      const _messaging = await messaging;
      const mess = await _messaging.getMessaging().sendMulticast(message);
      return mess;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

export default Messaging;
