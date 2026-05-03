// ActivityList — sectioned list of sent (top) and received (bottom)
// coordinations with pull-to-refresh, falling back to the Foundation
// EmptyState when both lists are empty.
//
// SectionList's section ordering is the source of truth for "Sent above
// Received" (T-SHELL-ACT-001). When both arrays are empty (5.3) we
// render <EmptyState> with register-flexed copy and a Compose CTA that
// routes to the Send tab.

import { useRouter } from 'expo-router';
import { RefreshControl, ScrollView, SectionList, StyleSheet, View } from 'react-native';

import { Text } from '../a11y';
import { copy } from '../copy/copy';
import { currentRegister } from '../copy/registerSignals';
import { EmptyState } from '../state';
import { colors, space, text as textTokens } from '../theme/tokens';
import { ReceivedRow } from './ReceivedRow';
import { SentRow } from './SentRow';
import type { ActivityItem } from './types';
import { useActivity } from './useActivity';

interface Section {
  title: string;
  data: ActivityItem[];
}

export function ActivityList() {
  const router = useRouter();
  const { sent, received, isRefreshing, refetch } = useActivity();
  const isEmpty = sent.length === 0 && received.length === 0;

  // Register defaults to warm until UserStats lands.
  const register = currentRegister({});

  if (isEmpty) {
    return (
      <ScrollView
        style={styles.emptyScroll}
        contentContainerStyle={styles.emptyContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              void refetch();
            }}
            tintColor={colors.primary.default}
          />
        }
      >
        <EmptyState
          illustration="paper-boat"
          title={copy('activity.empty.title', { register })}
          body=""
          cta={{
            label: copy('activity.empty.cta', { register }),
            onPress: () => router.navigate({ pathname: '/(tabs)' }),
          }}
        />
      </ScrollView>
    );
  }

  const sections: Section[] = [];
  if (sent.length) sections.push({ title: 'Sent', data: sent });
  if (received.length) sections.push({ title: 'Received', data: received });

  return (
    <SectionList<ActivityItem, Section>
      sections={sections}
      keyExtractor={(item) => `${item.kind}:${item.id}`}
      stickySectionHeadersEnabled={false}
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
        </View>
      )}
      renderItem={({ item }) =>
        item.kind === 'sent' ? <SentRow item={item} /> : <ReceivedRow item={item} />
      }
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => {
            void refetch();
          }}
          tintColor={colors.primary.default}
        />
      }
      contentContainerStyle={styles.content}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: space.xl,
  },
  sectionHeader: {
    paddingHorizontal: space.md,
    paddingTop: space.md,
    paddingBottom: space.xs,
    backgroundColor: colors.bg.canvas,
  },
  sectionTitle: {
    ...textTokens.label,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border.subtle,
    marginLeft: space.md + 44 + space.md,
  },
  emptyScroll: {
    flex: 1,
  },
  emptyContent: {
    flexGrow: 1,
  },
});
