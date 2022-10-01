export default function get_mask(url) {
    return ({
        maskImage: `url("${url}")`,
        WebkitMaskImage: `url("${url}")`,
    });
}
;
