import * as PIXI from "pixi.js";
import { ReadonlyStrictMap, StrictMap } from "./common";
import { ECS } from "@ts-basic/ecs";
import { SpriteComponent } from "./SpriteComponent";
import { TransformComponent } from "./Components/TransformComponent";
import { RigidBodyComponent } from "./Components/RigidBodyComponent";
import { Vec2, World } from "planck";
import { PhysicsSystem } from "./Systems/PhysicsSystem";
import { SpriteSystem } from "./Systems/SpriteSystem";
import { UISystem } from "./UISystem";
import { RenderingSystem } from "./RenderingSystem";

type Stages = "main" | "sprite" | "ui";

export class Game {
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
    public readonly physics = new World(Vec2(0, 0));
    public readonly ecs = new ECS();

    constructor() {
        this.initRendering();
        this.initPhysics();
        this.initECS();

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
}
