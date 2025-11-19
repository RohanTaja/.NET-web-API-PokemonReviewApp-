# SSL Certificate Setup for Development

Since the backend API uses HTTPS with a self-signed certificate, you may encounter SSL certificate errors.

## For Browser Requests (Client-Side)

Browser requests from the Next.js frontend should work automatically after you:
1. Visit `https://localhost:7177/swagger/index.html` in your browser
2. Accept the self-signed certificate warning
3. Your browser will remember this certificate for future requests

## For Server-Side Requests (Next.js Server Components)

If you get SSL certificate errors in server-side code (Next.js server components), you have two options:

### Option 1: Set Environment Variable (Development Only)

Create or update `.env.local` in the `frontend` folder:

```env
NODE_TLS_REJECT_UNAUTHORIZED=0
NEXT_PUBLIC_API_URL=https://localhost:7177/api
```

**⚠️ Warning**: Only use this in development! Never set this in production.

### Option 2: Configure Axios for Server-Side (If needed)

If you still have issues, you can configure axios to accept self-signed certificates in server-side code only. However, the current setup should work for most cases.

## Testing the Connection

1. Make sure your backend is running and accessible at `https://localhost:7177/swagger/index.html`
2. Start your frontend: `npm run dev`
3. Open `http://localhost:3000` in your browser
4. Check the browser console for any errors

If you see SSL certificate errors, follow the steps above.

