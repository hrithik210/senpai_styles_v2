import axios from "axios";

const BASE_CASHFREE_URL = process.env.BASE_CASHFREE_URL || "https://sandbox.cashfree.com" ;

const app_id = process.env.CASHFREE_APP_ID
const secret_key = process.env.CASHFREE_SECRET_KEY


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

