import * as planck from "planck";
import { ShapeComponent } from "./ShapeComponent";
import { TransformComponent } from "./TransformComponent";
import { BaseSystem, ECS } from "@ts-basic/ecs";

export class DrawingSystem extends BaseSystem {
    private signature = this.ecs.signatureFromComponents(ShapeComponent, TransformComponent);

    constructor(
        ecs: ECS,
        private canvasContext: CanvasRenderingContext2D,
        private scaleFactor: number
    ) {
        super(ecs);
    }

    public onEarlyUpdate(): void {}

    public onUpdate(): void {
        const entities = this.ecs.find(this.signature);
        for (const entity of entities) {
            const components = this.ecs.getComponents(entity);
            const transformComponent = components.get(TransformComponent);
            const shapeComponent = components.get(ShapeComponent);
            const position = transformComponent.position;
            const shape = shapeComponent.shape;
            const body = transformComponent.body;

            if (position.y > 100) {
                body.getWorld().destroyBody(body);
                this.ecs.destroyEntity(entity);
                continue;
            }

            this.canvasContext.fillStyle = "white";
            this.canvasContext.strokeStyle = "white";

            if (ShapeComponent.isCircle(shape)) {
                this.drawCircle(this.scaleVec2(position), shape.m_radius * this.scaleFactor);
            } else if (ShapeComponent.isEdge(shape)) {
                this.drawEdge(
                    this.scaleVec2(position),
                    this.scaleVec2(shape.m_vertex1),
                    this.scaleVec2(shape.m_vertex2)
                );
            } else if (ShapeComponent.isPolygon(shape)) {
                this.drawPolygon(planck.Vec2(), this.scaleVertices(shape, body));
            }
        }
    }

    private scaleVertices(shape: planck.Polygon, body: planck.Body) {
        const length = shape.m_vertices.length;
        const vertices = Array<planck.Vec2>(length);
        const transform: planck.Transform = body.getTransform();
        for (let i = 0; i < length; i++) {
            vertices[i] = this.scaleVec2(planck.Transform.mul(transform, shape.getVertex(i)));
        }
        return vertices;
    }

    private scaleVec2(vec2: planck.Vec2): planck.Vec2 {
        return planck.Vec2(vec2.x * this.scaleFactor, vec2.y * this.scaleFactor);
    }

    private drawCircle(position: planck.Vec2, radius: number): void {
        this.canvasContext.beginPath();
        this.canvasContext.arc(position.x, position.y, radius, 0, 2 * Math.PI, false);
        this.canvasContext.fill();
        this.canvasContext.closePath();
    }

    private drawEdge(position: planck.Vec2, vertex1: planck.Vec2, vertex2: planck.Vec2): void {
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(position.x + vertex1.x, position.y + vertex1.y);
        this.canvasContext.lineTo(position.x + vertex2.x, position.y + vertex2.y);
        this.canvasContext.stroke();
    }

    private drawPolygon(position: planck.Vec2, vertices: planck.Vec2[]): void {
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(position.x + vertices[0].x, position.y + vertices[0].y);
        for (let i = 1; i < vertices.length; i++) {
            this.canvasContext.lineTo(position.x + vertices[i].x, position.y + vertices[i].y);
        }
        this.canvasContext.closePath();
        this.canvasContext.fill();
        this.canvasContext.stroke();
    }

    public onLateUpdate(): void {}
}
