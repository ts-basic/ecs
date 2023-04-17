import { ICustomUpdate } from "../common";
import { UITextComponent } from "../Components";
import { Game } from "../Game";

export class FPSScript implements ICustomUpdate {
    private readonly frameTimesLen = 50;
    private readonly frameTimes: number[];

    constructor() {
        this.frameTimes = Array(this.frameTimesLen).fill(0);
    }

    onEarlyUpdate(entity: number, deltaTime: number): void {
        this.frameTimes.shift();
        this.frameTimes.push(1 / deltaTime);
    }

    onLateUpdate(entity: number): void {
        const text = Game.instance().ecs.getComponent(entity, UITextComponent);
        text.setText(`${this.fps} FPS`);
    }

    onUpdate(): void {}

    private get fps(): number {
        return Math.round(this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimesLen);
    }
}
