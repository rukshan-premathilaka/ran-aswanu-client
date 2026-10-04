import { useCallback, useEffect, useState } from "react";
import "@/component/home/home.css";
import { useProducts } from "@/api/fetchProducts.js";
import { useCurrentUser } from "@/utils/useCurrentUser.js";
import ProductsPage from "@/page/public/ProductsPage.jsx";
import ProductDetailView from "@/component/ProductDetailView.jsx";

import HomeLoader from "@/component/home/HomeLoader.jsx";
import SectionBoundary from "@/component/home/SectionBoundary.jsx";
import { markLoaderSeen, shouldShowLoader } from "@/component/home/homeUtils.js";
import HomeHeader from "@/component/home/HomeHeader.jsx";
import HeroSection from "@/component/home/HeroSection.jsx";
import BenefitsSection from "@/component/home/BenefitsSection.jsx";
import UserRolesSection from "@/component/home/UserRolesSection.jsx";
import HowItWorksSection from "@/component/home/HowItWorksSection.jsx";
import FreshPicksSection from "@/component/home/FreshPicksSection.jsx";
import SmartFarmSection from "@/component/home/SmartFarmSection.jsx";
import SharedDeliverySection from "@/component/home/SharedDeliverySection.jsx";
import MoreFeaturesSection from "@/component/home/MoreFeaturesSection.jsx";
import BecomeFarmerSection from "@/component/home/BecomeFarmerSection.jsx";
import FutureSmartSection from "@/component/home/FutureSmartSection.jsx";
import MobileAppSection from "@/component/home/MobileAppSection.jsx";
import DesktopAppSection from "@/component/home/DesktopAppSection.jsx";
import FinalCTASection from "@/component/home/FinalCTASection.jsx";
import Footer from "@/component/home/Footer.jsx";

// Landing page (route: /home).
// view "home"     = the long landing page
// view "products" = the products list (ProductsPage) opened inside Home, with a back button
// selected        = a product opened from Fresh Picks (detail page with a back bar)
export function Home() {
    const { products, isLoading, errorText } = useProducts();
    const { isLoggedIn, username, picture } = useCurrentUser();

    const [view, setView] = useState("home");
    const [selected, setSelected] = useState(null);

    // The branded loader plays once per tab session. The hero animation starts when it finishes.
    const [showLoader] = useState(() => shouldShowLoader());
    const [ready, setReady] = useState(!showLoader);

    // Must be stable: HomeLoader has it in a useEffect dependency list
    const handleLoaderFinish = useCallback(() => {
        markLoaderSeen();
        setReady(true);
    }, []);

    const openProducts = useCallback(() => {
        setSelected(null);
        setView("products");
    }, []);

    const backToHome = useCallback(() => {
        setSelected(null);
        setView("home");
    }, []);

    // Every time the view changes, start from the top of the page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [view]);

    if (selected) {
        return <ProductDetailView product={selected} onBack={() => setSelected(null)} />;
    }

    if (view === "products") {
        return <ProductsPage onBack={backToHome} />;
    }

    return (
        <div className={`home-root ${ready ? "is-ready" : ""} min-h-screen w-full bg-white`}>
            {showLoader && <HomeLoader onFinish={handleLoaderFinish} />}

            <HomeHeader isLoggedIn={isLoggedIn} username={username} picture={picture} onOpenProducts={openProducts} />

            <main>
                <SectionBoundary name="Hero"><HeroSection onOpenProducts={openProducts} /></SectionBoundary>
                <SectionBoundary name="Benefits"><BenefitsSection /></SectionBoundary>
                <SectionBoundary name="User roles"><UserRolesSection onOpenProducts={openProducts} /></SectionBoundary>
                <SectionBoundary name="How it works"><HowItWorksSection /></SectionBoundary>
                <SectionBoundary name="Fresh picks">
                    <FreshPicksSection
                        products={products}
                        isLoading={isLoading}
                        errorText={errorText}
                        onSelect={setSelected}
                        onSeeAll={openProducts}
                    />
                </SectionBoundary>
                <SectionBoundary name="Smart farm"><SmartFarmSection /></SectionBoundary>
                <SectionBoundary name="Shared delivery"><SharedDeliverySection /></SectionBoundary>
                <SectionBoundary name="More features"><MoreFeaturesSection /></SectionBoundary>
                <SectionBoundary name="Become a farmer"><BecomeFarmerSection /></SectionBoundary>
                <SectionBoundary name="Future"><FutureSmartSection /></SectionBoundary>
                <SectionBoundary name="Mobile app"><MobileAppSection /></SectionBoundary>
                <SectionBoundary name="Desktop app"><DesktopAppSection /></SectionBoundary>
                <SectionBoundary name="Final call to action"><FinalCTASection onOpenProducts={openProducts} /></SectionBoundary>
            </main>

            <Footer onOpenProducts={openProducts} />
        </div>
    );
}

export default Home;
