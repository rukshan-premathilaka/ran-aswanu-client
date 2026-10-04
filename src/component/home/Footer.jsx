import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, LifeBuoy } from "lucide-react";
import logoImg from "@/assets/farmerImg/logo.png";
import { BRAND_NAME, BRAND_TAGLINE, CONTACT } from "./homeConfig.js";
import { scrollToId } from "./homeUtils.js";

const LINK_CLASS = "text-base text-slate-300 hover:text-white hover:underline underline-offset-4 transition-colors text-left";

function SectionLink({ target, children }) {
    return (
        <a
            href={`#${target}`}
            onClick={(e) => {
                e.preventDefault();
                scrollToId(target);
            }}
            className={LINK_CLASS}
        >
            {children}
        </a>
    );
}

function Column({ title, children }) {
    return (
        <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-green-400">{title}</h3>
            <div className="mt-4 flex flex-col items-start gap-3">{children}</div>
        </div>
    );
}

function ContactRow({ icon: Icon, children }) {
    return (
        <p className="flex items-start gap-2.5 text-base text-slate-300">
            <Icon className="w-5 h-5 mt-0.5 shrink-0 text-green-400" aria-hidden="true" /> <span className="break-all">{children}</span>
        </p>
    );
}

// Clean 4-column footer. The Contact column hides any row that has no value in homeConfig.js.
export default function Footer({ onOpenProducts }) {
    return (
        <footer className="bg-slate-900 text-white">
            <div className="mx-auto max-w-[1240px] px-5 sm:px-8 pt-14 pb-8">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <Link to="/home" className="flex items-center gap-2.5 text-xl font-bold text-white">
                            <img src={logoImg} alt="" className="w-9 h-9 object-contain" /> {BRAND_NAME.toUpperCase()}
                        </Link>
                        <p className="mt-4 max-w-xs text-base text-slate-300 leading-relaxed">{BRAND_TAGLINE}</p>
                    </div>

                    <Column title="About">
                        <SectionLink target="why">About Us</SectionLink>
                        <SectionLink target="roles">Our Mission</SectionLink>
                        <SectionLink target="how-it-works">How It Works</SectionLink>
                    </Column>

                    <Column title="Features">
                        <SectionLink target="features">Farm Management</SectionLink>
                        <SectionLink target="fresh-picks">Marketplace</SectionLink>
                        <SectionLink target="shared-delivery">Delivery</SectionLink>
                        <SectionLink target="more-features">Ratings &amp; Reviews</SectionLink>
                        <SectionLink target="future">Smart Insights</SectionLink>
                    </Column>

                    <Column title="Links">
                        <button type="button" onClick={onOpenProducts} className={LINK_CLASS}>Products</button>
                        <Link to="/register" className={LINK_CLASS}>Register</Link>
                        <Link to="/login" className={LINK_CLASS}>Login</Link>
                        <SectionLink target="desktop-app">Desktop App</SectionLink>
                        <SectionLink target="contact">Contact Us</SectionLink>
                    </Column>
                </div>

                <div id="contact" className="scroll-mt-24 mt-10 border-t border-white/10 pt-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-green-400">Contact</h3>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {CONTACT.email && <ContactRow icon={Mail}><a className="hover:text-white hover:underline" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></ContactRow>}
                        {CONTACT.phone && <ContactRow icon={Phone}><a className="hover:text-white hover:underline" href={`tel:${CONTACT.phone}`}>{CONTACT.phone}</a></ContactRow>}
                        {CONTACT.location && <ContactRow icon={MapPin}>{CONTACT.location}</ContactRow>}
                        {CONTACT.support && <ContactRow icon={LifeBuoy}><a className="hover:text-white hover:underline" href={`mailto:${CONTACT.support}`}>Support: {CONTACT.support}</a></ContactRow>}
                    </div>
                </div>

                <div className="mt-8 border-t border-white/10 pt-6 text-center text-base text-slate-400">
                    &copy; 2026 {BRAND_NAME}. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
