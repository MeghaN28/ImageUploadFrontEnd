import axios from "axios";

export const uploadImage = async (imageBase64) => {
  try {
    const apiUrl = `https://eu6t6jczc1.execute-api.us-east-1.amazonaws.com/UploadImage/UploadImageToS3`;
    
    // Ensure the image data is properly formatted in the request body
    const requestData = {
      imageBase64: imageBase64,
    };

    // Send the request
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        'Content-Type': 'application/json', // Change content type to application/json
      },
    });

    return response.data; // Assuming response contains relevant data
  } catch (error) {
    console.error('Error during image upload:', error);
    return null;
  }
};
