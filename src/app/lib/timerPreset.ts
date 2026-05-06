/** Sichtbare Timer-Karten-Stile – synchron zu CSS `.timer-shell--…` */

export const TIMER_PRESET_IDS = ['classic', 'minimal', 'glow', 'ring', 'mono', 'soft'] as const;

export type TimerPresetId = (typeof TIMER_PRESET_IDS)[number];

export function normalizeTimerPreset(v: unknown): TimerPresetId {
  if (typeof v === 'string' && (TIMER_PRESET_IDS as readonly string[]).includes(v)) {
    return v as TimerPresetId;
  }
  return 'classic';
}
