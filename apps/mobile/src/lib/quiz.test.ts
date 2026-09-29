import { en, t } from '@tonelle/shared';
import { describe, expect, it } from 'vitest';

import { QUIZ_STEPS, completeQuiz, firstUnansweredStep } from './quiz';

describe('quiz steps', () => {
  it('has 5 steps whose keys all exist in the dictionaries', () => {
    expect(QUIZ_STEPS).toHaveLength(5);
    for (const step of QUIZ_STEPS) {
      for (const key of [step.questionKey, step.hintKey, ...step.options.map((o) => o.labelKey)]) {
        expect(t('en', key)).not.toBe(key);
        expect(t('tr', key)).not.toBe(key);
      }
      expect(step.options.length).toBe(Object.keys(en.quiz[step.id].options).length);
    }
  });

  it('only returns complete answers', () => {
    expect(completeQuiz({ skinType: 'dry' })).toBeUndefined();
    const full = { skinType: 'dry', eyeColor: 'brown', occasion: 'daily', budget: 'mid', experience: 'pro' } as const;
    expect(completeQuiz(full)).toEqual(full);
    expect(firstUnansweredStep({})).toBe(0);
    expect(firstUnansweredStep({ skinType: 'dry', eyeColor: 'hazel' })).toBe(2);
    expect(firstUnansweredStep(full)).toBe(5);
  });
});
