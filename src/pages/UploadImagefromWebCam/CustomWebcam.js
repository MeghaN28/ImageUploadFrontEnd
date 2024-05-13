import Webcam from "react-webcam";
import { useRef, useState, useCallback, useEffect } from "react";
import {uploadWebCamPhoto} from "../../services/UploadWebCamImageService";

const CustomWebcam = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  // Function to capture photo
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef]);

  const onSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    if (!imgSrc) {
      alert("Please select image")
      console.error("Please select an image file to upload.");
      return; // Early exit if no image is selected
    }

    try {
      // Create a new Image object
      const image = new Image();
      image.onload = () => {
        // Create a canvas element
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
  
        // Draw the image on the canvas
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
  
        // Convert the canvas content to PNG format
        canvas.toBlob(async (blob) => {
          // Read the blob as data URL
          const reader = new FileReader();
          reader.readAsDataURL(blob);
  
          reader.onloadend = async () => {
            // Extract base64-encoded image data from the data URL
            const base64Data = reader.result.split(",")[1];
  
            // Call the uploadImage function with base64 data
            const response = await uploadWebCamPhoto(base64Data);
            alert("Image upload Successful");
            console.log("Image upload successful:", response);
  
            // Add any additional handling for successful upload (optional)
          };
        }, "image/png");
      };
      image.src = imgSrc;
    } catch (error) {
      alert("Error while uploading Image");
      console.error("Error during image upload:", error);
    }
  };


  // Function to capture photo after 15 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      capture();
      alert("Photo captured!");
    }, 15000); // 15 seconds

    return () => clearTimeout(timer);
  }, [capture]);

  return (
    <div className="container">
      {imgSrc ? (
        <img src={imgSrc} alt="webcam" />
      ) : (
        <Webcam height={600} width={600} ref={webcamRef} />
      )}
      <div className="btn-container">
        <button onClick={capture}>Capture photo</button>
        <button onClick={onSubmit}>Send Photo</button>
      </div>
    </div>
  );
};

export default CustomWebcam;
