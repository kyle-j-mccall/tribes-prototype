import { DarkTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Linking } from 'react-native';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/src/core/auth';
import { InnerCircleProvider } from '@/src/core/innerCircle';
import { parseAppDeepLink, queueDeepLink } from '@/src/core/shell';
import { ThemeProvider } from '@/src/core/theme';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Cold-start auth gate: if the user is unauthed when the app boots, route
// them to /onboarding. Inbound deep links during this state are queued so
// they can replay after the user's first send (T-SHELL-ROUTE-008/009).
function AuthGate() {
  const { hydrated, isAuthed } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    const root = segments[0] ?? '';
    const inOnboarding = root === 'onboarding';
    if (!isAuthed && !inOnboarding) {
      router.replace('/onboarding');
    } else if (isAuthed && inOnboarding) {
      router.replace('/(tabs)');
    }
  }, [hydrated, isAuthed, segments, router]);

  return null;
}

// Deep-link receiver. When unauthed, parsed in-app links are queued;
// when authed, they navigate immediately. Unknown URLs fall through to
// the +not-found route (T-SHELL-ROUTE-011).
function DeepLinkHandler() {
  const { hydrated, isAuthed } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;

    const handle = (url: string) => {
      const target = parseAppDeepLink(url);
      if (!target) return;
      if (!isAuthed) {
        void queueDeepLink(target);
        return;
      }
      router.push({ pathname: target.pathname, params: target.params ?? {} });
    };

    void Linking.getInitialURL().then((url) => {
      if (url) handle(url);
    });
    const sub = Linking.addEventListener('url', ({ url }) => handle(url));
    return () => sub.remove();
  }, [hydrated, isAuthed, router]);

  return null;
}

export default function RootLayout() {
  return (
    <ThemeProvider mode="dark">
      <AuthProvider>
        <InnerCircleProvider>
          <NavigationThemeProvider value={DarkTheme}>
            <AuthGate />
            <DeepLinkHandler />
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="onboarding" options={{ headerShown: false }} />
              <Stack.Screen name="activity/[id]" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="light" />
          </NavigationThemeProvider>
        </InnerCircleProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
