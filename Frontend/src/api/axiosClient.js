import axios from "axios";
import CryptoJS from "crypto-js";

var key = CryptoJS.enc.Utf8.parse("thew6Q8WfEe0m6uzIljTl9wJ1gMR5xor");
var iv = CryptoJS.enc.Utf8.parse("thew6Q8WfEe0m6uz");

const axiosClient = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "api-key":"indeed",
    "accept-language": "en",
    "Content-Type": "text/plain",
    // type: "admin",
    // platform_type: "W"
  },
});

// Body Encryption Request
axiosClient.interceptors.request.use(function (request) {
  const isFormData = request.data instanceof FormData

  if(!isFormData){
    request.data = bodyEncryption(request.data, true)
  }
  const token = getToken();
  // response = bodyDecryption(response.data);
  if(token){
    // console.log(token)
    request.headers["token"] = token
  } 
  if (token && request.requireAuth !== false) {
    request.headers["token"] = token;
  }
  return request;
});

axiosClient.interceptors.response.use(
  function (response) {
    console.log("res", response)
    response = bodyDecryption(response.data);

    // if (response.code === 400) {
    //   showErrorMessage(response.data.message);
    // }

    return response;
  },

  function (error) {
    let res = error.response;
    if (!error.response) {
      return Promise.reject(error);
    }
    console.log("HERE", error)
    if (res.status == 401 || res.status === -1) {
      logOutRedirectCall();
      const response = bodyDecryption(res.data);
      return response;
    } else if (
      res.status === 400 ||
      res.status === 409 ||
      res.status === 500 ||
      res.status === 404
    ) {
      const response = bodyDecryption(res.data);
      return response;
    } else {
      console.error(
        "Looks like there was a problem. Status Code: " + res.status
      );
      return Promise.reject(error);
    }
  }
);

function bodyEncryption(request, isStringify) {
  // console.log("bodyEncryption request=>>>",request);
  var request_ = isStringify ? JSON.stringify(request) : request;
  var encrypted = CryptoJS.AES.encrypt(request_, key, { iv: iv });
  return encrypted.toString();
}


function bodyDecryption(request) {
  // console.log("decryptions",request);
  var decrypted = CryptoJS.AES.decrypt(request.toString(), key, { iv: iv });
  // console.log("decryptions",decrypted);
  const response = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
  if(response.message === "tokenExpired") logOutRedirectCall()
  // console.log("bodyDecryption =>>>",);

  return response;
}

function getToken(){
  return localStorage.getItem('token')
}
function logOutRedirectCall (){
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  window.location.href="/signin"
}
export { axiosClient };
