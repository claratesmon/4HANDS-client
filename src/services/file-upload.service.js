// src/services/file-upload.service.js

import axios from "axios";

const api = axios.create({
  // make sure you use PORT = 5005 (the port where our server is running)
  baseURL: "http://localhost:5005"
  // withCredentials: true // => you might need this option if using cookies and sessions
});

const errorHandler = (err) => {
  throw err;
};

const getHelpPost = () => {
  return api.get("/help-post")
    .then((res) => res.data)
    .catch(errorHandler);
};

const uploadImage = (file) => {
  /* const uploadData = new FormData();
  uploadData.append("helpImageUrl", file);
  console.log(file) */
  // imageUrl => this name has to be the same as in the model
  return api.post("/help-post/upload", file, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(res => res.data)
    .catch(errorHandler);
};
const uploadImageProfile = (file) => {
  /* const uploadData = new FormData();
  uploadData.append("helpImageUrl", file);
  console.log(file) */
  // imageUrl => this name has to be the same as in the model
  return api.post("/user/upload", file, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(res => res.data)
    .catch(errorHandler);
};

const createHelp = (newHelp) => {
  return api.post("/help-post", newHelp)
    .then(res => res.data)
    .catch(errorHandler);
};

export default {
  getHelpPost,
  uploadImage,
  uploadImageProfile,
  createHelp
};
