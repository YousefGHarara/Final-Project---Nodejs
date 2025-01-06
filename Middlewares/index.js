const express = require("express");

module.exports = {
  global: (app) => {
    app.use((req, res, next) => {
      console.log("+++++++ TEST MIDDLE PRIMARY   +++++++");
      next();
    });
    
    app.use((req, res, next) => {
      console.log("+++++++ TEST MIDDLE SECONDARY +++++++");
      next();
    });

    app.use(express.json());
  },
  auth: require("./auth")
};  