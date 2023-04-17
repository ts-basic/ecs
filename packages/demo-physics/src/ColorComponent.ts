export type Color = {
    r: number;
    g: number;
    b: number;
};

export class ColorComponent {
    public readonly colorString: string;

    constructor(public color: Color) {
        this.colorString = `rgb(${color.r}, ${color.g}, ${color.b})`;
    }
    static createRandom(): ColorComponent {
        return new ColorComponent({
            r: Math.random() * 255,
            g: Math.random() * 255,
            b: Math.random() * 255,
        });
    }
}
