// Settings for the Home page. Edit values here, no need to touch the section components.
import aerialFarm from "@/assets/3985.jpg";

export const BRAND_NAME = "Ran Aswanu";
export const BRAND_TAGLINE = "Smart Farming & Crop Selling System";

// Desktop app download link. The "Download Desktop App" buttons are shown ONLY when this is set.
// Put the real release link here, or set VITE_DESKTOP_APP_URL in your .env file.
export const DESKTOP_APP_URL = (import.meta.env.VITE_DESKTOP_APP_URL || "").trim();

// Footer contact details. A row is hidden while its value is empty (no fake details are shown).
export const CONTACT = {
    email: (import.meta.env.VITE_CONTACT_EMAIL || "").trim(),
    phone: (import.meta.env.VITE_CONTACT_PHONE || "").trim(),
    location: "Sri Lanka",
    support: (import.meta.env.VITE_SUPPORT_EMAIL || "").trim(),
};

// Images. `src` is tried first, then `fallback`, then a clean icon placeholder (so nothing ever looks broken).
// To use your own photos: put them in src/assets/home/, import them above, and set them here.
export const HOME_IMAGES = {
    hero: {
        src: "https://images.unsplash.com/photo-1648090229186-6188eaefcc6a?q=80&w=1200&auto=format&fit=crop",
        fallback: aerialFarm,
        alt: "Basket of freshly harvested vegetables",
    },
    becomeFarmer: { src: aerialFarm, alt: "Green farmland seen from above" },
    finalCta: { src: aerialFarm, alt: "" },
    // Real screenshots (optional). While null, a drawn mockup is shown instead.
    desktopScreenshot: null,
    dashboardScreenshot: null,
    mobileScreenshot: null,
};
