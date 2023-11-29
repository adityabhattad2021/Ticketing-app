import buildClient from "@/api/build-client";
import Link from "next/link"

async function getAuthStatus() {
  const axiosClient = buildClient();
  const { data } = await axiosClient.get('/api/users/currentUser');
  return data;
}

export default async function Home() {
  const currentUser = await getAuthStatus();
  console.log(currentUser);

  return (
    <div>
      <Link href={"/auth/sign-up"}>
        SignUp
      </Link>
    </div>
  )
}
