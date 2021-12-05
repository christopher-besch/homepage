interface CSSModule {
    [className: string]: string
}

declare module '*.module.scss' {
    const cssModule: CSSModule
    export = cssModule
}
