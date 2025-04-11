// src/app/FirebaseAPI.js
import { auth } from "./Firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, doc,  query, where, setDoc, updateDoc, getDoc,  collection, getDocs } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

const db = getFirestore();

// Register new user and return user or error
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error };
  }
};

// Save user data to Firestore
export const saveUserToFirestore = async (uid, email, username) => {
  try {
    await setDoc(doc(db, "users", uid), {
      email,
      username,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

// Auth state checker
export const checkAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error };
  }
};


export const getCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "category"));
      const categories = [];
  
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        categories.push({
          name: data.Name,
          imgLink: data.imgLink,
        });
      });
  
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  };


  export const getGroceryItems = async () => {
    try {
      const snapshot = await getDocs(collection(db, "grocery_items"));
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (err) {
      console.error("Error fetching grocery items:", err);
      return [];
    }
  };
  


  export const addToCart = async (product) => {
    const user = auth.currentUser;
    if (user) {
      const userEmail = user.email;
      const cartRef = doc(db, "checkout", userEmail);
  
      const cartSnapshot = await getDoc(cartRef);
      if (cartSnapshot.exists()) {
        // If cart already exists, update it with new product
        await setDoc(cartRef, {
          products: [...cartSnapshot.data().products, product],
        });
      } else {
        // If cart doesn't exist, create a new cart with the product
        await setDoc(cartRef, {
          products: [product],
        });
      }
    }
  };


  // Function to update product status to "ordered"
export const updateProductStatus = async (productDate) => {
    const user = auth.currentUser;
    if (user) {
      const userEmail = user.email;
      const cartRef = doc(db, "checkout", userEmail);
  
      const cartSnapshot = await getDoc(cartRef);
      if (cartSnapshot.exists()) {
        const cartData = cartSnapshot.data();
        const updatedProducts = cartData.products.map(product => 
          product.date === productDate 
            ? { ...product, status: "ordered" }  // Update status
            : product
        );
        
        // Update the Firestore document with the new product list
        await updateDoc(cartRef, { products: updatedProducts });
      }
    }
  };

  export const getCartData = async (email) => {
    try {
      const cartRef = collection(db, "carts");  // Replace with your correct collection name
      const q = query(cartRef, where("userEmail", "==", email));
      const querySnapshot = await getDocs(q);
      const cartData = [];
      querySnapshot.forEach((doc) => {
        cartData.push(doc.data());
      });
      return cartData;
    } catch (error) {
      console.error("Error getting cart data:", error);
      return [];
    }
  };