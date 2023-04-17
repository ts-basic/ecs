import * as PIXI from "pixi.js";
import { ReadonlyStrictMap, StrictMap } from "./common";
import { ECS } from "@ts-basic/ecs";
import {
    CustomUpdateComponent,
    RigidBodyComponent,
    SpriteComponent,
    TransformComponent,
    UITextComponent,
} from "./Components";
import { World } from "planck";
import {
    CustomUpdateSystem,
    PhysicsSystem,
    RenderingSystem,
    SpriteSystem,
    UISystem,
} from "./Systems";
import { resources } from "./resources";

type Stages = "main" | "sprite" | "ui";

export class Game {
    private static _instance: Game;
    public readonly ppm = 16; // pixels per meter
    public readonly renderer: PIXI.Renderer = new PIXI.Renderer({
        backgroundColor: "black",
        antialias: false,
    });
    public readonly stages: ReadonlyStrictMap<Stages, PIXI.Container> = new StrictMap<
        Stages,
        PIXI.Container
    >([
        ["main", new PIXI.Container()],
        ["sprite", new PIXI.Container()],
        ["ui", new PIXI.Container()],
    ]);
    public readonly physics = new World();
    public readonly ecs = new ECS();
    public animations = new StrictMap<string, StrictMap<string, PIXI.Texture[]>>();
    private prevTime = 0;

    private constructor() {}

    public static instance(): Game {
        if (Game._instance === undefined) {
            Game._instance = new Game();
        }
        return Game._instance;
    }

    public async init() {
        this.initRendering();
        this.initPhysics();
        this.initECS();
        await this.initAnimations();
    }

    public start() {
        requestAnimationFrame((now: DOMHighResTimeStamp) => {
            this.prevTime = now / 1000;
            requestAnimationFrame(this.loop.bind(this));
        });
    }

    /*
     * GAME LOOP
     *
     * DOMHighResTimeStamp accuracy is limited without certain security
     * requirements. See the following webpage for more information:
     * https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp#security_requirements
     */
    private loop(now: DOMHighResTimeStamp) {
        const time = now / 1000;
        let deltaTime = time - this.prevTime;
        this.prevTime = time;
        if (deltaTime < 0) deltaTime = 0;
        if (deltaTime > 1) deltaTime = 1;

        this.ecs.tick(deltaTime);

        requestAnimationFrame(this.loop.bind(this));
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
        this.ecs.registerComponent(CustomUpdateComponent);
        this.ecs.registerComponent(RigidBodyComponent);
        this.ecs.registerComponent(SpriteComponent);
        this.ecs.registerComponent(TransformComponent);
        this.ecs.registerComponent(UITextComponent);
        this.ecs.addSystem(new CustomUpdateSystem(this.ecs));
        this.ecs.addSystem(new PhysicsSystem(this.ecs, this.physics));
        this.ecs.addSystem(new SpriteSystem(this.ecs));
        this.ecs.addSystem(new UISystem(this.ecs));
        const renderingSystem = new RenderingSystem(
            this.ecs,
            this.renderer,
            this.stages.get("main")
        );
        window.addEventListener("resize", () => renderingSystem.resizeRenderer());
        this.ecs.addSystem(renderingSystem);
    }

    private async initAnimations() {
        const urls = Object.fromEntries(
            Object.entries(resources).map(([key, value]) => [key, value.src])
        );
        PIXI.Assets.resolver.basePath = "img/";
        PIXI.Assets.add(Object.keys(urls), Object.values(urls));
        const textures = await PIXI.Assets.load(Object.keys(urls));
        for (const group in textures) {
            const spritesheet = new PIXI.Spritesheet(textures[group], resources[group].atlas);
            await spritesheet.parse();
            const map = new StrictMap<string, PIXI.Texture[]>(
                Object.entries(spritesheet.animations)
            );
            this.animations.set(group, map);
        }
    }
}
