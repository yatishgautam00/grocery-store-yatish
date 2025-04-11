"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProductItemDetail from "./ProductItemDetail";

function ProductItem({ item }) {
  return (
    <div className="p-5 md:p-6 flex flex-col items-center justify-center gap-3 border rounded-xl bg-white hover:scale-105 transition-all ease-in-out hover:shadow-lg">
      {item?.imgLink ? (
        <Image
          src={item.imgLink}
          alt={item.Name}
          width={150}
          height={150}
          className="h-36 w-36 object-contain rounded-md"
        />
      ) : (
        <div className="h-36 w-36 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded-md">
          No Image
        </div>
      )}

      <div className="text-center space-y-1">
        <h2 className="font-semibold text-lg text-green-800">{item.Name}</h2>
        <p className="text-sm text-gray-600">{item.type}</p>
        <h3 className="font-bold text-xl text-green-600">₹{item.price}</h3>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="text-green-600 cursor-pointer hover:bg-green-100 border-green-400"
          >
            Add to Cart
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{item.Name}</DialogTitle>
            <DialogDescription>
              <ProductItemDetail item={item} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProductItem;
