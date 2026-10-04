import { Tractor, ShoppingCart, Truck } from "lucide-react";
import SectionHeading from "./SectionHeading.jsx";
import RoleCard from "./RoleCard.jsx";
import RevealOnScroll from "./RevealOnScroll.jsx";

// Only the three public roles. Admin is intentionally not shown.
export default function UserRolesSection({ onOpenProducts }) {
    return (
        <section id="roles" className="scroll-mt-20 bg-green-50/70 py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
                <SectionHeading eyebrow="Who is it for?" title="One platform. Different ways to connect." />
                <div className="mt-12 grid gap-6 lg:grid-cols-3">
                    <RevealOnScroll className="h-full">
                        <RoleCard
                            icon={Tractor}
                            role="Farmer"
                            title="Grow, manage, and sell."
                            benefits={[
                                "Crop management",
                                "Field management",
                                "Livestock management",
                                "Farm activities",
                                "Expense tracking",
                                "Product listings",
                                "Order management",
                                "Reports",
                                "Weather information",
                                "Delivery coordination",
                            ]}
                            ctaLabel="Start as a Farmer"
                            ctaTo="/register"
                        />
                    </RevealOnScroll>
                    <RevealOnScroll delay={100} className="h-full">
                        <RoleCard
                            icon={ShoppingCart}
                            role="Buyer"
                            title="Find agricultural products and buy directly."
                            benefits={[
                                "Browse products",
                                "Search products",
                                "View product details",
                                "Add to cart",
                                "Place orders",
                                "Track orders",
                                "Communicate with users",
                                "Rate completed transactions",
                            ]}
                            ctaLabel="Shop Products"
                            onCta={onOpenProducts}
                        />
                    </RevealOnScroll>
                    <RevealOnScroll delay={200} className="h-full">
                        <RoleCard
                            icon={Truck}
                            role="Transport Provider"
                            title="Help move agricultural products efficiently."
                            benefits={[
                                "Transportation requests",
                                "Shared delivery matching",
                                "Delivery coordination",
                                "Delivery updates",
                                "Route/destination coordination",
                            ]}
                            ctaLabel="Join as Transport Provider"
                            ctaTo="/register"
                        />
                    </RevealOnScroll>
                </div>
            </div>
        </section>
    );
}
