# Environment Variables Setup Guide

Your Hydrogen project needs the following environment variables to connect to your Shopify store and fetch products.

## Required Environment Variables

Add these to your `.env` file in the `demo-hy` directory:

```env
# Session secret (already set)
SESSION_SECRET="foobar"

# Shopify Store Domain (required)
# Format: your-store-name.myshopify.com
PUBLIC_STORE_DOMAIN="your-store-name.myshopify.com"

# Storefront API Access Token (required)
# Get this from your Shopify admin
PUBLIC_STOREFRONT_API_TOKEN="your-storefront-api-token"

# Storefront ID (optional but recommended for analytics)
PUBLIC_STOREFRONT_ID="your-storefront-id"

# Checkout Domain (optional)
PUBLIC_CHECKOUT_DOMAIN="checkout.shopify.com"
```

## How to Get These Values

### 1. Get Your Store Domain
- Your store domain is: `your-store-name.myshopify.com`
- Replace `your-store-name` with your actual Shopify store name

### 2. Get Storefront API Token

**Option A: Using Shopify CLI (Recommended)**
1. Open your terminal in the `demo-hy` directory
2. Run: `npx shopify hydrogen link`
3. Follow the prompts to select your store
4. This will automatically populate your `.env` file

**Option B: Manual Setup**
1. Go to your Shopify Admin: https://admin.shopify.com
2. Navigate to: **Settings** → **Apps and sales channels** → **Develop apps**
3. Click **Create an app**
4. Name it (e.g., "Hydrogen Storefront")
5. Click **Configure Admin API scopes** (you can skip this for now)
6. Click **Configure Storefront API scopes**
7. Select the scopes you need (at minimum: `unauthenticated_read_product_listings`)
8. Click **Save**
9. Click **Install app**
10. Go to the **API credentials** tab
11. Under **Storefront API**, click **Reveal token once**
12. Copy the token - this is your `PUBLIC_STOREFRONT_API_TOKEN`

### 3. Get Storefront ID (Optional)
- In the same API credentials page, you'll see the **Storefront API ID**
- Copy this value for `PUBLIC_STOREFRONT_ID`

## Quick Setup Steps

1. **Edit your `.env` file** in the `demo-hy` directory
2. **Add the required variables** using the format above
3. **Save the file**
4. **Restart your dev server** if it's running:
   ```bash
   npm run dev
   ```

## Verify It's Working

After adding the environment variables:
1. Start your dev server: `npm run dev`
2. Visit the products page (usually `/collections/all` or `/products`)
3. You should see products from your Shopify store

## Troubleshooting

- **"SESSION_SECRET environment variable is not set"**: Make sure `SESSION_SECRET` is in your `.env` file
- **"Failed to fetch products"**: Check that `PUBLIC_STORE_DOMAIN` and `PUBLIC_STOREFRONT_API_TOKEN` are correct
- **"401 Unauthorized"**: Your Storefront API token might be invalid or expired
- **"404 Not Found"**: Check that your store domain is correct

## Notes

- Never commit your `.env` file to git (it should be in `.gitignore`)
- The `PUBLIC_` prefix means these variables are available in the browser
- Keep your Storefront API token secure

