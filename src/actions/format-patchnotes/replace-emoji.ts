function replaceEmojisWithStickers(
  html: string,
  stickerLinks: string[],
) {
  let index = 0;
  return html.replace(/\p{Emoji_Presentation}/gu, () => {
    return `<custom-emoji-wrapper><img src="${stickerLinks[index++]}" alt=""></custom-emoji-wrapper>`;
  });
}

export { replaceEmojisWithStickers };
