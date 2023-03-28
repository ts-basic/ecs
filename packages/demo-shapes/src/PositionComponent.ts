export type Position = {
    x: number;
    y: number;
};

export class PositionComponent {
    constructor(public position: Position) {}

    static createRandom(width: number, height: number): PositionComponent {
        return new PositionComponent({ x: Math.random() * width, y: Math.random() * height });
    }
}
