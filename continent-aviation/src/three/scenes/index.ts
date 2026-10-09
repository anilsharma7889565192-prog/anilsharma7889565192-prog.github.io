import type { SceneFactory } from "../core/stage";

/** Every renderable shot: which scene builds it. Scenes are code-split and loaded on demand. */
export const SHOTS = {
  hero: "apron", jets: "apron", corporate: "apron", bespoke: "apron", vip: "apron", group: "apron", apron: "apron",
  about: "aloft", cta: "aloft", helicopter: "scenic", wedding: "palace", interior: "cabin", private: "cabin",
  globe: "globe", viewer: "viewer",
} as const satisfies Record<string, string>;

export type ShotName = keyof typeof SHOTS;

export async function loadShot(shot: string): Promise<SceneFactory> {
  const scene = (SHOTS as Record<string, string>)[shot];
  switch (scene) {
    case "apron": {
      const m = await import("./apron");
      return (ctx) => m.createApronScene(ctx, shot);
    }
    case "aloft": {
      const m = await import("./aloft");
      return (ctx) => m.createAloftScene(ctx, shot as "about" | "cta");
    }
    case "scenic": {
      const m = await import("./scenic");
      return (ctx) => m.createScenicScene(ctx);
    }
    case "palace": {
      const m = await import("./palace");
      return (ctx) => m.createPalaceScene(ctx);
    }
    case "cabin": {
      const m = await import("./cabin");
      return (ctx) => m.createCabinScene(ctx, shot as "interior" | "private");
    }
    case "globe": {
      const m = await import("./globe");
      return (ctx) => m.createGlobeScene(ctx);
    }
    case "viewer": {
      const m = await import("./viewer");
      return (ctx) => m.createViewerScene(ctx);
    }
    default:
      throw new Error(`Unknown shot ${shot}`);
  }
}
