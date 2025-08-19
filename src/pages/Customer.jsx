import { useState } from "react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function UserAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      if (isLogin) {
        // 🔑 LOGIN
        const userCred = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCred.user;

        // fetch role from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const role = userDoc.data().role;
          setMessage("✅ Logged in successfully!");

          if (role === "barista") {
            window.location.href = "/barista";
          } else {
            window.location.href = "/order";
          }
        } else {
          setError("❌ No role assigned to this account.");
        }
      } else {
        // 📝 SIGNUP
        const userCred = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCred.user;

        // add Firestore record with role "user"
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          role: "user",
        });

        setMessage("✅ Account created successfully!");
        window.location.href = "/order";
      }
    } catch (err) {
      console.error(err);
      setError("❌ " + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto m-10  p-8 bg-blue-400 rounded-xl shadow-md ">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isLogin ? "👤 User Login" : "📝 User Signup"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      {message && <p className="mt-4 text-center text-green-600">{message}</p>}

      <p className="mt-6 text-center text-gray-600">
        {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-500 hover:underline"
        >
          {isLogin ? "Sign up here" : "Log in here"}
        </button>
      </p>
    </div>
  );
}
