export type PreviewAsset = {
  path: string;
  node?: string;
  rotation?: [number, number, number];
};

const glassware = "/models/chemistry_glassware.glb";

export const previewAssets = {
  goggles: { path: "/models/glasses.preview.glb" },
  gloves: { path: "/models/gloves.preview.glb" },
  funnel: { path: "/models/funnel.glb" },
  beaker: {
    path: glassware,
    node: "lab_beaker_b_0",
    rotation: [-Math.PI / 2, 0, 0],
  },
  waste: {
    path: glassware,
    node: "lab_beaker_b_0",
    rotation: [-Math.PI / 2, 0, 0],
  },
  cylinder: {
    path: glassware,
    node: "lab_cylinder_c_0",
    rotation: [-Math.PI / 2, 0, 0],
  },
} satisfies Record<string, PreviewAsset>;

export function getPreviewAsset(id: string): PreviewAsset | undefined {
  return previewAssets[id as keyof typeof previewAssets];
}
