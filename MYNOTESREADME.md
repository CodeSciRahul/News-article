# My Next.js Notes 🚀

This file contains important notes about Next.js App Router, API handling, and debugging mistakes I made.

---

## 📌 Mistake 1: Using `NextApiRequest` and `NextApiResponse` in `app/api/`
### ❌ Mistake:
I used the following code in `app/api/`, but it only works in `pages/api/`:
```ts
export async function GET(req: NextApiRequest, res: NextApiResponse, { params }: { params: { userId: string } }) {}

### ✅ Solution
# Use NextRequest instead of NextApiRequest
# Use Response instead of res.status().send()

```ts
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    return new Response(JSON.stringify({ message: "User Preference found" }), { status: 200 });
}


## 📌Mistake 2: Using axios in a Server Component
### ❌ Mistake: I tried to use axios in a server component:

```bash
import axios from "axios";

export default async function Page() {
    const res = await axios.get("/api/user-preference/123"); // ❌ This will fail
}

### ✅ Solution:
# Use fetch() instead of axios in server components
# fetch() is built-in and works with Next.js caching
## NOTE: ✅ If using axios, move the logic to a Client Component.

```bash
export default async function Page() {
    const res = await fetch("/api/user-preference/123");
    const data = await res.json();
}

### 📌 Mistake 3: Database Table Not Found (42P01 Error)
### ❌ Mistake: I created a table in Drizzle ORM, but it didn’t appear in PostgreSQL.
Got this error:
```bash
{
  "message": "Internal server error",
  "error": {
    "code": "42P01",
    "routine": "parserOpenTable"
  }
}

### ✅ Solution:
# I forgot to push the migrations in Drizzle.
# Correct commands in npx runtime:

npx drizzle-kit generate
npx drizzle-kit push





# Next.js: Server Components vs. Client Components

## Why Next.js Recommends Server Components for API Calls

### ✅ Benefits of Using Server Components for API Calls
1. **Better Performance**
   - Data is fetched **before** the page is sent to the browser.
   - Users get a fully rendered page instantly (no loading state).

2. **Reduced Client-Side JavaScript (Smaller Bundle)**
   - No extra JavaScript needed for API calls.
   - Client-side fetching requires additional code execution.

3. **Secure Fetching (No Exposed API Keys)**
   - API calls in **Client Components** are visible in the browser's network tab.
   - Server Components keep sensitive data hidden.

4. **Automatic Caching & Optimization**
   - Next.js caches Server Component data to **reduce unnecessary API calls**.
   - Client Components require manual caching (e.g., React Query, Redux).

---

## 🚀 Handling State: When to Use Client Components
- **Server Components CANNOT manage state** (`useState`, `useEffect`).
- If data needs to update frequently, use a **Client Component**.

### ✅ Best Approach: Combining Server & Client Components

```tsx
// ✅ Server Component (fetches initial data)
import { currentUser } from "@clerk/nextjs/server";

export default async function Page() {
    const user = await currentUser();
    if (!user) return <div>Loading...</div>;

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user-preference/${user.id}`);
    const initialPreferences = await response.json();

    return <UserDashboard user={user} initialPreferences={initialPreferences} />;
}

// ✅ Client Component (manages state & updates)
"use client";
import { useState } from "react";

function UserDashboard({ user, initialPreferences }) {
    const [preferences, setPreferences] = useState(initialPreferences);

    return (
        <div>
            <h1>Welcome, {user.firstName}</h1>
            <p>Your Preferences: {JSON.stringify(preferences)}</p>
        </div>
    );
}
```
- **Server Component (`Page`) fetches initial data** ✅
- **Client Component (`UserDashboard`) manages state & updates** ✅

---

## 📌 When to Use Server vs. Client Components

| Feature | Server Component ✅ | Client Component ✅ |
|---------|----------------|----------------|
| **Fetching data (static/dynamic)** | ✅ Yes | ⚠️ Not recommended (unless interactive) |
| **Hiding API keys & security** | ✅ Yes | ❌ No (exposes API calls in the browser) |
| **Faster performance (pre-rendered HTML)** | ✅ Yes | ❌ No (API fetch happens after page loads) |
| **Managing state (`useState`, `useEffect`)** | ❌ No | ✅ Yes |
| **Real-time updates (e.g., WebSockets, polling)** | ❌ No | ✅ Yes |

---

## 📌 Summary: Why Next.js Recommends Server Components?
- **For static/dynamic data fetching → Server Components are best.**
- **For interactive UI & state updates → Use Client Components.**

If data **does not change often**, use **Server Components** for better performance.
If the UI **needs real-time updates**, mix **Server + Client Components**.

---

📌 Keep this as a reference for building optimized Next.js applications! 🚀


# Next.js API Best Practices

## 🚀 Understanding API Handling in Next.js
Next.js provides a powerful way to handle API requests efficiently. This guide covers the best practices for using **Server Components** and **Client Components** for different types of API interactions.

---

## ✅ Best Practices

### 1️⃣ Use Server Components for Initial Data Fetching
- Server Components are optimized for fetching data **before rendering the page**.
- Use `fetch()` inside a **Server Component** for **GET** requests.
- This improves performance by avoiding unnecessary API calls on the client side.

#### Example: Fetching Data in a Server Component
```tsx
import { currentUser } from "@clerk/nextjs/server";

export default async function Page() {
    const user = await currentUser();
    if (!user) return <div>Loading...</div>;

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user-preference/${user.id}`);
    const userPreference = await response.json();

    return (
        <div>
            Dashboard content is protected.
            {user.firstName}
            {user.id}
        </div>
    );
}
```

---

### 2️⃣ Use Client Components for User Interactions (POST, PUT, DELETE)
- **Use Client Components for user-triggered actions** (e.g., form submissions, button clicks).
- Use `fetch()` or `Axios` inside a **Client Component** for **POST** requests.
- This allows state management and reactivity after API interactions.

#### Example: Sending a POST Request in a Client Component
```tsx
"use client";
import { useState } from "react";

export default function UserPreferenceForm({ userId }) {
    const [category, setCategory] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/user-preference/${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category }),
            });
            const data = await response.json();
            console.log("User preference updated:", data);
        } catch (error) {
            console.error("Error updating preference:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter category"
            />
            <button type="submit">Save Preference</button>
        </form>
    );
}
```

---

### 3️⃣ Avoid Fetching in `useEffect` Unless Necessary
- **Avoid fetching data inside `useEffect`** when you can fetch it **server-side** instead.
- `useEffect` should only be used for dynamic state-based updates (e.g., real-time updates).
- Instead, **trigger API requests on user actions** (e.g., form submissions, button clicks).

---

## 📌 Final Thoughts
| API Type  | Component Type  | Approach |
|-----------|---------------|----------|
| **GET requests** | Server Components | Fetch data before rendering ✅ |
| **POST requests (user interactions)** | Client Components | Fetch inside event handlers ✅ |
| **Database updates** | Next.js API Routes | Use Next.js backend API ✅ |

By following these best practices, you ensure optimized performance and a better user experience in your Next.js applications. 🚀



## Image Domain Configuration for Next.js

If you are using Next.js's `<Image />` component with external images, ensure to configure allowed image domains in `next.config.js`. This prevents errors like:




### 📖 These notes will help me avoid the same mistakes in future Next.js projects! 🚀
