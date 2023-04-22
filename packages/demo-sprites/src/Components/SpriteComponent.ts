import * as PIXI from "pixi.js";
import { Vec2 } from "planck";

export class SpriteComponent<T extends PIXI.Sprite = PIXI.Sprite> {
    constructor(public sprite: T, public origin: Vec2) {}

    public static createSprite(texture: PIXI.Texture, origin: Vec2): SpriteComponent {
        return new SpriteComponent(new PIXI.Sprite(texture), origin);
    }

    public static createAnimatedSprite(
        textures: PIXI.Texture[],
        animationSpeed: number,
        origin: Vec2
    ): SpriteComponent<PIXI.AnimatedSprite> {
        const sprite = new PIXI.AnimatedSprite(textures);
        sprite.animationSpeed = animationSpeed;
        sprite.play();
        return new SpriteComponent(sprite, origin);
    }
}
