import dotenv from "dotenv/config";

if (!process.env.PORT) {
    console.log("Port is not defined");
    process.exit(1);
}

if(!process.env.MONGO_URI){
    console.log("MONGO_URI is not defined");
    process.exit(1);
}

const config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY
}

export default config;