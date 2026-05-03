// 3-tab nav scaffold: Send (default) / Activity / Profile.
//
// Tints, header behavior, and touch targets per Shell §1:
//   - active=primary, inactive=text-secondary (T-SHELL-NAV-002)
//   - 44pt minimum touch target via tabBarStyle.height (T-SHELL-NAV-004)
//   - composer (Send) is full-bleed, no header. Activity/Profile screens
//     own their own headers so the title font/spacing matches text.title.
//   - tab labels routed through copy() for register flex (T-SHELL-NAV-007)

import { Tabs } from 'expo-router';

import { HapticTab } from '@/components/haptic-tab';
import { copy } from '@/src/core/copy/copy';
import { currentRegister } from '@/src/core/copy/registerSignals';
import { colors, space } from '@/src/core/theme/tokens';

const TAB_BAR_HEIGHT = 56;

export default function TabLayout() {
  // Register resolves from UserStats once a real user store lands; until
  // then we pass an empty stats object → 'warm'.
  const register = currentRegister({});

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: colors.primary.default,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          height: TAB_BAR_HEIGHT + space.sm,
          backgroundColor: colors.bg.canvas,
          borderTopColor: colors.border.subtle,
          paddingTop: space.xs,
          paddingBottom: space.xs,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: copy('nav.tab.send', { register }) }} />
      <Tabs.Screen name="activity" options={{ title: copy('nav.tab.activity', { register }) }} />
      <Tabs.Screen name="profile" options={{ title: copy('nav.tab.profile', { register }) }} />
    </Tabs>
  );
}
