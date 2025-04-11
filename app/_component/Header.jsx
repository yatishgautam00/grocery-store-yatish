"use client";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Search, ShoppingBag } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { checkAuthState } from "../FirebaseAPI";
import { getAuth, signOut } from "firebase/auth";
import Link from "next/link";

function Header() {
  const [user, setUser] = useState("");

  useEffect(() => {
    const unsubscribe = checkAuthState((user) => {
      if (user) {
        setUser(user);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      setUser("");
      alert("You have successfully logged out!");
    } catch (error) {
      console.error("Error during logout:", error);
      alert("There was an issue logging out.");
    }
  };
  
  return (
    <div className="p-5 shadow-md h-[80px] justify-between items-center flex">
      <div className="flex items-center  gap-8">
        <Image src={"/logo.png"} alt="logo" width={170} height={50} />
        <Link
          href={"/category/Fruits"}
          className="md:flex hidden gap-2 items-center cursor-pointer border rounded-full p-2 px-10 bg-slate-200"
        >
          <LayoutGrid className="h-5 w-5" /> Category
        </Link>

        <div
          className="md:flex gap-3 items-center border rounded-full p-2
          px-5 hidden"
        >
          <Search />
          <input type="text" placeholder="Search" className="outline-none" />
        </div>
      </div>
      <div className="flex gap-5 items-center">
        <Link
          href={"/checkout"}
          className="flex outline hover:bg-black hover:text-white hover:scale-105 transition-all ease-in-out px-4 rounded-lg py-2 gap-2 items-center text-md font-bold"
        >
          <ShoppingBag /> Checkout
        </Link>

        {!user ? (
          <Link
            href={"/login"}
            className={
              "cursor-pointer outline hover:bg-black hover:text-white hover:scale-105 transition-all ease-in-out px-4 rounded-lg py-2 gap-2 items-center text-md font-bold"
            }
          >
            Login
          </Link>
        ) : (
          <Button
            onClick={handleLogout}
            variant={"destructive"}
            className={"cursor-pointer"}
          >
            Logout
          </Button>
        )}
      </div>
    </div>
  );
}

export default Header;
