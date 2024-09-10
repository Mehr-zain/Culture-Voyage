class CommentModel {

    constructor(createdBy, description, postID) {
        this["Created By"] = createdBy;
        this["Created At"] = new Date()
        this["Description"] = description;
        this["Post ID"] = postID;
        this['Likes'] = [];
    }
}
export { CommentModel }