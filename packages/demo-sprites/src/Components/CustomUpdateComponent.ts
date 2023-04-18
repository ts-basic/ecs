import { IPerformsUpdates } from "@ts-basic/ecs";

export class CustomUpdateComponent implements IPerformsUpdates {
    constructor(private readonly updater: IPerformsUpdates) {}

    public onEarlyUpdate(deltaTime: number): void {
        this.updater.onEarlyUpdate(deltaTime);
    }

    public onUpdate(deltaTime: number): void {
        this.updater.onUpdate(deltaTime);
    }

    public onLateUpdate(deltaTime: number): void {
        this.updater.onLateUpdate(deltaTime);
    }
}
