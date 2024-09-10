import axios from "axios";
const preset_key = "culturevoyage";
const cloud_name = "du2kwgdxc";
export const uploadImageAssetToCloudinary = async (imageAsset) => {
    const formData = new FormData();
    formData.append('file', imageAsset);
    formData.append("upload_preset", preset_key);

    const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, formData);
    return data;
}

export const uploadVideoAssetToCloudinary = async (imageAsset) => {
    const formData = new FormData();
    formData.append('file', imageAsset);
    formData.append("upload_preset", preset_key);
    formData.append('resource_type', 'video'); // Specify resource type as 'video'
    const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/video/upload`, formData);
    return data;
}