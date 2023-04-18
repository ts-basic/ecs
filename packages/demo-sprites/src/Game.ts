import * as PIXI from "pixi.js";
import { ReadonlyStrictMap, StrictMap } from "./common";
import { ECS } from "@ts-basic/ecs";
import { RigidBodyComponent, SpriteComponent, TransformComponent } from "./Components";
import { Vec2, World } from "planck";
import { PhysicsSystem, RenderingSystem, SpriteSystem } from "./Systems";
import { UISystem } from "./UISystem";
import resources from "./resources.json";

type Stages = "main" | "sprite" | "ui";

export class Game {
    public readonly ppm = 16; // pixels per meter
    public readonly renderer: PIXI.Renderer = new PIXI.Renderer({
        backgroundColor: "black",
        antialias: false
    });
    public readonly stages: ReadonlyStrictMap<Stages, PIXI.Container> = new StrictMap<
        Stages,
        PIXI.Container
    >([
        ["main", new PIXI.Container()],
        ["sprite", new PIXI.Container()],
        ["ui", new PIXI.Container()]
    ]);
    public readonly physics = new World(Vec2(0, 0));
    public readonly ecs = new ECS();
    public _animations = new Map<string, PIXI.utils.Dict<PIXI.Texture>>();

    public get animations(): ReadonlyMap<string, PIXI.utils.Dict<PIXI.Texture>> {
        return this._animations;
    }

    async init() {
        this.initRendering();
        this.initPhysics();
        this.initECS();
        await this.initAnimations();
    }

    private initRendering() {
        PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;
        const mainStage = this.stages.get("main");
        mainStage.addChild(this.stages.get("sprite"));
        mainStage.addChild(this.stages.get("ui"));
        document.body.appendChild(this.renderer.view as HTMLCanvasElement);
    }

    private initPhysics() {
        this.physics.setContinuousPhysics(true);
    }

    private initECS() {
        this.ecs.registerComponent(SpriteComponent);
        this.ecs.registerComponent(TransformComponent);
        this.ecs.registerComponent(RigidBodyComponent);
        this.ecs.addSystem(new PhysicsSystem(this.ecs, this.physics));
        this.ecs.addSystem(new SpriteSystem(this.ecs, this.ppm, this.stages.get("sprite")));
        this.ecs.addSystem(new UISystem(this.ecs, this.stages.get("ui")));
        const renderingSystem = new RenderingSystem(
            this.ecs,
            this.renderer,
            this.stages.get("main")
        );
        window.addEventListener("resize", () => renderingSystem.resizeRenderer());
        this.ecs.addSystem(renderingSystem);
    }

    private async initAnimations() {
        const urls = Object.fromEntries(Object.entries(resources).map(([key, value]) => [key, value.src]));
        PIXI.Assets.resolver.basePath = "img/";
        PIXI.Assets.add(Object.keys(urls), Object.values(urls));
        const textures = await PIXI.Assets.load(Object.keys(urls));

    }
}
