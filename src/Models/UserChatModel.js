class UserChatModel {

    constructor(senderID, message, receiverID) {
        this["Sender ID"] = senderID;
        this["Time"] = new Date() //change format
        this["Message"] = message;
        this["Receiver ID"] = receiverID;
    }
}
export { UserChatModel }