'use client'
import React, { useEffect, useState } from "react";
import { db, auth } from "@/app/Firebase"; // Firebase setup
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Firestore methods
import { Button } from "@/components/ui/button"; // UI Button component
import Image from "next/image"; // Next.js Image component

function Checkout() {
  const [cartData, setCartData] = useState({ pending: [], ordered: [] });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // Track the authenticated user

  // Check if the user is authenticated
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Set the user when authentication state changes
      setLoading(false); // Set loading to false once the user state is determined
    });

    return () => unsubscribe(); // Clean up the listener on component unmount
  }, []);

  // Fetch cart data from Firestore based on the user's email
  useEffect(() => {
    const fetchCartData = async () => {
      if (!user) return; // Don't proceed if the user is not authenticated

      setLoading(true);
      try {
        const userEmail = user.email;
        const checkoutRef = doc(db, "checkout", userEmail);
        const checkoutSnap = await getDoc(checkoutRef);

        if (checkoutSnap.exists()) {
          const data = checkoutSnap.data();
          const pendingProducts = data.products.filter(
            (item) => item.status === "pending"
          );
          const orderedProducts = data.products.filter(
            (item) => item.status === "ordered"
          );

          setCartData({
            pending: pendingProducts.sort(
              (a, b) => new Date(a.date) - new Date(b.date)
            ),
            ordered: orderedProducts.sort(
              (a, b) => new Date(a.date) - new Date(b.date)
            ),
          });
        } else {
          console.log("No cart data found for this user.");
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCartData();
    }
  }, [user]); // Only fetch cart data when the user is available

  // Update product status from 'pending' to 'ordered'
  const updateOrderStatus = async (product) => {
    setLoading(true);
    try {
      const userEmail = user.email;
      const checkoutRef = doc(db, "checkout", userEmail);

      const checkoutSnap = await getDoc(checkoutRef);
      if (checkoutSnap.exists()) {
        const data = checkoutSnap.data();
        const updatedProducts = data.products.map((item) => {
          if (item.date === product.date) {
            return { ...item, status: "ordered" };
          }
          return item;
        });

        await updateDoc(checkoutRef, {
          products: updatedProducts,
        });

        // Update local state to reflect the change
        setCartData((prevData) => ({
          ...prevData,
          pending: prevData.pending.filter((item) => item.date !== product.date),
          ordered: [...prevData.ordered, { ...product, status: "ordered" }], // Add to ordered list
        }));
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view your cart.</div>;
  }

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold text-green-800">Your Cart</h2>

      {/* Pending Orders */}
      {cartData.pending.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-700">Pending Orders</h3>
          <div className="mt-4">
            {cartData.pending.map((product) => (
              <div
                key={product.date}
                className="flex md:items-center items-start gap-2  md:flex-row flex-col justify-between w-full max-w-2xl p-4 bg-green-50 rounded-lg mb-4"
              >
                <Image
                  src={product.imgLink}
                  alt={product.product_name}
                  width={50}
                  height={50}
                  className="rounded-lg"
                />
                <div>
                  <p className="font-semibold text-green-700">{product.product_name}</p>
                  <p className="text-gray-500">₹{product.price}</p>
                </div>
                <Button
                  className="bg-green-500 text-white"
                  onClick={() => updateOrderStatus(product)}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Mark as Ordered"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ordered Products */}
      {cartData.ordered.length > 0 && (
        <div className="mt-10 ">
          <h3 className="text-xl font-semibold text-gray-700">Ordered Products</h3>
          <div className="mt-4">
            {cartData.ordered.map((product) => (
              <div
                key={product.date}
                className="flex items-center w-full max-w-md justify-around p-4 bg-gray-100 rounded-lg mb-4"
              >
                <Image
                  src={product.imgLink}
                  alt={product.product_name}
                  width={50}
                  height={50}
                  className="rounded-lg"
                />
                <div>
                  <p className="font-semibold text-green-700">{product.product_name}</p>
                  <p className="text-gray-500">₹{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {cartData.pending.length === 0 && cartData.ordered.length === 0 && (
        <div className="text-center text-gray-500 mt-4">
          Your cart is empty.
        </div>
      )}
    </div>
  );
}

export default Checkout;
