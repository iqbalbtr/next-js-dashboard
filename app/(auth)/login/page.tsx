"use client"
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { useRef } from 'react'

function Login() {

    const navigate = useRouter();

    const form = useRef<HTMLFormElement>(null);

    async function handleLogin() {

        const formData = new FormData(form.current!);

        const payload = {
            email: formData.get("email"),
            password: formData.get("password"),
        }

        if(!payload.email  || !payload.password)
            alert("please fill all field")

        const res = await signIn("credentials", {
            ...payload,
            redirect: false
        })

        if (!res?.ok){
            alert("Email or password is wrong!")
        } else {
            navigate.push("/dashboard")
        }
    }

    return (
        <div className="bg-sky-100 flex justify-center items-center h-screen">
            <div className="w-1/2 h-screen hidden lg:block">
                <img src="https://img.freepik.com/fotos-premium/imagen-fondo_910766-187.jpg?w=826" alt="Placeholder Image" className="object-cover w-full h-full" />
            </div>
            <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
                <h1 className="text-2xl font-semibold mb-4">Login</h1>
                <form ref={form} action="#" method="POST">
                    <div className='mb-4 bg-sky-100'>
                        <label htmlFor="email" className="block text-gray-600">email</label>
                        <input type="email" required id="email" name="email" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" autoComplete="off" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-800">Password</label>
                        <input type="password" required id="password" name="password" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" autoComplete="off" />
                    </div>
                    <button type="button" onClick={handleLogin} className="bg-red-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full">Login</button>
                </form>
                <div className="mt-6 text-green-500 text-center flex flex-col gap-2">
                    <button className='w-full py-3 border border-red-500 rounded-md text-red-500' onClick={() => signIn("google")}>Sign in with google</button>
                    <a href="/register" className="w-full py-3 border border-green-500 rounded-md text-green-500">Sign up Here</a>
                </div>
            </div>
        </div>
    )
}

export default Login
