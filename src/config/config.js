// console.log(
//   "process.env.REACT_APP_SERVER_URI",
//   process.env.REACT_APP_SERVER_URI
// );
const config = {
  server: {
    serverURI:
      process.env.NODE_ENV === "development" &&
      localStorage.getItem("REACT_APP_SERVER_URI")
        ? localStorage.getItem("REACT_APP_SERVER_URI")
        : process.env.REACT_APP_SERVER_URI || "http://localhost:1337"
  },
  app: {}
};

export default config;

window.config = config;
