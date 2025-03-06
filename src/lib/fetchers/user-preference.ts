export async function fetchUserPrefernce() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`, {
      cache: "no-store", // Ensure fresh data
    });
  
    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }
  
    return res.json();
  }
  