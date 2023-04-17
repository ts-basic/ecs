import { ICustomUpdate } from "../common";

export class CustomUpdateComponent implements ICustomUpdate {
    constructor(private readonly updater: ICustomUpdate) {}

    public onEarlyUpdate(entity: number, deltaTime: number): void {
        this.updater.onEarlyUpdate(entity, deltaTime);
    }

    public onUpdate(entity: number, deltaTime: number): void {
        this.updater.onUpdate(entity, deltaTime);
    }

    public onLateUpdate(entity: number, deltaTime: number): void {
        this.updater.onLateUpdate(entity, deltaTime);
    }
}
