// Action helper extracted from the provider so it's testable in Node
// without rendering React. The provider (InnerCircleContext) wraps this in
// a useCallback that captures dispatch.

import type { Action } from './reducer';
import type { InnerCircleContact } from './types';
import type { ContactPicker } from './contactPicker';

export async function pickAndAdd(
  picker: ContactPicker,
  dispatch: (action: Action) => void,
): Promise<InnerCircleContact | null> {
  const contact = await picker.pick();
  if (contact) dispatch({ type: 'add', contact });
  return contact;
}
