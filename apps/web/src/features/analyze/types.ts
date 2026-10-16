import type { CoreLocale, TranslationKey, TranslationVars } from '@tonelle/shared';
import type { Dispatch } from 'react';
import type { SiteContent } from '@/content/types';
import type { FlowEvent, FlowState } from './machine';

export type AnalyzeCopy = SiteContent['analyze'];
export type StoreCopy = SiteContent['stores'];
export type Translate = (key: TranslationKey, vars?: TranslationVars) => string;

export interface StepProps {
  locale: CoreLocale;
  state: FlowState;
  dispatch: Dispatch<FlowEvent>;
  copy: AnalyzeCopy;
  tt: Translate;
}
