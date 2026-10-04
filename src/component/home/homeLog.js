// One place for Home page console messages, so they are easy to find: filter the console by "[Ran Aswanu Home]".
const PREFIX = "[Ran Aswanu Home]";

export const homeLog = {
    error: (where, error, extra) => console.error(`${PREFIX} ${where}`, error ?? "", extra ?? ""),
    warn: (where, detail) => console.warn(`${PREFIX} ${where}`, detail ?? ""),
    info: (where, detail) => {
        if (import.meta.env.DEV) console.info(`${PREFIX} ${where}`, detail ?? "");
    },
};
