import axios from "axios"
import Link from "next/link"
import { headers } from 'next/headers'


async function getAuthStatus() {


  let response;
  if (typeof window === 'undefined') {
    const headersObj = {};
    headers().forEach((header, key) => {
      //@ts-ignore
      headersObj[key] = header;
    });
    response = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentUser',
      {
        headers: headersObj
      }
    );
  } else {
    response = await axios.get('/api/users/currentUser');
  }
  return response.data;
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
