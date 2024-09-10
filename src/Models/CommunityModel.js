
import { formatDate } from '../utils/index'
class CommunityModel {
  constructor(logo, title, description, createdBy, logoPublicID, communityType, tags, userCountry) {
    this["Created By"] = createdBy
    this["Created At"] = formatDate(new Date()) //change format
    this["Community Name"] = title;
    this["Small Description"] = description;
    this["Community Logo URL"] = logo
    this["Banner URL"] = '';
    this["Moderators"] = [createdBy];
    this["Members"] = [];
    this["Banned Users"] = [];
    this["Rules"] = [];
    this["Banner Public ID"] = ''
    this["Logo Public Id"] = logoPublicID
    this['Tags'] = [...tags, communityType, userCountry, title]
    this['Community Type'] = communityType
    this["Guidelines"] = ''
    this['Country'] = userCountry
  }
}
export { CommunityModel };
