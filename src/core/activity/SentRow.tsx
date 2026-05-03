import { useRouter } from 'expo-router';

import { ActivityRow } from './ActivityRow';
import { AvatarCluster } from './Avatar';
import { sentStatus } from './recency';
import type { SentCoordination } from './types';

export interface SentRowProps {
  item: SentCoordination;
  now?: Date;
}

export function SentRow({ item, now }: SentRowProps) {
  const router = useRouter();
  const status = sentStatus(item.responseCount, item.sentAt, now);
  const recipientNames = item.recipients
    .slice(0, 3)
    .map((p) => p.name)
    .join(', ');
  return (
    <ActivityRow
      leading={<AvatarCluster people={item.recipients} />}
      body={item.body}
      status={status}
      accessibilityLabel={`Sent to ${recipientNames}. ${status}.`}
      onPress={() => router.push({ pathname: '/activity/[id]', params: { id: item.id } })}
    />
  );
}
