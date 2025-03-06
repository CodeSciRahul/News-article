import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard"); //it will redirect in server
}
