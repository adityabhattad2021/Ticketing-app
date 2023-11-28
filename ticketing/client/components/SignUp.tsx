"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form"
import { useToast } from "./ui/use-toast";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";



const formSchema = z.object({
    email: z.string(),
    password: z.string().min(8, {
        message: "Minimum length for password should be 8."
    }).max(20, {
        message: 'Password max be 20 characters big.'
    })
})


export default function SignUpFrom() {

    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })
    const { toast } = useToast();

    const isLoading = form.formState.isSubmitted;

    async function handleOnSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        // make an axios request here
        try {
            const response = await axios.post(
                '/api/users/signup',
                values
            )
            console.log(response);
            toast({
                title:"Welcome",
                description: "Successfully signed up!"
            })
            router.push('/');
        } catch (error) {
            // @ts-ignore
            error.response.data.errors.map(err=>{
                toast({
                    variant: "destructive",
                    description: err.message
                })
            })
        }
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Signup
                </CardTitle>
                <CardDescription>
                    Sign up to this Ticketing App (alpha preview).
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-8 max-w-[380px]">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field})=>{
                                return (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="name@email.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            This is your identifier throughout the app.
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )
                            }}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field})=>{
                                return (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="your password here..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            We suggest you to take a note of your password, as we do have forgot password functionality just yet.
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )
                            }}
                        />
                        <div className="w-full flex justify-center items-center" >
                            <Button size={"lg"} type="submit">Submit</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
