import * as PIXI from "pixi.js";
import { Vec2 } from "planck";

export class SpriteComponent {
    constructor(public sprite: PIXI.Sprite, public origin: Vec2) {}
}