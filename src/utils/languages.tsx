export type Language = {
    id: string;
    name: string;
    icon: string;
    icon_mono: string;
};

export const languages = new Map<string, Language>([
    ["python", {
        id: "python",
        name: "Python",
        icon: "/icons/python.svg",
        icon_mono: "/icons/python.svg"
    }],
    ["cpp", {
        id: "cpp",
        name: "C++",
        icon: "/icons/c-plusplus.svg",
        icon_mono: "/icons/c-plusplus_mono.svg"
    }],
    ["typescript", {
        id: "typescript",
        name: "TypeScript",
        icon: "/icons/typescript-icon.svg",
        icon_mono: "/icons/typescript-icon_mono.svg"
    }],
    ["java", {
        id: "java",
        name: "Java",
        icon: "/icons/java.svg",
        icon_mono: "/icons/java.svg"
    }],
]);
