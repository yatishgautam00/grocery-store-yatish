"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getCategories } from "@/app/FirebaseAPI"; // adjust if your path is different
import Link from "next/link";

function CategoryList({title, selected  }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getCategories();
      setCategories(result);
    };
    fetchCategories();
  }, []);

  return (
    <div className="mt-10">
      <h2 className={`text-green-700 font-bold text-2xl ${title =="hide" ? "hidden": "visible"} `}>Shop by Category</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-5 mt-4">
        {categories.map((category, index) => (
          <Link
            key={index}
            href={"/category/"+category?.name}
            className={`${selected ==category.name ? "bg-green-500 hover:bg-green-500": ""} flex flex-col items-center bg-green-50 py-8 p-4 rounded-lg gap-2 group cursor-pointer hover:bg-green-300`}
          >
            <Image
              src={category?.imgLink}
              width={50}
              height={50}
              alt={category.name}
              className="group-hover:scale-125 transition-all ease-in-out"
            />
            <h2 className="text-green-800 font-bold">{category.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoryList;
