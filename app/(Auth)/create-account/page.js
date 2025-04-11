"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  registerUser,
  checkAuthState,
  saveUserToFirestore,
} from "@/app/FirebaseAPI";

function CreateAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
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

  const handleSignup = async () => {
    const { user, error } = await registerUser(email, password);
    if (user) {
      const saveResult = await saveUserToFirestore(user.uid, email, username);
      if (saveResult.success) {
        console.log("account created");
        setError("");
        router.push("/");
      } else {
        setError("Signup succeeded but failed to save user data.");
      }
      //   console.log("User:", user);
    } else {
      setError(error.message);
    }
  };

  return (
    <div className="pt-10 flex items-center justify-center">
      <div className="flex w-full shadow-xl rounded-2xl max-w-xl flex-col items-center justify-center p-10 bg-green-50 border-gray-200">
        <Image src={"/logo.png"} alt="logo" width={200} height={200} />
        <h2 className="font-bold text-3xl">Create an Account</h2>
        <h2>Enter your Email and Password to create a new account</h2>
        <div className="w-full flex flex-col gap-5 mt-7">
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
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
          <Button className="cursor-pointer" onClick={handleSignup}>
            Create an Account
          </Button>

          {error && <p className="text-red-500">{error}</p>}

          <p>
            Already have an account?
            <Link href={"/login"} className="pl-2 text-blue-500 underline">
              Click here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
