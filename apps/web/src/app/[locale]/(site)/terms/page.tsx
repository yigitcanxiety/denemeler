import { legalRoute } from '@/components/legal/LegalDocument';

const route = legalRoute('terms');

export const generateMetadata = route.generateMetadata;
export default route.Page;
