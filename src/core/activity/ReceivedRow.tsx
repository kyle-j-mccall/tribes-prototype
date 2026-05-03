import { useRouter } from 'expo-router';

import { ActivityRow } from './ActivityRow';
import { Avatar } from './Avatar';
import { receivedStatus } from './recency';
import type { ReceivedCoordination } from './types';

export interface ReceivedRowProps {
  item: ReceivedCoordination;
  now?: Date;
}

export function ReceivedRow({ item, now }: ReceivedRowProps) {
  const router = useRouter();
  const status = receivedStatus(item.reciprocated ?? false, item.receivedAt, now);
  return (
    <ActivityRow
      leading={<Avatar name={item.sender.name} />}
      body={item.body}
      status={status}
      accessibilityLabel={`From ${item.sender.name}. ${status}.`}
      onPress={() => router.push({ pathname: '/activity/[id]', params: { id: item.id } })}
    />
  );
}
