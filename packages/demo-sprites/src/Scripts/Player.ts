import { ICustomUpdate } from "../common";
import { RigidBodyComponent } from "../Components";
import { Game } from "../Game";
import { Vec2 } from "planck";

type Key = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";

export class Player implements ICustomUpdate {
    private readonly keys: { [K in Key]: boolean } = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
    };

    constructor() {
        document.addEventListener("keydown", this.onKeyDown.bind(this), false);
        document.addEventListener("keyup", this.onKeyUp.bind(this), false);
    }

    public onEarlyUpdate(): void {}

    public onUpdate(entity: number): void {
        const rigidBodyComponent = Game.instance().ecs.getComponent(entity, RigidBodyComponent);
        const velocity = new Vec2();

        if (this.keys.ArrowUp) {
            velocity.add(Vec2(0, -5));
        }
        if (this.keys.ArrowDown) {
            velocity.add(Vec2(0, 5));
        }
        if (this.keys.ArrowLeft) {
            velocity.add(Vec2(-5, 0));
        }
        if (this.keys.ArrowRight) {
            velocity.add(Vec2(5, 0));
        }
        if (!this.keys.ArrowUp && !this.keys.ArrowDown && !this.keys.ArrowLeft && !this.keys.ArrowRight) {
            velocity.setZero();
        }
        velocity.normalize();
        velocity.mul(5);
        rigidBodyComponent.body.setLinearVelocity(velocity);
    }

    public onLateUpdate(): void {}

    private onKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case "ArrowUp":
                this.keys.ArrowUp = true;
                break;
            case "ArrowDown":
                this.keys.ArrowDown = true;
                break;
            case "ArrowLeft":
                this.keys.ArrowLeft = true;
                break;
            case "ArrowRight":
                this.keys.ArrowRight = true;
                break;
        }
    }

    private onKeyUp(event: KeyboardEvent): void {
        switch (event.key) {
            case "ArrowUp":
                this.keys.ArrowUp = false;
                break;
            case "ArrowDown":
                this.keys.ArrowDown = false;
                break;
            case "ArrowLeft":
                this.keys.ArrowLeft = false;
                break;
            case "ArrowRight":
                this.keys.ArrowRight = false;
                break;
        }
    }
}
