import React, { useState } from "react";
import { uploadImage } from "../../services/UploadImageService";
import imageUpload from "../../assetImport/image_upload.jpg";

function UploadImage() {
    const [image, setImage] = useState(null);

    const [imageFile, setImageFile] = useState(null); // State for the selected image file

  const onSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    if (!imageFile) {
      alert("Please select image")
      console.error("Please select an image file to upload.");
      return; // Early exit if no image is selected
    }

    try {
      // Read the selected image file as a data URL
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);

      reader.onload = async (event) => {
        const imageDataUrl = event.target.result; // Get data URL after reading

        // Extract base64-encoded image data from the data URL
        const base64Data = imageDataUrl.split(",")[1];

        // Call the uploadImage function with base64 data
        const response = await uploadImage(base64Data);
        alert("Image upload Successful")
        console.log("Image upload successful:", response);

        // Add any additional handling for successful upload (optional)
      };

      reader.onerror = (error) => {
        alert("Error while uploa ding Image")
        console.error("Error reading image file:", error);
      };
    } catch (error) {
      alert("Error while uploading Image")
      console.error("Error during image upload:", error);
    }
  };

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    // Basic file type validation (optional)
    if (!selectedFile.type.match("image/")) {
      alert("Please select valid image")
      console.error("Please select a valid image file (PNG, JPG, JPEG).");
      return;
    }
    setImageFile(selectedFile);
  };
    return (
        <div className="bg-stone-200 min-h-screen">
            <div className="flex justify-center pt-24">
                <div className="outline-dashed outline-2 bg-indigo-100">
                    <div className="font-semibold text-base rounded flex flex-col items-center justify-center cursor-pointer border-dotted font-[sans-serif]">
                        <form onSubmit={onSubmit} className="flex flex-col items-center justify-center">
                            <div className="opacity-35">
                                <img src={imageUpload} alt="" className="mx-auto px-4" />
                            </div>
                            Upload file
                            <input type="file" onChange={handleImageChange} />
                            <p className="text-xs font-medium text-gray-500 mt-2">PNG, JPG, JPEG are Allowed.</p>
                            <div>
                                <button type="submit" className="gap-2 px-1 py-px border-2 border-white rounded-lg cursor-pointer bg-green-800 w-20">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UploadImage;
