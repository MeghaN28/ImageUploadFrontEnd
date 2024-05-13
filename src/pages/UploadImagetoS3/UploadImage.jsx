import React, { useState, useEffect } from "react";
import { uploadImage } from "../../services/UploadImageService";
import imageUpload from "../../assetImport/image_upload.jpg";

function UploadImage() {
    const [image, setImage] = useState(null);
    const [labels, setLabels] = useState([]);
    const [imageFile, setImageFile] = useState(null);

    const onSubmit = async (event) => {
        event.preventDefault();

        if (!imageFile) {
            alert("Please select an image");
            console.error("Please select an image file to upload.");
            return;
        }

        try {
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);

            reader.onload = async (event) => {
                const imageDataUrl = event.target.result;
                setImage(imageDataUrl);

                const base64Data = imageDataUrl.split(",")[1];

                const response = await uploadImage(base64Data);
                if (response) {
                    const labeledData = JSON.parse(response.body);
                    setLabels(labeledData.labels);
                }

                alert("Image upload Successful");
                console.log("Image upload successful:", response);
            };

            reader.onerror = (error) => {
                alert("Error while uploading Image");
                console.error("Error reading image file:", error);
            };
        } catch (error) {
            alert("Error during image upload");
            console.error("Error during image upload:", error);
        }
    };

    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile.type.match("image/")) {
            alert("Please select a valid image");
            console.error("Please select a valid image file (PNG, JPG, JPEG).");
            return;
        }
        setImageFile(selectedFile);
    };

    useEffect(() => {
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");

        if (image && labels.length > 0) {
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                labels.forEach((label) => {
                    label.Instances.forEach((instance) => {
                        const left = instance.Left * img.width;
                        const top = instance.Top * img.height;
                        const width = instance.Width * img.width;
                        const height = instance.Height * img.height;

                        ctx.beginPath();
                        ctx.rect(left, top, width, height);
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = "red";
                        ctx.stroke();

                        const label_text = label.Name + ' (' + label.Confidence.toFixed(2) + '%)';
                        ctx.font = "12px Arial";
                        ctx.fillStyle = "red";
                        ctx.fillText(label_text, left, top - 2);
                    });
                });
            };
            img.src = image;
        }
    }, [labels]);

    return (
        <div className="bg-stone-200 overflow-y-auto max-h-screen h-full">
            <div className="flex justify-center pt-24 flex-grow ">
                <div className="outline-dashed outline-2 bg-indigo-100">
                    <div className="font-semibold text-base rounded flex flex-col items-center justify-center cursor-pointer border-dotted font-[sans-serif]">
                        <form onSubmit={onSubmit} className="flex flex-col items-center justify-center">
                            <div className="opacity-35">
                                <img id="uploaded-image" src={imageUpload} alt="" className="mx-auto px-4" />
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
            <div className="flex justify-center">
            <canvas id="canvas" width="300px" height="250px"></canvas>
            </div>
        </div>
    );
}

export default UploadImage;
