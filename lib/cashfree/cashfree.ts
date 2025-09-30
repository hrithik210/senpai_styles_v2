import axios from "axios";

const environment = process.env.CASHFREE_ENVIRONMENT || "SANDBOX";
const BASE_CASHFREE_URL = environment === "PRODUCTION" 
  ? "https://api.cashfree.com" 
  : "https://sandbox.cashfree.com";

const app_id = process.env.CASHFREE_APP_ID
const secret_key = process.env.CASHFREE_SECRET_KEY

console.log("Cashfree Config:", {
  environment,
  BASE_CASHFREE_URL,
  app_id: app_id ? "Present" : "Missing",
  secret_key: secret_key ? "Present" : "Missing"
});

if (!app_id || !secret_key) {
  throw new Error('Missing Cashfree credentials in environment variables');
}

const cashfree = axios.create({
  baseURL: BASE_CASHFREE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-client-id': app_id,
    'x-client-secret': secret_key,
    'x-api-version': '2023-08-01',
  },
});

export default cashfree;

