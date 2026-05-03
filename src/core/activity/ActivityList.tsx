// ActivityList — sectioned list of sent (top) and received (bottom)
// coordinations with pull-to-refresh.
//
// SectionList's section ordering is the source of truth for "Sent above
// Received" (T-SHELL-ACT-001). Empty sections are dropped so the section
// header doesn't render alone — the empty state itself ships in 5.3.

import { RefreshControl, SectionList, StyleSheet, View } from 'react-native';

import { Text } from '../a11y';
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
  const { sent, received, isRefreshing, refetch } = useActivity();
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
});
