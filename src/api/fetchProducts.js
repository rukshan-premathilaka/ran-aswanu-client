import { useCallback, useEffect, useState } from "react";
import { api } from "@/api/ApiService.js";
import ENDPOINTS from "@/api/endpoints.js";
import { getApiError } from "@/api/Apierror.js";

// GET /products is public (no login). Optional filters: { category, keyword }.
// The backend returns a plain array of published products from active farmers.
export async function fetchProducts(filters = {}) {
    const data = await api.call(ENDPOINTS.PRODUCTS.LIST_ALL, filters);
    return Array.isArray(data) ? data : [];
}

// GET /products/{listId}. A wrong id gives 404 -> the caller shows "Product not found".
export async function fetchProductById(listId) {
    return api.call(ENDPOINTS.PRODUCTS.GET_BY_ID(listId));
}

// Other products of the same category (no extra backend work needed).
export async function fetchRelatedProducts(product, max = 4) {
    if (!product?.category) return [];
    const list = await fetchProducts({ category: product.category });
    return list.filter((p) => p.listId !== product.listId).slice(0, max);
}

// Loads products and keeps them fresh (refetch on a slow timer and when the tab gets focus again).
// No sample data: an empty list stays empty and an error is shown as errorText.
export function useProducts(intervalMs = 60000) {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorText, setErrorText] = useState("");

    const load = useCallback(async () => {
        try {
            setProducts(await fetchProducts());
            setErrorText("");
        } catch (error) {
            setErrorText(getApiError(error).message);
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

    return { products, isLoading, errorText, reload: load };
}

export default fetchProducts;