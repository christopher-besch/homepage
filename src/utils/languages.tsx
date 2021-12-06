export type Language = {
    name: string;
    icon: string;
};

export const languages = new Map<string, Language>([
    ["python", { name: "Python", icon: "/icons/python.svg" }],
    ["cpp", { name: "C++", icon: "/icons/c-plusplus_mono.svg" }],
    ["typescript", { name: "TypeScript", icon: "/icons/typescript-icon_mono.svg" }],
]);
