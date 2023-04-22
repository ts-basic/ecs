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
    interior: {
        src: "atlas_16x.png",
        atlas: {
            frames: {
                wallTop: { frame: { x: 16, y: 0, w: 16, h: 16 } },
                wallBtm: { frame: { x: 16, y: 16, w: 16, h: 16 } },
                windowTL: { frame: { x: 224, y: 0, w: 16, h: 16 } },
                windowTR: { frame: { x: 240, y: 0, w: 16, h: 16 } },
                windowBL: { frame: { x: 224, y: 16, w: 16, h: 16 } },
                windowBR: { frame: { x: 240, y: 16, w: 16, h: 16 } },
                curtainTL: { frame: { x: 128, y: 32, w: 16, h: 16 } },
                curtainTR: { frame: { x: 144, y: 32, w: 16, h: 16 } },
                curtainBL: { frame: { x: 128, y: 48, w: 16, h: 16 } },
                curtainBR: { frame: { x: 144, y: 48, w: 16, h: 16 } },
                chair: { frame: { x: 144, y: 112, w: 16, h: 16 } },
                plantT: { frame: { x: 256, y: 208, w: 16, h: 16 } },
                plantB: { frame: { x: 256, y: 224, w: 16, h: 16 } },
                floor1: { frame: { x: 0, y: 96, w: 16, h: 16 } },
                floor2: { frame: { x: 16, y: 96, w: 16, h: 16 } },
                crownN: { frame: { x: 32, y: 176, w: 16, h: 16 } },
                crownW: { frame: { x: 0, y: 208, w: 16, h: 16 } },
                crownE: { frame: { x: 64, y: 208, w: 16, h: 16 } },
                crownS: { frame: { x: 32, y: 240, w: 16, h: 16 } },
                crownNW: { frame: { x: 16, y: 176, w: 16, h: 16 } },
                crownNE: { frame: { x: 48, y: 176, w: 16, h: 16 } },
                crownSW: { frame: { x: 16, y: 240, w: 16, h: 16 } },
                crownSE: { frame: { x: 48, y: 240, w: 16, h: 16 } },
                bedTop: { frame: { x: 160, y: 224, w: 16, h: 16 } },
                bedBtm: { frame: { x: 160, y: 240, w: 16, h: 16 } },
            },
            meta: {
                scale: "1",
            },
            animations: {},
        },
    },
};
