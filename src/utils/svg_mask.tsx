export default function get_mask(url: string): object {
    return ({
        maskImage: `url("${url}")`,
        webkitMaskImage: `url("${url}")`,
    });
};
