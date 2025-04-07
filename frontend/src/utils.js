import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const handleSuccess = (msg) => {
    toast.success(msg, {
        position: "top-center", // Centered position
        autoClose: 3000, // Closes after 3 seconds
        hideProgressBar: false, // Show progress bar
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored", // Gives a colored modern look
    });
};

export const handleError = (msg) => {
    toast.error(msg, {
        position: "top-center", // Centered position
        autoClose: 4000, // Closes after 4 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
    });
};
