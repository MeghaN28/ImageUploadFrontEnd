import Webcam from "react-webcam";
import { useRef, useState, useCallback, useEffect } from "react";

const CustomWebcam = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  // Function to capture photo
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef]);

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
      </div>
    </div>
  );
};

export default CustomWebcam;
