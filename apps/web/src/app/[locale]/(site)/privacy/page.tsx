import { legalRoute } from '@/components/legal/LegalDocument';

const route = legalRoute('privacy');

export const generateMetadata = route.generateMetadata;
export default route.Page;
