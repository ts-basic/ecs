import * as PIXI from "pixi.js";
import { BaseSystem, ECS } from "@ts-basic/ecs";

export class UISystem extends BaseSystem {
    private readonly frameTimesLen = 50;
    private readonly frameTimes: number[];
    private readonly text: PIXI.Text;

    constructor(ecs: ECS, private readonly stage: PIXI.Container) {
        super(ecs);
        this.text = new PIXI.Text("", { fill: "white" });
        this.stage.addChild(this.text);
        this.frameTimes = Array(this.frameTimesLen).fill(0);
    }

    public onEarlyUpdate(deltaTime: number): void {
        this.frameTimes.shift();
        this.frameTimes.push(1 / deltaTime);
    }

    public onUpdate(): void {
        this.text.text = `${this.fps} FPS`;
        // this.renderer.render(this.stage);
    }

    public onLateUpdate(): void {}

    private get fps(): number {
        return Math.round(this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimesLen);
    }
}
