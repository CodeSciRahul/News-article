export async function fetchUserPrefernce(token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-preference`, {
      method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
    });
    return res.json();
  }
  