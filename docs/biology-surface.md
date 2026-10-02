# Biology — epidermis observation

Routes: /biologi, /biologi/epidermis-bawang and /biologi/epidermis-bawang/praktikum. This module replaces the former osmosis implementation. Operate in the lab; Read in the introduction.

## Direction contract

THESIS: prepare one specimen by manipulating shared laboratory equipment, then learn to position and focus a microscope before identifying visible structures.

OWN-WORLD: inherit Chemistry's white surfaces, Atkinson Hyperlegible, thin rules, inventory/popover classes, APD, Room and camera controls; Biology uses green #246746 and hexagonal tool icon frames.

STORY: select Biology, understand epidermis preparation, build a wet mount, adjust optics, mark cell structures, review the result.

FIRST VIEWPORT: inventory left, the same Chemistry table centrally, guidance right; landscape mobile uses drawers. The ocular view has black edges, a circular light field, stage movement and a physical-style focus knob.

FORM: user-approved code-led extension, no concept seed or replacement identity. Illustrative vector cell geometry is part of the scientific diagram, not decorative art.

FINISH: unreviewed and undocumented is unfinished; this ordinary extension ends with the finish review, its verdict, this surface record, an incumbent-system comparison, and provenance for any new shipping raster. The existing global DESIGN.md is preserved.

## Reuse and limits

Room and existing APD/water geometry come from Scene.tsx. PPE metadata retains the same objects from lib/lab.ts. Biology supplies contextual water copy. ToolPreview and previewModels share GLB selection for inventory and the equipment section on the introduction page. lib/labSound.ts extracts the original Chemistry synthesizer, adding a short tissue sound. No runtime dependency is added.

The supplied microscope.glb is normalized by its bounding box, with a procedural fallback. Asset authorship/license are not inferred from the file; retain the user's original asset provenance before publication. Cell diagrams are authored SVG geometry and clearly identified as illustrations. No externally sourced raster is shipped.

## Built surface and incumbent comparison

| Chemistry incumbent | Biology implementation |
| --- | --- |
| White manual surfaces, Atkinson Hyperlegible, ink text, thin rules and square controls | Inherited lab shell and introduction patterns; the subject accent becomes green (#246746), with hexagonal tool icon frames. |
| Inventory left, manipulable table centrally, guidance right | Same layout and shared Room/table; Biology supplies the specimen, preparation state and microscope. Landscape mobile retains tool/guidance drawers and portrait devices receive the rotation gate. |
| APD objects, wash bottle and equipment previews | Shared APD metadata and geometry, shared water geometry with Biology-specific explanatory copy, and the existing preview selection for hover cards and the introduction equipment viewer. |
| Hover specification/safety popover and camera controls | Same information hierarchy and preview pattern; camera movement is opt-in, with a centering action and zoom. |
| Synthetic action and stage sounds | Shared synthesizer retains Chemistry's sound vocabulary; tissue actions add the short `dry` sound. Mute and visual feedback remain available. |

The new ocular dialog is a bounded instrument surface: dark background (#090d0b), circular cream light field, 23px title and 15px control copy on desktop. It uses a 300px control column beside the field; at widths up to 900px it fills the viewport, with a 240px control column and smaller type. Its desktop 12px outer corners, circular focus knob and cell geometry describe this instrument, not new global control shapes. Introduction headings use 32–48px; equipment and results use the inherited readable manual rhythm.

The eight preparation interactions follow APD, giving eleven stages including optical adjustment and identification. Dragging tools near a valid target invokes the same ordered interaction as the touch/keyboard selectors. Cleaning seats the slide in the work area; later interactions show liquid, tissue transfer, a lowered coverslip and a mounted slide. Reduced-motion preferences suppress preparation animation and the delayed ocular opening.

The ocular opens after mounting and can be closed and reopened without losing progress. The learner drags the field or uses arrow controls, then drags the focus knob or uses keyboard/minus/plus controls. Completion becomes available only when position and focus meet the simulation thresholds. Identification then requests wall, vacuole and nucleus in order, accepting matching regions on any visible cell; arrow keys and Enter also support marking. Results show attempts, deductions and the action log. Practice exposes a current-step reset and expanded guidance; the exam omits those aids.

The field is explicitly labeled an illustration, not a micrograph. Magnification is fixed at 10× ocular and 10× objective (100× total); the focus blur and cell geometry are teaching representations. Scientific qualifications and content sources remain in [epidermis-sources.md](epidermis-sources.md). A blocked microscope asset renders a procedural microscope; a failed 3D canvas directs users to the touch/keyboard controls.

## Assessment

All eight preparation interactions are ordered; APD is required first. Correct positioning (distance <=24 illustration units) and focus (68 ±4 on the simulated knob) unlock observation completion. Each of the three structures may be marked on any displayed cell. A wrong marking costs 5 points, capped at 10 per structure; exam procedure errors cost 5 capped at 20, APD errors capped at 15. Practice procedural errors provide guidance without deduction. The 600-second exam uses elapsed wall time, including when panels/observation are open. Expiry adds 10 points, 5 per remaining stage and 10 per unmarked structure, with a score floor of zero. These are simulation rules, not a validated educational rubric.

## Verification

Run npm test and npm run build. Browser workflow: PLAYWRIGHT_MODULE=/path/to/playwright node scripts/check-epidermis.cjs (localhost:3000, or BASE_URL). Tests include real pointer drag, full preparation, keyboard positioning/focus, dialog reopening, direct structure marking, 100/100 result, portrait gate, landscape, exam controls, and a Chemistry smoke check. Screenshots are development artifacts under .impeccable/review.

The completed implementation pass reported 25 passing unit tests, a successful Next.js production build, and a passing browser workflow covering actual tissue drag/snap, the full preparation, positioning/focus, dialog reopening, landscape mobile identification at 100/100, the portrait gate, exam controls and the Chemistry smoke check. A separate browser test verified oscillator emission, mute suppression/unmute, and usable fallback canvas/controls when the GLB was blocked. This sound evidence is separate from the visual reviewer, who did not independently inspect audio.

The fresh finish review returned **ship**, with all five review sections present and no material fixes required; the detector result was `[]`. The nine review captures are `.impeccable/review/epidermis-{desktop,preview,focused,blur,mobile,portrait,results,intro,equipment}.png`. These captures are development evidence, not shipping raster assets. This record reconciles the reviewed build with the source; it does not claim an independent rerun of those tests or a validated educational outcome.

PRODUCT.md and DESIGN.md still describe Biology as future work, and DESIGN.md reserves green for future subjects. This pre-existing drift is recorded without repairing the global files during an ordinary extension. The surface's green accent is evidenced above without establishing a replacement global identity. Existing glyph-based close/directional controls are not promoted to a reusable icon rule. The supplied microscope asset's unknown attribution remains an explicit provenance limitation; no new raster asset needs shipping attribution.
