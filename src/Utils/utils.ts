import axios from "axios";

async function validateUrl(url: string): Promise<boolean> {
  try {
    const response = await axios.get(url);

    if (response.status >= 200 && response.status < 300) {
      return true; // URL is valid and links to a source
    } else {
      return false; // URL is valid, but the source is not accessible
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios error response received from the server
      if (error.response && error.response.status === 401) {
        throw new Error("Authentication required to access the resource.");
      }
    }
    // Other types of errors
    throw new Error("Invalid URL or poor internet connection.");
  }
}

export default validateUrl;
