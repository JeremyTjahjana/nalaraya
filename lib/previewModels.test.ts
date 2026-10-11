import { describe, expect, it } from "vitest";
import { getPreviewAsset } from "./previewModels";

describe("preview model registry", () => {
  it("shares the intended GLB assets and nodes", () => {
    expect(getPreviewAsset("goggles")?.path).toBe(
      "/models/glasses.preview.glb",
    );
    expect(getPreviewAsset("gloves")?.path).toBe("/models/gloves.preview.glb");
    expect(getPreviewAsset("funnel")?.path).toBe("/models/funnel.glb");
    expect(getPreviewAsset("beaker")?.node).toBe("lab_beaker_b_0");
    expect(getPreviewAsset("waste")).toEqual(getPreviewAsset("beaker"));
    expect(getPreviewAsset("cylinder")?.node).toBe("lab_cylinder_c_0");
  });

  it("keeps equipment without a suitable asset on the geometry fallback", () => {
    expect(getPreviewAsset("flask")).toBeUndefined();
    expect(getPreviewAsset("coat")).toBeUndefined();
  });
});
