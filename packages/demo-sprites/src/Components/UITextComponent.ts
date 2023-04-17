import * as PIXI from "pixi.js";
import { Game } from "../Game";

export class UITextComponent {
    private readonly text: PIXI.Text;

    constructor(text: string) {
        this.text = new PIXI.Text(text, { fill: "white" });
        Game.instance().stages.get("ui").addChild(this.text);
    }

    public setText(text: string): void {
        this.text.text = text;
    }
}