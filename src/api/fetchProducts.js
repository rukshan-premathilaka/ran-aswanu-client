import { useCallback, useEffect, useState } from "react";
import { api } from "@/api/ApiService.js";

// Backend path for the product list. Change this if your Spring Boot controller uses another path.
// The full URL becomes: http://localhost:8080/api + PRODUCTS_URL
const PRODUCTS_URL = "/products";

// Sample vegetables shown while the backend returns nothing (or can't be reached).
// Photos come from the loremflickr placeholder service (random photo by keyword).
// To use your own pictures, replace any imageUrl with a direct image link.
const photo = (keyword, n) => `https://loremflickr.com/600/800/${keyword}?lock=${n}`;
export const DEMO_PRODUCTS = [
    { id: "demo-1", name: "Carrots", price: 180, emoji: "🥕", farmerName: "Sunil Perera", location: "Nuwara Eliya", imageUrl: photo("carrot,vegetable", 1) },
    { id: "demo-2", name: "Tomatoes", price: 140, emoji: "🍅", farmerName: "Kamala Silva", location: "Dambulla", imageUrl: photo("tomato,vegetable", 2) },
    { id: "demo-3", name: "Cabbage", price: 120, emoji: "🥬", farmerName: "Nimal Bandara", location: "Bandarawela", imageUrl: photo("cabbage,vegetable", 3) },
    { id: "demo-4", name: "Brinjals", price: 160, emoji: "🍆", farmerName: "Priyanka Fernando", location: "Matale", imageUrl: photo("eggplant,vegetable", 4) },
    { id: "demo-5", name: "Potatoes", price: 200, emoji: "🥔", farmerName: "Chaminda Rathnayake", location: "Welimada", imageUrl: photo("potato,vegetable", 5) },
    { id: "demo-6", name: "Corn", price: 90, emoji: "🌽", farmerName: "Ranjith Kumara", location: "Anuradhapura", imageUrl: photo("corn,vegetable", 6) },
    { id: "demo-7", name: "Green Chillies", price: 350, emoji: "🌶️", farmerName: "Lakmini Jayasinghe", location: "Jaffna", imageUrl: photo("chili,pepper", 7) },
    { id: "demo-8", name: "Pumpkin", price: 110, emoji: "🎃", farmerName: "Saman Wijesekara", location: "Kurunegala", imageUrl: photo("pumpkin,vegetable", 8) },
];

// Returns an array of products. Accepts [..], { products: [..] }, { content: [..] } (Spring Page),
// { data: [..] } or { items: [..] } from the backend.
export async function fetchProducts() {
    const data = await api.request("GET", PRODUCTS_URL);
    console.log("[fetchProducts] response from", PRODUCTS_URL, data);

    if (Array.isArray(data)) return data;
    for (const key of ["products", "content", "data", "items", "listings"]) {
        if (Array.isArray(data?.[key])) return data[key];
    }
    return [];
}

// Loads products and keeps them fresh: refetches every few seconds and when the tab gets focus again.
// If the backend gives nothing (or fails), the sample vegetables are returned and isDemo is true.
export function useProducts(intervalMs = 10000) {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDemo, setIsDemo] = useState(false);

    const load = useCallback(async () => {
        try {
            const list = await fetchProducts();
            if (list.length > 0) {
                setProducts(list);
                setIsDemo(false);
            } else {
                setProducts(DEMO_PRODUCTS);
                setIsDemo(true);
            }
        } catch (error) {
            console.warn(`[fetchProducts] could not load ${PRODUCTS_URL}, showing sample products`, error);
            setProducts(DEMO_PRODUCTS);
            setIsDemo(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
        const timer = setInterval(load, intervalMs);
        const onFocus = () => load();
        window.addEventListener("focus", onFocus);
        return () => {
            clearInterval(timer);
            window.removeEventListener("focus", onFocus);
        };
    }, [load, intervalMs]);

    return { products, isLoading, isDemo, errorText: "" };
}

export default fetchProducts;