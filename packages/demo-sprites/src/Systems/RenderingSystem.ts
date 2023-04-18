import * as PIXI from "pixi.js";
import { BaseSystem, ECS } from "@ts-basic/ecs";

export class RenderingSystem extends BaseSystem {
    private readonly minResolution = 240;

    constructor(
        ecs: ECS,
        private readonly renderer: PIXI.Renderer,
        private readonly stage: PIXI.Container
    ) {
        super(ecs);
        this.canvas.style.imageRendering = "pixelated";
        this.resizeRenderer();
    }

    public get canvas(): HTMLCanvasElement {
        return this.renderer.view as HTMLCanvasElement;
    }

    public onEarlyUpdate(): void {}

    public onUpdate(): void {
        this.renderer.render(this.stage);
    }

    public onLateUpdate(): void {}

    public resizeRenderer() {
        const windowW = window.innerWidth;
        const windowH = window.innerHeight;
        const aspect = windowW / windowH;
        const scale = aspect >= 1 ? windowH / this.minResolution : windowW / this.minResolution;
        const width = aspect >= 1 ? this.minResolution * aspect : this.minResolution;
        const height = aspect >= 1 ? this.minResolution : this.minResolution * (1 / aspect);
        this.renderer.resolution = Math.floor(scale);
        this.renderer.resize(width, height);
        this.canvas.style.width = `${windowW}px`;
        this.canvas.style.height = `${windowH}px`;
    }
}
