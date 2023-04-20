import * as PIXI from "pixi.js";

type Resources = {
    [key: string]: {
        src: string;
        atlas: PIXI.ISpritesheetData;
    };
};

export const resources: Resources = {
    characters: {
        src: "free_character_1-3.png",
        atlas: {
            frames: {
                personDown0: { frame: { x: 0, y: 0, w: 16, h: 20 } },
                personDown1: { frame: { x: 16, y: 0, w: 16, h: 20 } },
                personDown2: { frame: { x: 32, y: 0, w: 16, h: 20 } },
                personLeft0: { frame: { x: 0, y: 20, w: 16, h: 20 } },
                personLeft1: { frame: { x: 16, y: 20, w: 16, h: 20 } },
                personLeft2: { frame: { x: 32, y: 20, w: 16, h: 20 } },
                personRight0: { frame: { x: 0, y: 40, w: 16, h: 20 } },
                personRight1: { frame: { x: 16, y: 40, w: 16, h: 20 } },
                personRight2: { frame: { x: 32, y: 40, w: 16, h: 20 } },
                personUp0: { frame: { x: 0, y: 60, w: 16, h: 20 } },
                personUp1: { frame: { x: 16, y: 60, w: 16, h: 20 } },
                personUp2: { frame: { x: 32, y: 60, w: 16, h: 20 } },
            },
            meta: {
                scale: "1",
            },
            animations: {
                personDown: ["personDown0", "personDown1", "personDown2", "personDown1"],
                personLeft: ["personLeft0", "personLeft1", "personLeft2", "personLeft1"],
                personRight: ["personRight0", "personRight1", "personRight2", "personRight1"],
                personUp: ["personUp0", "personUp1", "personUp2", "personUp1"],
            },
        },
    },
};
