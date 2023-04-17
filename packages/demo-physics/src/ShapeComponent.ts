export class ShapeComponent {
    constructor(public shape: planck.Shape) {}

    static isCircle(shape: planck.Shape): shape is planck.Circle {
        return shape.m_type === "circle";
    }

    static isEdge(shape: planck.Shape): shape is planck.Edge {
        return shape.m_type === "edge";
    }

    static isPolygon(shape: planck.Shape): shape is planck.Polygon {
        return shape.m_type === "polygon";
    }
}
