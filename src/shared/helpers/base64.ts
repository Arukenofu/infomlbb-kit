export function checkIsAllowedBase64Images(base64: string) {
  return /^data:(image\/(jpeg|jpg|webp));base64,(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(base64);
}

export function getMimeTypeFromDataURI(base64: string): string | null {
  const match = base64.match(/^data:(.+?);base64,/);
  return match ? match[1] : null;
}

export async function fetchImageAsBase64(url: string, format: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64String = buffer.toString('base64');

  return `data:${format};base64,${base64String}`
}