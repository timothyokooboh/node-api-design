import merge from "lodash.merge";

process.env.NODE_ENV = process.env.NODE_ENV || "development";
const stage = process.env.STAGE || "local";

let envConfig = {};

if (stage === "production") {
  envConfig = require("./prod").default;
} else if (stage === "local") {
  envConfig = require("./local").default;
} else {
  envConfig = require("./dev").default;
}

export default merge(
  {
    stage,
    env: process.env.NODE_ENV,
    port: 3001,
    secrets: {
      jwt: process.env.JWT_SECRET,
      dbUrl: process.env.DATABASE_URL,
    },
  },
  envConfig,
);
