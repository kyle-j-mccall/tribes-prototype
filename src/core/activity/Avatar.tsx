// Avatar — circular initial-letter placeholder.
//
// The substrate phase doesn't render real images (no avatar URLs in the
// data layer yet). A coral-tinted circle with the first letter of the
// person's name is enough for layout, snapshot, and a11y verification.
// When the data layer ships images, this component swaps in expo-image.

import { StyleSheet, View } from 'react-native';

import { Text } from '../a11y';
import { colors, text as textTokens } from '../theme/tokens';

export const AVATAR_SIZE = 36;
const CLUSTER_OVERLAP = 12;
const CLUSTER_MAX = 3;

function initial(name: string): string {
  const ch = name.trim().charAt(0);
  return ch ? ch.toUpperCase() : '·';
}

export interface AvatarProps {
  name: string;
  size?: number;
}

export function Avatar({ name, size = AVATAR_SIZE }: AvatarProps) {
  const dim = { width: size, height: size, borderRadius: size / 2 };
  return (
    <View style={[styles.avatar, dim]} accessibilityElementsHidden>
      <Text style={styles.initial} maxFontSizeMultiplier={1.2}>
        {initial(name)}
      </Text>
    </View>
  );
}

export interface AvatarClusterProps {
  people: { id: string; name: string }[];
  size?: number;
}

export function AvatarCluster({ people, size = AVATAR_SIZE }: AvatarClusterProps) {
  const visible = people.slice(0, CLUSTER_MAX);
  const overflow = people.length - visible.length;
  const overlap = Math.max(0, CLUSTER_OVERLAP);
  return (
    <View style={styles.cluster}>
      {visible.map((person, idx) => (
        <View key={person.id} style={[idx === 0 ? null : { marginLeft: -overlap }]}>
          <Avatar name={person.name} size={size} />
        </View>
      ))}
      {overflow > 0 ? (
        <View
          style={[
            styles.avatar,
            styles.overflow,
            { width: size, height: size, borderRadius: size / 2, marginLeft: -overlap },
          ]}
          accessibilityElementsHidden
        >
          <Text style={styles.overflowLabel} maxFontSizeMultiplier={1.2}>
            +{overflow}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  cluster: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: colors.primary.tint,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.bg.canvas,
  },
  initial: {
    ...textTokens.label,
    color: colors.bg.canvas,
    fontWeight: '600',
  },
  overflow: {
    backgroundColor: colors.bg.elevated,
  },
  overflowLabel: {
    ...textTokens.label,
    color: colors.text.primary,
    fontWeight: '600',
  },
});
