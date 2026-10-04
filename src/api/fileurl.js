// src/api/fileUrl.js
// The backend returns image paths like /files/product-images/abc.jpg. The browser needs the full address.
const FILE_BASE_URL = "http://localhost:8080";

export function fileUrl(path) {
    if (!path) return null;                       // no image: show a placeholder in the page
    if (path.startsWith("http")) return path;
    return FILE_BASE_URL + (path.startsWith("/files/") ? path : "/files/" + path);
}