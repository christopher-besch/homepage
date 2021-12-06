export type Language = {
    id: string;
    name: string;
    icon: string;
};

export const languages = new Map<string, Language>([
    ["python", { id: "python", name: "Python", icon: "/icons/python.svg" }],
    ["cpp", { id: "cpp", name: "C++", icon: "/icons/c-plusplus_mono.svg" }],
    ["typescript", { id: "typescript", name: "TypeScript", icon: "/icons/typescript-icon_mono.svg" }],
]);
