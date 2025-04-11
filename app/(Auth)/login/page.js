"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, checkAuthState } from "@/app/FirebaseAPI"; // update path as needed

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = checkAuthState((user) => {
      if (user) {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const { user, error } = await loginUser(email, password);
    if (user) {
      setError("");
      router.push("/"); // navigate to homepage
    } else {
      setError(error.message);
    }
  };

  return (
    <div className="pt-10 flex items-center justify-center">
      <div className="flex w-full shadow-xl rounded-2xl max-w-xl flex-col items-center justify-center p-10 bg-green-50 border-gray-200">
        <Image src={"/logo.png"} alt="logo" width={200} height={200} />
        <h2 className="font-bold text-3xl">Login to your account</h2>
        <div className="w-full flex flex-col gap-5 mt-7">
          <Input
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="cursor-pointer" onClick={handleLogin}>
            Login
          </Button>
          {error && <p className="text-red-500">{error}</p>}
          <p>
            Create an Account
            <Link
              href={"/create-account"}
              className="pl-2 text-blue-500 underline"
            >
              Click here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
