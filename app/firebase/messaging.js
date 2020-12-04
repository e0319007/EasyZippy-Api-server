const config = require('config');

// Initialise the default app
var admin = require("firebase-admin");
// While the app the not on bluemix, rmb to update the local path to the file accordingly
var serviceAccount = require(config.get('private_key_file_path'));
var app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://easy-zippy-reactnative-android.firebaseio.com",
});

// Subscribe the device corresponding to its registration token to the
// topic.
let subscribeDeviceToAnnouncementsTopic = (registrationToken) => {
    let topic = "announcements";

    admin
        .messaging()
        .subscribeToTopic(registrationToken, topic)
        .then(function (response) {
            // See the MessagingTopicManagementResponse reference documentation
            // for the contents of response.
            console.log(
                "Successfully subscribed to announcements topic:",
                response
            );
        })
        .catch(function (error) {
            console.log("Error subscribing to announcements topic:", error);
        });
};

let sendMessageToAnnouncementsTopic = (
    announcementTitle,
    announcementDescription
) => {
    let announcementMessage = {
        notification: {
            title: announcementTitle,
            body: announcementDescription,
        },
        topic: "announcements",
    };

    // Send a message to devices subscribed to the provided topic.
    admin
        .messaging()
        .send(announcementMessage)
        .then((response) => {
            // Response is a message ID string.
            console.log("Successfully sent announcement message:", response);
        })
        .catch((error) => {
            console.log("Error sending announcement message:", error);
        });
};

module.exports = {
    subscribeDeviceToAnnouncementsTopic,
    sendMessageToAnnouncementsTopic,
};
