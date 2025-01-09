function toHSL(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return null;
    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b),
        min = Math.min(r, g, b);

    let h = (max + min) / 2;
    let s = (max + min) / 2;
    let l = (max + min) / 2;

    if (max == min) {
        h = 0;
        s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    s = s * 100;
    s = Math.round(s);
    l = l * 100;
    l = Math.round(l);
    h = Math.round(360 * h);
    const colorInHSL = h + ' ' + s + '% ' + l + '%';
    return colorInHSL;
}

export function setGlobalAccentColor(accent_color: string) {
    console.log(`Setting Primary color  as ${accent_color}; ${toHSL(accent_color)}`);
    document.documentElement.style.setProperty(`--primary`, toHSL(accent_color));
}
