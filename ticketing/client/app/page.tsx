import axios from "axios"
import Image from 'next/image'
import Link from "next/link"

async function getAuthStatus() {
  let response;
  if(typeof window==='undefined'){
    response = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentUser',
      {
        headers: {
          Host: "ticketing.xyz"
        }
      }
    );
  }else{
    response= await axios.get('/api/users/currentUser');
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
