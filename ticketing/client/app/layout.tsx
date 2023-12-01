import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import buildClient from "@/api/build-client"
import Navbar from "@/components/navbar"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Ticketing App',
  description: 'with microservices architecture backend',
}

async function getAuthStatus() {
  const axiosClient = buildClient();
  const { data } = await axiosClient.get('/api/users/currentUser');
  return data;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const data: any = await getAuthStatus();

  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar currentUser={data.currentUser} />
        {children}
        <Toaster />
      </body>
    </html>
  )

}
