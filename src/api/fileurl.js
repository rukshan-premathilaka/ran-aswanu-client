// src/api/fileUrl.js
// The backend returns image paths like /files/product-images/abc.jpg. The browser needs the full address.
// The backend address comes from VITE_FILES_BASE_URL / VITE_API_BASE_URL (see src/api/config.js).
import { toFileUrl } from "@/api/config.js";

export function fileUrl(path) {
    return toFileUrl(path); // null when there is no image: show a placeholder in the page
}
