import { storage } from "@/appwrite";
import { Image } from "@/typings";

const getImageUrl = async (image: Image) => {
  const url = storage.getFilePreview(image.buckedId, image.fieldId);

  return url;
};

export default getImageUrl;
