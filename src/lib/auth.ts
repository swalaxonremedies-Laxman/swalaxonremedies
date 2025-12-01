
"use server";

import { redirect } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import { initializeFirebase } from "@/firebase";

export async function logout() {
  // This server action is no longer used for logout.
  // The logic has been moved to a client component in the sidebar.
  // We keep the file in case it's used for other server-side auth logic in the future.
  redirect("/admin/login");
}
