class GeneralPostModel {

    constructor(createdBy, description, title, publicIDs = [], secureURLs = []) {
        this["Created By"] = createdBy;
        this["Created At"] = new Date() //change format
        this["Description"] = description;
        this["Title"] = title;
        this["Media Public ID"] = publicIDs;
        this["Media URL"] = secureURLs;
        this['Likes'] = [];
        this['Edited'] = false
        this['Comments'] = []
    }
}
export { GeneralPostModel }