"use client";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";


const font = Poppins({
    weight: "600",
    subsets: ['latin']
})

const routes = [
    {
        href: "/auth/sign-in",
        label: "Sign In",
        logined: false
    },
    {
        href: "/auth/sign-up",
        label: "Sign Up",
        logined: false
    },
]

interface NavbarProps {
    currentUser: {
        email: string,
        id: string,
        iat: number
    }
}


export default function Navbar({ currentUser }: NavbarProps) {

    const router = useRouter();
    
    async function onClick(label:string){
        switch(label){
            case 'Sign In':{
                router.push('/auth/sign-in');
                break;
            }
            case 'Sign Up':{
                router.push('/auth/sign-up');
                break;
            }
            case 'Sign Out':{
                await axios.post('/api/users/signout');
                router.refresh();
                router.push('/');
                break;
            }
            default:{
                throw new Error('Invalid Route');
            }
        }
    }

    return (
        <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-secondary h-16">
            <div className="flex text-3xl items-center">
                <h1 className={font.className}>
                    GitTix
                </h1>
            </div>
            <div className="flex items-center gap-x-3">
                {
                    currentUser===null ? routes.map((route) => {
                        return (
                            <Button key={route.href} variant={"ghost"} onClick={()=>onClick(route.label)}>
                                <h1 className={cn("font-bold text-lg cursor-pointer", font.className)} >
                                    {route.label}
                                </h1>
                            </Button>
                        )
                    }) : (
                        <Button variant={"ghost"} onClick={()=>onClick('Sign Out')}>
                            <h1 className={cn("font-bold text-lg cursor-pointer", font.className)} >
                                Sign Out
                            </h1>
                        </Button>
                    )
                }

            </div>
        </div>
    )
}