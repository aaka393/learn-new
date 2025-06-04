// utils/richTextParser.ts
export const parseRichText = (blocks: any[] | string): string => {
  if (typeof blocks === 'string') return blocks; // If it's already HTML or plain text
  if (!Array.isArray(blocks)) return '';

  return blocks
    .map((block) =>
      block.children?.map((child: any) => child.text).join('') ?? ''
    )
    .join('<br/>');
};
