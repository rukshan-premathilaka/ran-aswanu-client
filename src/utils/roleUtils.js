export const ROLE_LABELS = {
    BUYER: "Buyer",
    FARMER: "Farmer",
    TRANSPORT: "Delivery Partner",
    ADMIN: "Administrator",
};

export function normalizeRoles(profileOrRoles) {
    const raw = Array.isArray(profileOrRoles)
        ? profileOrRoles
        : Array.isArray(profileOrRoles?.roles)
            ? profileOrRoles.roles
            : profileOrRoles?.role
                ? [profileOrRoles.role]
                : [];

    return [...new Set(
        raw
            .filter(Boolean)
            .map((role) => String(role).trim().toUpperCase())
            .filter(Boolean)
    )];
}

export function hasRole(profileOrRoles, role) {
    return normalizeRoles(profileOrRoles).includes(String(role).trim().toUpperCase());
}

export function hasAnyRole(profileOrRoles, roles) {
    return roles.some((role) => hasRole(profileOrRoles, role));
}

export function roleLabel(role) {
    const normalized = String(role ?? "").trim().toUpperCase();
    return ROLE_LABELS[normalized] ?? (normalized ? normalized.charAt(0) + normalized.slice(1).toLowerCase() : "No role yet");
}

export function roleLabels(profileOrRoles) {
    return normalizeRoles(profileOrRoles).map(roleLabel);
}

export function syncRoleStorage(profileOrRoles) {
    const roles = normalizeRoles(profileOrRoles);
    const primary = profileOrRoles?.role || roles[0] || "";
    if (primary) localStorage.setItem("user_role", primary);
    localStorage.setItem("user_roles", JSON.stringify(roles));
    return roles;
}

export function clearRoleStorage() {
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_roles");
}
