class ReportModel {

    constructor(submittedBy, detail, postID, report) {
        this["Submitted By"] = submittedBy;
        this["Submitted At"] = new Date() //change format
        this["Description"] = detail;
        this["Post ID"] = postID;
        this["Report Type"]= report;
        // this["Media Public ID"] = publicIDs;
        // this["Media URL"] = secureURLs;
        // this['Likes'] = [];
        // this['Edited'] = false
    }
}
export { ReportModel }