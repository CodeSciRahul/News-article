import { currentUser } from "@clerk/nextjs/server";

export default async function Page() {
    const user = await currentUser();
    if (!user) return <div>Loading...</div>;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user-preference/${user.id}`);
      const checkUserPreference = await response.json();
      console.log("User Preference:", checkUserPreference);
    } catch (error) {
      
    }


    return (
        <div>
            Dashboard content is protected.
            {user.firstName}
            {user.id}
        </div>
    );
}
