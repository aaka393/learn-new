export const extractPlainText = (blocks: any[]): string => {
  if (!Array.isArray(blocks)) return '';

  return blocks
    .map((block) => {
      if (block.type === 'paragraph' && Array.isArray(block.children)) {
        return block.children.map((child: { text: any; }) => child.text).join('');
      }
      return '';
    })
    .join('\n');
};
