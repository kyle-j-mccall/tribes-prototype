// Activity domain types — shared by the list view (5.2), detail (5.x), and
// later by the data layer slice. The shapes here are deliberately narrow:
// what the row actually needs to render. Anything richer (response objects,
// inner-circle metadata) belongs in the detail-fetch contract, not on the
// list row.

export interface Person {
  id: string;
  name: string;
}

export interface SentCoordination {
  kind: 'sent';
  id: string;
  body: string;
  recipients: Person[];
  responseCount: number;
  sentAt: Date;
}

export interface ReceivedCoordination {
  kind: 'received';
  id: string;
  body: string;
  sender: Person;
  // Has the recipient opted in ("I might come too")? Drives the status
  // line. Undefined / false → recency-only status.
  reciprocated?: boolean;
  receivedAt: Date;
}

export type ActivityItem = SentCoordination | ReceivedCoordination;
