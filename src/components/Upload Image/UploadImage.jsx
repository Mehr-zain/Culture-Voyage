/* eslint-disable react/prop-types */
import { useRef } from "react";
import { Trash, DocumentUpload } from "iconsax-react";
import imageCompression from "browser-image-compression";

export const UploadImage = ({ imageAsset, setImageAsset, fullSize = false, imgCompressionSize = 'sm', setIsChanged = null }) => {

  const fileRef = useRef(null);

  const handleChange = async (e) => {
    if (setIsChanged) {
      setIsChanged(true)
    }
    let file = e.target.files[0];
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: imgCompressionSize === 'lg' ? 1000 : 300,
      useWebWorker: true,
    }
    if (file) {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      const fileSize = file.size / 1000000; //get file size in mb
      if (["png", "jpg", "jpeg"].includes(fileExtension) && fileSize <= 3) {
        const compressedImage = await imageCompression(file, options);
        setImageAsset(compressedImage);
      } else {
        fileSize > 3 ? alert("File size must be less than or equal to 3mb") :
          alert("Invalid file type. Please select a valid image (png, jpg, jpeg) or video (mp4).");
        // Reset the value of the file input if it does not get reset
        if (fileRef.current) {
          fileRef.current.value = null;
        }
      }
    }
  };

  return (
    <div className={"h-full w-full border-2 border-borderPrimary dark:border-borderSecondary p-4 rounded-lg shadow inline-block mx-auto"}>
      {!imageAsset ? (
        <label>
          <div className="flex flex-col items-center justify-center h-full">
            <div className="flex flex-col justify-center items-center">
              <p className="font-bold text-2xl my-2">
                <DocumentUpload size="30" className="dark:text-accent text-blAccent" />
              </p>
              <p className="text-sm w-full dark:text-primary"> click to upload Community logo</p>
            </div>
            <p className="mt-4 text-sm text-gray-400  text-center">
              Use high-quality jpeg, mp4, png image
            </p>
          </div>
          <input
            ref={fileRef}
            type="file"
            name="upload-image"
            onChange={handleChange}
            className="w-0 h-0"
          />
        </label>
      ) : (
        <div className="relative h-full">
          {/* {imageAsset.startsWith('blob:') ? ( // Checking if imageAsset is a video URL
            <video
              controls
              className={`${fullSize ? 'w-full h-full object-cover' : 'h-[150px] w-[150px] object-cover rounded-full mx-auto'}`}
            >
              <source src={imageAsset} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : ( */}
          <img
            src={URL.createObjectURL(imageAsset)}
            alt="uploaded-image"
            className={`${fullSize ? 'w-full h-full object-cover' : 'h-[150px] w-[150px] object-cover rounded-full mx-auto'}`}
          />
          {/* )} */}
          <button
            type="button"
            className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
            onClick={() => setImageAsset(null)}
          >
            <Trash size="32" color="#FF8A65" />
          </button>
        </div>
      )}
    </div>
  );
};
