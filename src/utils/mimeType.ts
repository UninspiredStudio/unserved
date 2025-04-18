export function isOneOfMimeTypes(mimeType: string, allowedMimeTypes: string[]) {
  const [mime] = mimeType.split(";");

  if (!mime) return false;
  const [type, subtype] = mime.split("/");
  if (!type || !subtype) return false;
  for (const allowedMimeType of allowedMimeTypes) {
    const [allowedType, allowedSubtype] = allowedMimeType.split("/");
    if (allowedType === "*" || type === allowedType) {
      if (allowedSubtype === "*" || subtype === allowedSubtype) {
        return true;
      }
    }
  }
  return false;
}
