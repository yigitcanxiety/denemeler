import { MOCK_ANALYSIS, MOCK_IMAGE_DATA_URL, mockSkinAnalysisFor, type AnalyzeResponse } from '@tonelle/shared';
import { describe, expect, it } from 'vitest';
import { QUIZ_KEYS, completeQuiz, flowReducer, initialState, type FlowEvent, type FlowState } from './machine';

const response: AnalyzeResponse = {
  analysis: MOCK_ANALYSIS,
  recommendedLookIds: ['natural_glow', 'office_chic', 'soft_glam'],
  mock: true,
};

const run = (events: FlowEvent[], from: FlowState = initialState) => events.reduce(flowReducer, from);

const consented = run([
  { type: 'SET_CONSENT', field: 'explicit', value: true },
  { type: 'SET_CONSENT', field: 'terms', value: true },
  { type: 'ACCEPT_CONSENT' },
]);

const answers: FlowEvent[] = [
  { type: 'ANSWER', key: 'skinType', value: 'combination' },
  { type: 'ANSWER', key: 'eyeColor', value: 'brown' },
  { type: 'ANSWER', key: 'occasion', value: 'daily' },
  { type: 'ANSWER', key: 'budget', value: 'mid' },
  { type: 'ANSWER', key: 'experience', value: 'beginner' },
];

const atSelfie = run(answers, consented);
const scanning = run([{ type: 'SET_PHOTO', dataUrl: MOCK_IMAGE_DATA_URL, tooDark: false }, { type: 'START_ANALYSIS' }], atSelfie);

describe('analyze flow reducer', () => {
  it('starts at consent with both boxes unchecked', () => {
    expect(initialState.step).toBe('consent');
    expect(initialState.consent).toEqual({ explicit: false, terms: false });
  });

  it('blocks continuing until both consent boxes are ticked', () => {
    const onlyOne = run([{ type: 'SET_CONSENT', field: 'explicit', value: true }, { type: 'ACCEPT_CONSENT' }]);
    expect(onlyOne.step).toBe('consent');
    expect(onlyOne.consentAttempted).toBe(true);
    expect(consented.step).toBe('quiz');
    expect(consented.consentAttempted).toBe(false);
  });

  it('walks the 5 quiz questions one per screen, then goes to the selfie', () => {
    let state = consented;
    QUIZ_KEYS.forEach((key, i) => {
      expect(state.quizIndex).toBe(i);
      state = flowReducer(state, answers[i]!);
    });
    expect(state.step).toBe('selfie');
    expect(completeQuiz(state.quiz)).toEqual({
      skinType: 'combination',
      eyeColor: 'brown',
      occasion: 'daily',
      budget: 'mid',
      experience: 'beginner',
    });
  });

  it('ignores invalid answers and supports back / skip', () => {
    expect(flowReducer(consented, { type: 'ANSWER', key: 'skinType', value: 'scaly' })).toBe(consented);
    const second = run([answers[0]!], consented);
    expect(flowReducer(second, { type: 'QUIZ_BACK' }).quizIndex).toBe(0);
    expect(flowReducer(consented, { type: 'QUIZ_BACK' }).step).toBe('consent');
    const skipped = flowReducer(second, { type: 'SKIP_QUIZ' });
    expect(skipped.step).toBe('selfie');
    expect(completeQuiz(skipped.quiz)).toBeUndefined();
  });

  it('requires a photo before scanning', () => {
    expect(flowReducer(atSelfie, { type: 'START_ANALYSIS' }).step).toBe('selfie');
    expect(scanning.step).toBe('scanning');
  });

  it('goes to the teaser on success and then paywall → exit offer → teaser', () => {
    const teaser = flowReducer(scanning, { type: 'ANALYSIS_SUCCEEDED', response });
    expect(teaser.step).toBe('teaser');
    expect(teaser.result).toBe(response);

    const paywall = flowReducer(teaser, { type: 'OPEN_PAYWALL' });
    expect(paywall.step).toBe('paywall');

    const firstDismiss = flowReducer(paywall, { type: 'DISMISS_PAYWALL' });
    expect(firstDismiss.step).toBe('paywall');
    expect(firstDismiss.exitOfferOpen).toBe(true);

    const declined = flowReducer(firstDismiss, { type: 'CLOSE_EXIT_OFFER' });
    expect(declined.step).toBe('teaser');

    // The exit offer is shown only once.
    const again = run([{ type: 'OPEN_PAYWALL' }, { type: 'DISMISS_PAYWALL' }], declined);
    expect(again.step).toBe('teaser');
    expect(again.exitOfferOpen).toBe(false);
  });

  it('unlocks to results', () => {
    const results = run([{ type: 'ANALYSIS_SUCCEEDED', response }, { type: 'OPEN_PAYWALL' }, { type: 'UNLOCK' }], scanning);
    expect(results.step).toBe('results');
    expect(results.unlocked).toBe(true);
  });

  it('returns to the selfie step with a message on no_face and drops the photo', () => {
    const failed = flowReducer(scanning, { type: 'ANALYSIS_FAILED', code: 'no_face' });
    expect(failed.step).toBe('selfie');
    expect(failed.photo).toBeNull();
    expect(failed.errorKey).toBe('errors.no_face');
  });

  it('keeps the photo for retryable errors', () => {
    const failed = flowReducer(scanning, { type: 'ANALYSIS_FAILED', code: 'network' });
    expect(failed.step).toBe('selfie');
    expect(failed.photo).toBe(MOCK_IMAGE_DATA_URL);
    expect(failed.errorKey).toBe('errors.network');
    expect(flowReducer(scanning, { type: 'ANALYSIS_FAILED', code: 'rate_limited' }).errorKey).toBe('errors.rate_limited');
  });

  it('restores persisted results without a photo', () => {
    const locked = flowReducer(initialState, { type: 'RESTORE', response, unlocked: false });
    expect(locked.step).toBe('teaser');
    expect(locked.photo).toBeNull();
    const unlocked = flowReducer(initialState, { type: 'RESTORE', response, unlocked: true });
    expect(unlocked.step).toBe('results');
  });

  it('start over keeps consent + entitlement; delete data resets everything', () => {
    const results = run([{ type: 'ANALYSIS_SUCCEEDED', response }, { type: 'OPEN_PAYWALL' }, { type: 'UNLOCK' }], scanning);
    const over = flowReducer(results, { type: 'START_OVER' });
    expect(over.step).toBe('quiz');
    expect(over.result).toBeNull();
    expect(over.photo).toBeNull();
    expect(over.unlocked).toBe(true);
    expect(flowReducer(results, { type: 'DELETE_DATA' })).toEqual(initialState);
  });

  it('asks for a new selfie from results (e.g. after a reload)', () => {
    const restored = flowReducer(initialState, { type: 'RESTORE', response, unlocked: true });
    const selfie = flowReducer(restored, { type: 'NEW_SELFIE' });
    expect(selfie.step).toBe('selfie');
    const rescanned = run([{ type: 'SET_PHOTO', dataUrl: MOCK_IMAGE_DATA_URL, tooDark: true }, { type: 'START_ANALYSIS' }], selfie);
    expect(rescanned.step).toBe('scanning');
    expect(flowReducer(rescanned, { type: 'ANALYSIS_SUCCEEDED', response }).step).toBe('results');
  });
});

