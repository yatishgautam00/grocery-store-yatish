import { Button } from "@/components/ui/button";
import { ShoppingBasket } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { addToCart } from "@/app/FirebaseAPI"; // Correct path for FirebaseAPI.js

function ProductItemDetail({ item }) {
  const [isAdding, setIsAdding] = useState(false);

  // Function to validate the product object
  const validateProduct = (product) => {
    // Check if required fields are present and not undefined
    if (!product.imgLink || !product.product_name || !product.price) {
      console.error("Invalid product data:", product);
      return false;
    }
    return true;
  };

  const handleAddToCart = async () => {
    setIsAdding(true);

    // Create the product object to be added to the cart
    const product = {
      imgLink: item?.imgLink || "", // Provide fallback value if imgLink is undefined
      status: "pending",
      date: new Date().toISOString(),
      product_name: item?.Name, // Provide fallback value for name
      price: item?.price || 0, // Provide fallback value for price
      desc: item?.desc || "", // Provide fallback value for description
      quantity: item?.quantity || "1kg", // Provide fallback value for quantity
    };

    // Validate the product before adding to the cart
    if (!validateProduct(product)) {
      alert("Product data is invalid. Please check the details.");
      setIsAdding(false);
      return;
    }

    try {
      // Call the addToCart function to save the product to Firestore
      await addToCart(product);
      alert("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart.");
    }
    setIsAdding(false);
  };

  return (
    <span className="grid grid-cols-1 md:grid-cols-2 p-2 bg-white text-black md:gap-10 gap-4">
      <Image
        src={item?.imgLink || "/default-image.png"} // Fallback if imgLink is undefined
        alt={item?.Name || "Product"} // Fallback for alt text
        width={300}
        height={300}
        className="bg-slate-200 p-5 h-[320px] w-[300px] object-contain rounded-lg"
      />
      <span className="flex flex-col items-start gap-4">
        <span className="text-2xl font-bold">
          {item?.Name || "Unknown Product"}
        </span>
        <span className="text-sm text-gray-500">
          {item?.desc || "No description available"}
        </span>
        <span className="flex gap-3">
          <span className="text-2xl font-bold">₹{item?.price || "0"}</span>
        </span>
        <span className="font-bold">Quantity ({item?.quantity || "1kg"})</span>

        <Button
          className="space-x-2 cursor-pointer"
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          <ShoppingBasket />
          {isAdding ? "Adding..." : "Add to Cart"}
        </Button>
      </span>
    </span>
  );
}

export default ProductItemDetail;
