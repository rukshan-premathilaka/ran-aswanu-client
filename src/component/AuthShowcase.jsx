import logoImg from "@/assets/farmerImg/logo.png";
import showcaseImg from "@/assets/farmerImg/loginimg.png";

function AuthShowcase() {
    return (
        <div className="relative hidden h-screen w-1/2 overflow-hidden bg-lime-600 lg:flex lg:flex-col lg:justify-between">
            {/* background photo */}
            <img
                src={showcaseImg}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-center"
            />
            {/* green shade so the logo */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage:
                        "linear-gradient(to bottom, rgba(54,83,20,0.4) 0%, rgba(54,83,20,0) 40%, rgba(26,46,5,0.8) 100%)",
                }}
            />

            <div className="relative z-10 px-12 pt-12">
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white backdrop-blur-sm">
                        <img src={logoImg} alt="Ran Aswanu logo" className="h-7 w-7 object-contain" />
                    </div>
                    <span className="text-lg font-semibold tracking-tight text-white">Ran aswanu</span>
                </div>
            </div>

            {/* empty space in the middle  */}
            <div className="relative z-10 flex-1" />

            <div className="relative z-10 px-12 pb-12">
                <h2 className="max-w-sm text-2xl font-semibold leading-snug text-white">
                    Grow smarter, sell faster.
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-lime-50/90">
                    Manage your crops, track your farm, and reach buyers directly
                    — all from one place built for Sri Lankan farmers.
                </p>
            </div>
        </div>
    );
}

export default AuthShowcase;