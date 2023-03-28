import { ShapeComponent } from "./ShapeComponent";
import { PositionComponent } from "./PositionComponent";
import { ColorComponent } from "./ColorComponent";
import { BaseSystem, ECS } from "@ts-basic/ecs";

export class DrawingSystem extends BaseSystem {
    private signature = this.ecs.signatureFromComponents(
        ShapeComponent,
        PositionComponent,
        ColorComponent
    );

    constructor(
        ecs: ECS,
        private canvasContext: CanvasRenderingContext2D,
        private maxShapeSize: number,
        private maxShapeCount: number
    ) {
        super(ecs);
        for (let i = 0; i < this.maxShapeCount; i++) {
            this.createRandomEntity();
        }
    }

    private createRandomEntity(): number {
        const entity = this.ecs.createEntity();
        const canvas = this.canvasContext.canvas;
        this.ecs.assignComponent(entity, ShapeComponent.createRandom(this.maxShapeSize));
        this.ecs.assignComponent(
            entity,
            PositionComponent.createRandom(canvas.width, canvas.height)
        );
        this.ecs.assignComponent(entity, ColorComponent.createRandom());
        return entity;
    }

    public onEarlyUpdate(): void {}

    public onUpdate(): void {
        const entities = this.ecs.find(this.signature);
        for (const entity of entities) {
            const components = this.ecs.getComponents(entity);
            const shapeComponent = components.get(ShapeComponent) as ShapeComponent;
            const positionComponent = components.get(PositionComponent) as PositionComponent;
            const colorComponent = components.get(ColorComponent) as ColorComponent;
            this.canvasContext.fillStyle = colorComponent.colorString;
            if (shapeComponent.shape.type === "circle") {
                this.canvasContext.beginPath();
                this.canvasContext.arc(
                    positionComponent.position.x,
                    positionComponent.position.y,
                    shapeComponent.shape.radius,
                    0,
                    2 * Math.PI,
                    false
                );
                this.canvasContext.fill();
                this.canvasContext.closePath();
            } else {
                this.canvasContext.fillRect(
                    positionComponent.position.x,
                    positionComponent.position.y,
                    shapeComponent.shape.width,
                    shapeComponent.shape.height
                );
            }
        }
        this.ecs.destroyEntity(entities[0]);
        this.createRandomEntity();
    }

    public onLateUpdate(): void {}
}
