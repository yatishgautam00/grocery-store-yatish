"use client";
import React, { useEffect, useState } from "react";
import { getGroceryItems } from "@/app/FirebaseAPI";
import ProductItem from "./ProductItem";

function ProductList({selected}) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getGroceryItems().then(setItems);
  }, []);

  return (
    <div className="mt-10">
      <h2 className="text-green-700 font-bold text-2xl mb-5">Popular Items</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {selected? items.map((item, i) => selected == item.type && (
          <ProductItem key={i} item={item} />
        )): items.map((item, i) => i <12 && (
          <ProductItem key={i} item={item} />
        ))}
       
      </div>
    </div>
  );
}

export default ProductList;
