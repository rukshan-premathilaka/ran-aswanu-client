import { Link } from "react-router-dom";

// PrimaryButton and SecondaryButton share one base. Pass `to` for a router link,
// `href` for an outside link, or `onClick` for an action.
const BASE =
    "btn-lift inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-semibold focus:outline-none focus-visible:ring-4 focus-visible:ring-green-300";

const LOOKS = {
    primary: "bg-green-600 text-white shadow-md hover:bg-green-700 hover:shadow-lg",
    primaryOnDark: "bg-white text-green-800 shadow-md hover:bg-green-50 hover:shadow-lg",
    secondary: "border-2 border-green-600 text-green-700 bg-white hover:bg-green-50 hover:shadow-md",
    secondaryOnDark: "border-2 border-white/80 text-white hover:bg-white/10 hover:shadow-md",
};

function ButtonBase({ look, to, href, onClick, icon: Icon, iconAfter = true, className = "", children, ...rest }) {
    const classes = `${BASE} ${LOOKS[look]} ${className}`;
    const content = (
        <>
            {Icon && !iconAfter && <Icon className="w-5 h-5" aria-hidden="true" />}
            {children}
            {Icon && iconAfter && <Icon className="w-5 h-5" aria-hidden="true" />}
        </>
    );
    if (to) return <Link to={to} className={classes} {...rest}>{content}</Link>;
    if (href) return <a href={href} className={classes} {...rest}>{content}</a>;
    return <button type="button" onClick={onClick} className={classes} {...rest}>{content}</button>;
}

export function PrimaryButton({ onDark = false, ...props }) {
    return <ButtonBase look={onDark ? "primaryOnDark" : "primary"} {...props} />;
}

export function SecondaryButton({ onDark = false, ...props }) {
    return <ButtonBase look={onDark ? "secondaryOnDark" : "secondary"} {...props} />;
}
