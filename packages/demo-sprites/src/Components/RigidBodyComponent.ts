import { Body, Box, Circle, Vec2 } from "planck";

export class RigidBodyComponent {
    constructor(public readonly body: Body) {}

    public attachBoxCollider(
        width: number,
        height: number,
        mass: number,
        center: Vec2
    ): RigidBodyComponent {
        this.body.createFixture(Box(width / 2, height / 2), 0);
        this.body.setMassData({ mass, center, I: 1 });
        return this;
    }

    public attachCircleCollider(radius: number, mass: number, center: Vec2): RigidBodyComponent {
        this.body.createFixture(Circle(radius), 0);
        this.body.setMassData({ mass, center, I: 1 });
        return this;
    }
}
