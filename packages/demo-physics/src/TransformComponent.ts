export class TransformComponent {
    constructor(public body: planck.Body) {}

    get position(): planck.Vec2 {
        return this.body.getPosition();
    }
}
