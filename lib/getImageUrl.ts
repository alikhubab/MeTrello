import { storage } from "@/appwrite";
import { Image } from "@/typings";

const getImageUrl = (image: Image) => {
  console.log("*****************", image);
  const { buckedId, fileId, bucketId } =
    typeof image === "string" ? JSON.parse(image) : image;
  const url = storage.getFilePreview(buckedId || bucketId, fileId);
  return url;
};

export default getImageUrl;
