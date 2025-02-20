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


## 📌Mistake 2: Mistake 2: Using axios in a Server Component
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

```bash
npx drizzle-kit generate
npx drizzle-kit push



### 📖 These notes will help me avoid the same mistakes in future Next.js projects! 🚀
