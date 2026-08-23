import { colors } from '@/lib/theme';
import { isNativeRoute } from '@/lib/webRoutes';
import { router } from 'expo-router';

export function openWebPage(path: string, title: string) {
  if (isNativeRoute(path)) {
    router.push(path as any);
    return;
  }

  const normalized = path.startsWith('/') ? path.slice(1) : path;
  router.push({
    pathname: '/web/[path]',
    params: { path: normalized, title },
  } as any);
}

export function navigateFromDrawer(path: string, title: string, closeDrawer: () => void) {
  closeDrawer();
  openWebPage(path, title);
}

export { colors };
