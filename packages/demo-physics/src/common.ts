function isNotNull<T>(o: T): o is Exclude<T, null> {
    return o !== null;
}

export function createCanvasElement() {
    const canvasElement = document.createElement("canvas");
    canvasElement.style.margin = "0";
    canvasElement.style.padding = "0";
    canvasElement.style.display = "block";
    canvasElement.width = 800;
    canvasElement.height = 800;
    return canvasElement;
}

export function getCanvasContext(canvasElement: HTMLCanvasElement) {
    const canvasContext = canvasElement.getContext("2d");
    if (!isNotNull(canvasContext)) {
        throw new Error("Canvas context is null");
    }
    return canvasContext;
}

export function clearCanvas(canvasContext: CanvasRenderingContext2D) {
    canvasContext.fillStyle = "black";
    canvasContext.fillRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
}

export function printFPS(canvasContext: CanvasRenderingContext2D, fps: number) {
    canvasContext.fillStyle = "white";
    canvasContext.font = "48px sans-serif";
    canvasContext.fillText(`${fps} FPS`, 20, 50);
}
