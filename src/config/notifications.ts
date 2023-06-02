/* eslint-disable @typescript-eslint/no-explicit-any */
import * as admin from 'firebase-admin';

export const sendNotification = async (
  registrationToken: string,
  title: string,
  message: string,
  data: any = {},
): Promise<void> => {
  const options = {
    priority: 'high',
    content_available: true,
    timeToLive: 60 * 60 * 24
  };
  const payload = {
    notification: {
      ...data,
      sound: 'default',
    },
    data,
  };
  await admin.messaging().sendToDevice(registrationToken, payload, options);
};