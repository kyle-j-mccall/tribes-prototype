// Tribes a11y ESLint plugin (project-local).
//
// Custom rules that enforce the Foundation a11y contract from
// docs/shared-context.md and 01-foundation-spec §2.

const MIN_TOUCH_TARGET = 44;

const TOUCHABLE_NAMES = new Set([
  'Pressable',
  'TouchableOpacity',
  'TouchableHighlight',
  'TouchableWithoutFeedback',
  'TouchableNativeFeedback',
]);

// Walk a JSX style prop to find numeric width/height literals.
// Handles three shapes:
//   style={{ width: 24 }}
//   style={[styles.foo, { width: 24 }]}
//   style={styles.foo}             ← skipped (we can't resolve StyleSheet refs)
function scanStyleObject(node, dimensions) {
  if (!node || node.type !== 'ObjectExpression') return;
  for (const prop of node.properties) {
    if (prop.type !== 'Property') continue;
    const key = prop.key;
    const keyName =
      key.type === 'Identifier' ? key.name : key.type === 'Literal' ? key.value : null;
    if (keyName !== 'width' && keyName !== 'height') continue;
    const value = prop.value;
    if (value.type === 'Literal' && typeof value.value === 'number') {
      dimensions.push({ key: keyName, value: value.value, node: prop });
    }
  }
}

function collectDimensions(styleAttrValue) {
  const dimensions = [];
  if (!styleAttrValue || styleAttrValue.type !== 'JSXExpressionContainer') return dimensions;
  const expr = styleAttrValue.expression;
  if (expr.type === 'ObjectExpression') {
    scanStyleObject(expr, dimensions);
  } else if (expr.type === 'ArrayExpression') {
    for (const el of expr.elements) {
      if (el && el.type === 'ObjectExpression') scanStyleObject(el, dimensions);
    }
  }
  return dimensions;
}

function hasHitSlop(attributes) {
  return attributes.some(
    (attr) => attr.type === 'JSXAttribute' && attr.name && attr.name.name === 'hitSlop',
  );
}

const minTouchTarget = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Touch targets must be at least 44pt on each axis (WCAG 2.2 / iOS HIG). Add hitSlop or increase the dimension.',
    },
    schema: [],
    messages: {
      tooSmall:
        'Touch target {{key}} of {{value}}pt is below the 44pt minimum. Add hitSlop or increase the dimension.',
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const name = node.name;
        if (name.type !== 'JSXIdentifier' || !TOUCHABLE_NAMES.has(name.name)) return;
        if (hasHitSlop(node.attributes)) return;

        const styleAttr = node.attributes.find(
          (attr) => attr.type === 'JSXAttribute' && attr.name && attr.name.name === 'style',
        );
        if (!styleAttr) return;

        const dims = collectDimensions(styleAttr.value);
        for (const dim of dims) {
          if (dim.value < MIN_TOUCH_TARGET) {
            context.report({
              node: dim.node,
              messageId: 'tooSmall',
              data: { key: dim.key, value: String(dim.value) },
            });
          }
        }
      },
    };
  },
};

module.exports = {
  rules: {
    'min-touch-target': minTouchTarget,
  },
};
