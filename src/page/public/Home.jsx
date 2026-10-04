import { useCallback, useEffect, useRef, useState } from "react";
import { useProducts } from "@/api/fetchProducts.js";
import ProductsPage from "./ProductsPage.jsx";
import ProductDetailView from "@/component/ProductDetailView.jsx";
import { useCurrentUser } from "@/utils/useCurrentUser.js";

import "@/component/home/home.css";
import { markLoaderSeen, shouldShowLoader } from "@/component/home/homeUtils.js";
import SectionBoundary from "@/component/home/SectionBoundary.jsx";
import HomeLoader from "@/component/home/HomeLoader.jsx";
import HomeHeader from "@/component/home/HomeHeader.jsx";
import HeroSection from "@/component/home/HeroSection.jsx";
import BenefitsSection from "@/component/home/BenefitsSection.jsx";
import UserRolesSection from "@/component/home/UserRolesSection.jsx";
import HowItWorksSection from "@/component/home/HowItWorksSection.jsx";
import BecomeFarmerSection from "@/component/home/BecomeFarmerSection.jsx";
import FreshPicksSection from "@/component/home/FreshPicksSection.jsx";
import SharedDeliverySection from "@/component/home/SharedDeliverySection.jsx";
import SmartFarmSection from "@/component/home/SmartFarmSection.jsx";
import DesktopAppSection from "@/component/home/DesktopAppSection.jsx";
import MobileAppSection from "@/component/home/MobileAppSection.jsx";
import MoreFeaturesSection from "@/component/home/MoreFeaturesSection.jsx";
import FutureSmartSection from "@/component/home/FutureSmartSection.jsx";
import FinalCTASection from "@/component/home/FinalCTASection.jsx";
import Footer from "@/component/home/Footer.jsx";

// Home page. Each part of the page lives in its own file in src/component/home/.
// Story order: Understand -> Trust -> Explore -> Act.
export function Home() {
	const { isLoggedIn, username, picture } = useCurrentUser();

	// Branded loader (plays once per tab session). `ready` starts the hero animation.
	const [showLoader] = useState(shouldShowLoader);
	const [ready, setReady] = useState(() => !showLoader);
	const handleLoaderFinish = useCallback(() => {
		markLoaderSeen();
		setReady(true);
	}, []);

	// "See more" / "Products" opens the full products page right here (no router route needed)
	const [showAll, setShowAll] = useState(false);
	// Product whose detail page is open (clicked from Fresh Picks)
	const [selected, setSelected] = useState(null);
	const cameFromDetail = useRef(false);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [showAll]);

	// After closing a product, go back to the Fresh Picks section
	useEffect(() => {
		if (selected) {
			cameFromDetail.current = true;
		} else if (cameFromDetail.current) {
			cameFromDetail.current = false;
			setTimeout(() => document.getElementById("fresh-picks")?.scrollIntoView({ block: "start" }), 0);
		}
	}, [selected]);

	// Live product list (refreshes by itself)
	const { products, isLoading, errorText } = useProducts();

	const openProducts = useCallback(() => setShowAll(true), []);

	if (showAll) return <ProductsPage onBack={() => setShowAll(false)} />;
	if (selected) return <ProductDetailView product={selected} onBack={() => setSelected(null)} />;

	return (
		<div className={`home-root min-h-screen bg-white text-slate-900 overflow-x-clip ${ready ? "is-ready" : ""}`}>
			{showLoader && <HomeLoader onFinish={handleLoaderFinish} />}

			<SectionBoundary name="HomeHeader">
				<HomeHeader isLoggedIn={isLoggedIn} username={username} picture={picture} onOpenProducts={openProducts} />
			</SectionBoundary>

			<main>
				<SectionBoundary name="HeroSection">
					<HeroSection onOpenProducts={openProducts} />
				</SectionBoundary>
				<SectionBoundary name="BenefitsSection">
					<BenefitsSection />
				</SectionBoundary>
				<SectionBoundary name="UserRolesSection">
					<UserRolesSection onOpenProducts={openProducts} />
				</SectionBoundary>
				<SectionBoundary name="HowItWorksSection">
					<HowItWorksSection />
				</SectionBoundary>
				<SectionBoundary name="BecomeFarmerSection">
					<BecomeFarmerSection />
				</SectionBoundary>
				<SectionBoundary name="FreshPicksSection">
					<FreshPicksSection
						products={products}
						isLoading={isLoading}
						errorText={errorText}
						onSelect={setSelected}
						onSeeAll={openProducts}
					/>
				</SectionBoundary>
				<SectionBoundary name="SharedDeliverySection">
					<SharedDeliverySection />
				</SectionBoundary>
				<SectionBoundary name="SmartFarmSection">
					<SmartFarmSection />
				</SectionBoundary>
				<SectionBoundary name="DesktopAppSection">
					<DesktopAppSection />
				</SectionBoundary>
				<SectionBoundary name="MobileAppSection">
					<MobileAppSection />
				</SectionBoundary>
				<SectionBoundary name="MoreFeaturesSection">
					<MoreFeaturesSection />
				</SectionBoundary>
				<SectionBoundary name="FutureSmartSection">
					<FutureSmartSection />
				</SectionBoundary>
				<SectionBoundary name="FinalCTASection">
					<FinalCTASection onOpenProducts={openProducts} />
				</SectionBoundary>
			</main>

			<SectionBoundary name="Footer">
				<Footer onOpenProducts={openProducts} />
			</SectionBoundary>
		</div>
	);
}

// Both exports, so lazy(() => import(...)) works whichever way the router imports it
export default Home;
