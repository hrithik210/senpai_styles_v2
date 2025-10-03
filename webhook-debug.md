# Cashfree Webhook Debug Guide

## Current Status (from health check)
- **Total Online Orders (24h)**: 2
- **Paid Orders**: 0 ❌
- **Pending Orders**: 2 ❌ 
- **Stale Orders**: 2 (22-23 hours old)

## Issue: Webhooks Not Reaching Endpoint

### 1. Check Cashfree Dashboard Webhook URL
Your webhook URL should be: `https://senpaistyles.in/api/cashfree/webhook`

### 2. Verify HTTP Method
Cashfree sends POST requests to webhooks

### 3. Check CORS Headers
Need to allow Cashfree's origin (they don't send from browser)

### 4. Check Response Format
Must return 200 status for success

### 5. Test Webhook Manually
```bash
curl -X POST https://senpaistyles.in/api/cashfree/webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"PAYMENT_SUCCESS_WEBHOOK","data":{"order":{"order_id":"test_123"}}}'
```

## Next Steps
1. Check Cashfree dashboard webhook logs
2. Verify webhook URL format
3. Test manual webhook call
4. Check for SSL/TLS issues