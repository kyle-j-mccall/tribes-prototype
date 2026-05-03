// Inner-circle contact shape. Phone numbers are preserved per-contact for
// the composer slice (sender path) but are not surfaced in the profile UI.

export interface InnerCircleContact {
  id: string;
  name: string;
  phoneNumbers: string[];
}
