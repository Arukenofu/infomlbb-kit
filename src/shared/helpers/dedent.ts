export function dedent(str: string) {
  const lines = str.split("\n");
  const minIndent = Math.min(
    ...lines.filter(line => line.trim()).map(line => line.match(/^(\s*)/)![0].length)
  );
  return lines.map(line => line.slice(minIndent)).join("\n").trim();
}