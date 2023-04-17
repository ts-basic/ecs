import { Vec2 } from "planck";

export class TransformComponent {
    constructor(
        public readonly position: Vec2,
        public readonly scale: Vec2,
        public rotation: number
    ) {}
}
