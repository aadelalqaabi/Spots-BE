const PushNotification = require("../../models/PushNotification");
const Spot = require("../../models/Spot");
const User = require("../../models/User");
const { email } = require("../../middleware/email");
const fetch = require("node-fetch");

exports.fetchpushNotification = async (pushNotificationId, next) => {
  try {
    const pushNotification = await PushNotification.findById(
      pushNotificationId
    );
    return pushNotification;
  } catch (error) {
    next(error);
  }
};

exports.pushNotificationCreate = async (req, res, next) => {
  try {
    const spot = req.body.spot;
    const newPushNotification = await PushNotification.create(req.body);
    const users = await User.find();
    const filteredUsers = users.filter(
      (user) => user?.notificationToken && user.notificationToken !== "" && user?.locale && user.locale !== "");
      console.log('filteredUsers', filteredUsers.length)
    let notificationsTokens = [];
    for (let i = 0; i <= filteredUsers.length; i++) {
      let user = filteredUsers[i];
      if(user?.notificationToken && user.notificationToken !== "" && user?.locale && user.locale !== ""){
        if (!notificationsTokens.some((token) => token === user?.notificationToken)) {
          console.log('user.name', user.name)
          notificationsTokens.push(user?.notificationToken);
          if (user.locale.includes(newPushNotification.locale)) {
            let message = {
              to: user.notificationToken,
              sound: "default",
              title: newPushNotification.title,
              body: newPushNotification.body,
              data: {
                link: `dest://SpotDetails/${spot}`,
              },
              _displayInForeground: true,
            };
            try {
              let response = await fetch("https://exp.host/--/api/v2/push/send", {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Accept-encoding": "gzip, deflate",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(message),
              });
              if (response.statusText !== "OK") {
                throw new Error(
                  `Failed to send push notification to ${user.notificationToken}. Status: ${response.status}`
                );
              }
            } catch (error) {
              console.error(error);
            }
          } 
        }
      }
    }
    res.status(200).json(newPushNotification);
    return;
  } catch (error) {
    next(error);
  }
};

exports.getPushNotifications = async (req, res, next) => {
  try {
    const pushNotifications = await PushNotification.find();
    res.json(pushNotifications);
    return;
  } catch (error) {
    next(error);
  }
};

exports.deletePushNotification = async (req, res, next) => {
  const { pushNotificationId } = req.params;
  try {
    await PushNotification.findByIdAndRemove({ _id: pushNotificationId });
    res.status(204).end();
    return;
  } catch (err) {
    next(err);
  }
};
