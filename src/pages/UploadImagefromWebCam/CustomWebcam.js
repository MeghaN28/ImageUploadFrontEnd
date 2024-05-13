import Webcam from "react-webcam";
import { useRef, useState, useCallback, useEffect } from "react";
import { uploadWebCamPhoto } from "../../services/UploadWebCamImageService";

const CustomWebcam = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [name, setName] = useState(null);
  const [captureClicked, setCaptureClicked] = useState(false);

  // Function to capture photo
  const capture = useCallback(() => {
    const imageSrc = webcamRef?.current?.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef]);

  const onSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    if (!imgSrc) {
      alert("Please select image");
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
            console.log("Image upload successful:", response.body);
            setName(response.body);

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
    let timer;
    if (!captureClicked) {
      timer = setTimeout(() => {
        alert("Photo captured!");
        capture();
      }, 15000); // 15 seconds
    }
    return () => clearTimeout(timer);
  }, [captureClicked, capture]);

  return (
    <div className="bg-stone-200 min-h-screen">
      <div className="flex justify-center pt-24">
        <div className="outline-dashed outline-2 bg-indigo-100">
          <div className="font-semibold text-base rounded flex flex-col items-center justify-center cursor-pointer border-dotted font-[sans-serif]">
            {imgSrc ? (
              <img src={imgSrc} alt="webcam" />
            ) : (
              <Webcam height={600} width={600} ref={webcamRef} />
            )}
            {name}
            <div className="btn-container flex flex-row">
              <div>
                <button
                  onClick={() => {
                    setCaptureClicked(true);
                    capture();
                  }}
                  className="gap-2 px-1 py-px border-2 border-white rounded-lg cursor-pointer bg-green-800 w-20"
                >
                  Capture photo
                </button>
              </div>
              <div>
                <button
                  onClick={onSubmit}
                  className="gap-2 px-1 py-px border-2 border-white rounded-lg cursor-pointer bg-green-800 w-20"
                >
                  Send Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomWebcam;
