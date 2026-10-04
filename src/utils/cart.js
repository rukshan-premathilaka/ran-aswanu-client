// The cart lives in the browser (team decision D2): localStorage + a small change event.
// Item shape: { listId, productName, pricePerUnit, unitOfMeasurement, minimumOrderQuantity, availableStock, quantity }
const CART_KEY = "ran_aswanu_cart";
const CART_EVENT = "cart:changed";

export function getCart() {
    try {
        const list = JSON.parse(localStorage.getItem(CART_KEY) ?? "[]");
        return Array.isArray(list) ? list : [];
    } catch {
        return [];
    }
}

function saveCart(items) {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
        // storage full or blocked: the cart simply is not saved
    }
    window.dispatchEvent(new Event(CART_EVENT));
}

export function addToCart(product, quantity) {
    const items = getCart();
    const qty = Number(quantity) || Number(product.minimumOrderQuantity) || 1;
    const existing = items.find((i) => i.listId === product.listId);
    if (existing) {
        existing.quantity = Number(existing.quantity) + qty;
    } else {
        items.push({
            listId: product.listId,
            productName: product.productName,
            pricePerUnit: product.pricePerUnit,
            unitOfMeasurement: product.unitOfMeasurement,
            minimumOrderQuantity: product.minimumOrderQuantity,
            availableStock: product.availableStock,
            quantity: qty,
        });
    }
    saveCart(items);
}

export function updateCartQuantity(listId, quantity) {
    saveCart(getCart().map((i) => (i.listId === listId ? { ...i, quantity: Number(quantity) } : i)));
}

export function removeFromCart(listId) {
    saveCart(getCart().filter((i) => i.listId !== listId));
}

export function removeManyFromCart(listIds) {
    saveCart(getCart().filter((i) => !listIds.includes(i.listId)));
}

export function cartCount() {
    return getCart().length;
}

// For React: const unsubscribe = onCartChange(() => ...)
export function onCartChange(callback) {
    window.addEventListener(CART_EVENT, callback);
    window.addEventListener("storage", callback); // other tab
    return () => {
        window.removeEventListener(CART_EVENT, callback);
        window.removeEventListener("storage", callback);
    };
}