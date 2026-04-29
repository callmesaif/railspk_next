"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        // User ki IP fetch karna
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipRes.json();

        // Firebase mein analytics save karna
        await addDoc(collection(db, "analytics"), {
          ip: ipData.ip,
          userAgent: navigator.userAgent,
          path: pathname, // Current page path
          timestamp: serverTimestamp(),
          platform: navigator.platform,
          referrer: document.referrer || "direct"
        });
      } catch (err) {
        console.error("Tracking error:", err);
      }
    };

    trackVisit();
  }, [pathname]); // Jab bhi page change hoga, visit track hogi

  return null; // Yeh component kuch dikhayega nahi
}