class CommunityChatModel {

    constructor(senderID, message, communityID) {
        this["Sender ID"] = senderID;
        this["Time"] = new Date() //change format
        this["Message"] = message;
        this["Community ID"] = communityID;
    }
}
export { CommunityChatModel }