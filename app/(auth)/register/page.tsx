"use client"
import React, { useRef } from 'react'
import { registerUser } from '../action';
import { signIn } from 'next-auth/react';

function Register() {

    const form = useRef<HTMLFormElement>(null);

    async function handleRegister() {

        const formData = new FormData(form.current!);
        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        if (
            !name ||
            !email ||
            !password
        ) return alert("Please fill all field")

        try {
            const reg = await registerUser(name, email, password)

            alert(reg)
        } catch (error) {

        }
    }


    return (
        <div className="bg-sky-100 flex justify-center items-center h-screen">
            <div className="w-1/2 h-screen hidden lg:block">
                <img src="https://img.freepik.com/fotos-premium/imagen-fondo_910766-187.jpg?w=826" alt="Placeholder Image" className="object-cover w-full h-full" />
            </div>
            <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
                <h1 className="text-2xl font-semibold mb-4">Register</h1>
                <form ref={form}>
                    <div className='mb-4 bg-sky-100'>
                        <label htmlFor="Name" className="block text-gray-600">Name</label>
                        <input required type="text" id="name" name="name" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" autoComplete="off" />
                    </div>
                    <div className='mb-4 bg-sky-100'>
                        <label htmlFor="email" className="block text-gray-600">Username</label>
                        <input required type="email" id="email" name="email" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" autoComplete="off" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-800">Password</label>
                        <input required type="password" id="password" name="password" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" autoComplete="off" />
                    </div>
                    <div className="mb-4 flex items-center">
                        <input type="checkbox" id="remember" name="remember" className="text-red-500" />
                        <label htmlFor="remember" className="text-green-900 ml-2">Remember Me</label>
                    </div>
                    <div className="mb-6 text-blue-500">
                        {/* <a href="#" className="hover:underline">Forgot Password?</a> */}
                    </div>
                    <button type="submit" onClick={handleRegister} className="bg-red-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full">Register</button>
                </form>
                <div className="mt-6 text-green-500 text-center flex flex-col gap-2">
                    <button className='w-full py-3 border border-red-500 rounded-md text-red-500' onClick={() => signIn("google", { redirect: true })}>Sign in with google</button>
                    <a href="/login" className="w-full py-3 border border-green-500 rounded-md text-green-500">Login Here</a>
                </div>
            </div>
        </div>
    )
}

export default Register
