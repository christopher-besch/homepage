interface CSSModule {
    [className: string]: string
}

declare module '*.module.scss' {
    const cssModule: CSSModule
    export = cssModule
};

declare namespace JSX {
    interface IntrinsicElements {
        // necessary because of TypeScript weirdness
        center: any;
    }
}
