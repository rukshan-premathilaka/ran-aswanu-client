// The cart lives in the browser (team decision D2): localStorage + a small change event.
// Item shape: { listId, productName, pricePerUnit, unitOfMeasurement, minimumOrderQuantity, availableStock, quantity,
//               farmerId, farmerName, productImage }   (farmer + image are used to group the cart by seller)
const CART_KEY = "ran_aswanu_cart";
const CART_EVENT = "cart:changed";

// Number or null (null, "" and NaN all mean "no value")
const toNum = (v) => {
    if (v === null || v === undefined || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
};

export function getCart() {
    try {
        const list = JSON.parse(localStorage.getItem(CART_KEY) ?? "[]");
        // drop anything that is not a real item, so one bad entry can never crash the cart page
        return Array.isArray(list) ? list.filter((i) => i && i.listId != null) : [];
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
    const qty = toNum(quantity) || toNum(product.minimumOrderQuantity) || 1;
    const existing = items.find((i) => i.listId === product.listId);

    if (existing) {
        // refresh the details that can change on the seller's side
        existing.pricePerUnit = product.pricePerUnit ?? existing.pricePerUnit;
        existing.availableStock = product.availableStock ?? existing.availableStock;
        existing.minimumOrderQuantity = product.minimumOrderQuantity ?? existing.minimumOrderQuantity;

        let next = (toNum(existing.quantity) || 0) + qty;
        const stock = toNum(existing.availableStock);
        if (stock !== null && stock > 0) next = Math.min(next, stock); // never go above the stock
        existing.quantity = next;

        // items added before the cart knew the farmer get it now
        existing.farmerId = existing.farmerId ?? product.farmerId;
        existing.farmerName = existing.farmerName ?? product.farmerName;
        existing.productImage = existing.productImage ?? product.productImage;
    } else {
        items.push({
            listId: product.listId,
            productName: product.productName,
            pricePerUnit: product.pricePerUnit,
            unitOfMeasurement: product.unitOfMeasurement,
            minimumOrderQuantity: product.minimumOrderQuantity,
            availableStock: product.availableStock,
            quantity: qty,
            farmerId: product.farmerId,
            farmerName: product.farmerName,
            productImage: product.productImage,
        });
    }
    saveCart(items);
}

// The quantity box can be empty while the user is typing, so "" is kept as "" (the page shows a message for it).
export function updateCartQuantity(listId, quantity) {
    const value = toNum(quantity);
    saveCart(getCart().map((i) => (i.listId === listId ? { ...i, quantity: value === null ? "" : value } : i)));
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
