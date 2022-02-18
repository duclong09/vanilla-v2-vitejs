import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

export const toast = {
    infor(message){
        Toastify({
            text: message,
            duration: 3000,
            gravity: "top",
            position: "right",
            close: true,
            style: {
              background: "#42a5f5",
            },
          }).showToast();
    },
    success(message){
        Toastify({
            text: message,
            duration: 3000,
            gravity: "top",
            position: "right", 
            close: true,
            style: {
              background: "#4caf50",
            },
          }).showToast();
    },
    error(message){
        Toastify({
            text: message,
            duration: 3000,
            gravity: "top",
            position: "right", 
            close: true,
            style: {
              background: "#c62828",
            },
          }).showToast();
    }
}