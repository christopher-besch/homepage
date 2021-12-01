interface CSSModule {
    [className: string]: string
}

declare module '*.module.css' {
    const cssModule: CSSModule
    export = cssModule
}
