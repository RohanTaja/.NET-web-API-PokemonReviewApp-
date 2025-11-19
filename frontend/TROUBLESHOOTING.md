# Troubleshooting Guide

## Error: "Failed to load pokemons. Make sure the backend API is running."

This error can occur for several reasons. Follow these steps:

### 1. Verify Backend is Running

First, make sure your backend API is actually running:

1. Open a browser and go to: `https://localhost:7177/swagger/index.html`
2. If you see the Swagger UI, your backend is running ✅
3. If you get an error, start your backend:
   ```bash
   cd PokemonReview
   dotnet run
   ```

### 2. SSL Certificate Issues (Most Common)

Since the backend uses HTTPS with a self-signed certificate, you may need to configure Node.js to accept it for **server-side requests** (Next.js server components).

#### Solution: Create `.env.local` file

Create a file named `.env.local` in the `frontend` folder with:

```env
NODE_TLS_REJECT_UNAUTHORIZED=0
NEXT_PUBLIC_API_URL=https://localhost:7177/api
```

**⚠️ Important**: This setting is for **development only**. Never use this in production!

#### Why is this needed?

- **Browser requests** (client-side): Work automatically after you accept the certificate in your browser
- **Server-side requests** (Next.js server components): Node.js needs to be told to accept self-signed certificates

### 3. CORS Issues

If you see CORS errors in the browser console:

1. Make sure CORS is configured in `PokemonReview/Program.cs`
2. The CORS policy should allow `http://localhost:3000`
3. Restart your backend after changing CORS settings

### 4. Check Browser Console

1. Open browser DevTools (F12)
2. Go to the **Console** tab
3. Look for specific error messages
4. Go to the **Network** tab
5. Try to load the page again
6. Check if requests to `https://localhost:7177/api/pokemon` are:
   - Being blocked (CORS error)
   - Failing (network error)
   - Returning errors (check the response)

### 5. Test API Directly

Test if the API works directly:

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Run this command:
   ```javascript
   fetch('https://localhost:7177/api/pokemon')
     .then(r => r.json())
     .then(console.log)
     .catch(console.error)
   ```

If this works, the issue is with Next.js server-side requests (SSL certificate).

### 6. Quick Fix Checklist

- [ ] Backend is running (`https://localhost:7177/swagger/index.html` works)
- [ ] Created `.env.local` with `NODE_TLS_REJECT_UNAUTHORIZED=0`
- [ ] Restarted Next.js dev server after creating `.env.local`
- [ ] Accepted SSL certificate in browser (visit Swagger URL first)
- [ ] Checked browser console for specific errors
- [ ] CORS is configured in backend

### 7. Still Not Working?

If none of the above works:

1. **Try using HTTP instead of HTTPS** (if your backend supports it):
   - Create `.env.local` with: `NEXT_PUBLIC_API_URL=http://localhost:5041/api`
   - Note: The HTTPS profile in launchSettings.json exposes both ports

2. **Check firewall/antivirus**: Some security software blocks localhost connections

3. **Check if port 3000 is available**: 
   ```bash
   netstat -ano | findstr :3000
   ```

4. **Clear Next.js cache**:
   ```bash
   cd frontend
   Remove-Item -Recurse -Force .next
   npm run dev
   ```

