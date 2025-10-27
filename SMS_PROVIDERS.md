# SMS Provider Configuration Guide

The emergency alert system now supports **three SMS providers**. Configure **ONE** of them in `server/.env`:

## 1. Twilio (Global, Recommended for US/EU)

**Setup:**
1. Sign up at [twilio.com](https://www.twilio.com)
2. Get your credentials from the Console
3. Add to `server/.env`:
```env
TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_FROM=+1234567890
```

**Trial Limitations:**
- Must verify recipient numbers before sending
- Includes "Sent from a Twilio trial account" prefix

---

## 2. Vonage (Nexmo) (Global, Good for Europe/Asia)

**Setup:**
1. Sign up at [vonage.com](https://www.vonage.com/communications-apis/)
2. Get your API key and secret from the Dashboard
3. Add to `server/.env`:
```env
VONAGE_API_KEY=your_api_key
VONAGE_API_SECRET=your_api_secret
VONAGE_FROM=YourBrand
```

**Notes:**
- FROM can be alphanumeric (11 chars max) or a virtual number
- Check country-specific requirements for sender IDs

---

## 3. Africa's Talking (Best for Africa)

**Setup:**
1. Sign up at [africastalking.com](https://africastalking.com)
2. Create an app and get your API key
3. Add to `server/.env`:
```env
AT_USERNAME=sandbox  # or your production username
AT_API_KEY=your_api_key_here
AT_FROM=YOUR_SHORTCODE
```

**Notes:**
- Use `sandbox` username for testing
- Requires a registered shortcode for production
- Best coverage in Kenya, Uganda, Tanzania, Nigeria, etc.

---

## Priority & Fallback

The system checks providers in this order:
1. **Twilio** (if configured)
2. **Vonage** (if Twilio not configured)
3. **Africa's Talking** (if neither above configured)
4. **File fallback** (saves to `server/sms/` if no provider configured)

---

## Testing

After configuring a provider:

1. **Restart the server**:
   ```bash
   cd server
   node server.js
   ```

2. **Check startup logs** for detected provider:
   ```
   SMS Provider detected: twilio
   ```

3. **Long-press the EMERGENCY button** on the home page

4. **Check the toast** — it should say which mode was used (e.g., "Sent to 1 recipient (twilio)")

5. **Verify delivery**:
   - Check the recipient's phone
   - Check provider dashboard for send logs
   - Or check `server/sms/` for fallback file if no provider configured

---

## Multiple Recipients

To send to multiple numbers, use a comma-separated string in `src/pages/Index.tsx`:

```tsx
<PanicButton
  smsEndpoint={"http://localhost:3000/api/alerts/sms"}
  smsTo={"+1234567890, +9876543210"}
  smsMessage={"Emergency! Please assist me immediately."}
/>
```

Or pass an array programmatically from your user's trusted contacts list.

---

## Costs (Approximate)

| Provider         | Price per SMS (US) | Trial Credits |
|------------------|--------------------|---------------|
| Twilio           | $0.0079            | $15.50        |
| Vonage           | $0.0057            | €2            |
| Africa's Talking | $0.01 (varies)     | Free sandbox  |

*Prices vary by destination country. Check provider pricing pages.*

---

## Troubleshooting

- **"no_sms_provider_configured"** — Fill in credentials for at least one provider in `server/.env`
- **"twilio_send_failed"** — Check your Twilio account balance and verify recipient is allowed (trial accounts)
- **"vonage_send_failed"** — Verify API credentials and check sender ID restrictions for destination country
- **"africastalking_send_failed"** — Ensure username is correct (`sandbox` for testing) and API key is valid

All errors fall back to saving the SMS intent in `server/sms/` directory for manual review.
