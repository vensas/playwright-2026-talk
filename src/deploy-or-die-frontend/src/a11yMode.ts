/**
 * Accessibility switch for the live demo.
 *
 * When this value is `false`, the deploy form has three accessibility defects
 * that axe-core finds:
 *   - the environment field has no related label  (WCAG 4.1.2, rule "label")
 *   - the history button has no accessible name   (WCAG 4.1.2, rule "button-name")
 *   - the hint text has too little contrast       (WCAG 1.4.3, rule "color-contrast")
 *
 * Change this value to `true` to correct all three defects. The talk changes
 * the value on stage, to show the axe-core test go from failed to passed.
 */
export const ACCESSIBLE_MODE = false;

/** The time in seconds that you must wait between two deployments. */
export const COOLDOWN_SECONDS = 30;