describe('single-analysis modes', () => {
  const consentIn = (mode: 'color' | 'skin') =>
    run(
      [
        { type: 'SET_CONSENT', field: 'explicit', value: true },
        { type: 'SET_CONSENT', field: 'terms', value: true },
        { type: 'ACCEPT_CONSENT' },
      ],
      { ...initialState, mode },
    );

  it('skips the quiz and the paywall in colour mode', () => {
    const atSelfie = consentIn('color');
    expect(atSelfie.step).toBe('selfie');
    const done = run(
      [{ type: 'SET_PHOTO', dataUrl: MOCK_IMAGE_DATA_URL, tooDark: false }, { type: 'START_ANALYSIS' }, { type: 'ANALYSIS_SUCCEEDED', response }],
      atSelfie,
    );
    expect(done.step).toBe('results');
    expect(run([{ type: 'QUIZ_BACK' }], atSelfie).step).toBe('consent');
  });

  it('stores the skin result and keeps the mode when starting over', () => {
    const skin = { skin: mockSkinAnalysisFor('tr'), mock: true };
    const done = run(
      [{ type: 'SET_PHOTO', dataUrl: MOCK_IMAGE_DATA_URL, tooDark: false }, { type: 'START_ANALYSIS' }, { type: 'SKIN_SUCCEEDED', response: skin }],
      consentIn('skin'),
    );
    expect(done.step).toBe('results');
    expect(done.skin).toEqual(skin);
    const again = run([{ type: 'START_OVER' }], done);
    expect(again.mode).toBe('skin');
    expect(again.step).toBe('selfie');
    expect(again.skin).toBeNull();
  });
});
