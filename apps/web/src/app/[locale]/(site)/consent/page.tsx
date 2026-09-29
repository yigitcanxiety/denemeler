import { legalRoute } from '@/components/legal/LegalDocument';

const route = legalRoute('consent');

export const generateMetadata = route.generateMetadata;
export default route.Page;
