type Circle = {
    type: "circle";
    radius: number;
};

type Rectangle = {
    type: "rectangle";
    width: number;
    height: number;
};

export type Shape = Circle | Rectangle;

export class ShapeComponent {
    constructor(public shape: Shape) {}

    static createRandom(maxSize: number): ShapeComponent {
        if (Math.random() > 0.5) {
            return new ShapeComponent({
                type: "circle",
                radius: (Math.random() * maxSize) / 4 + maxSize / 4,
            });
        } else {
            return new ShapeComponent({
                type: "rectangle",
                width: (Math.random() * maxSize) / 2 + maxSize / 2,
                height: (Math.random() * maxSize) / 2 + maxSize / 2,
            });
        }
    }
}
