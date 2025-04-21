export function objectToHeaders(obj: Record<string, string>): Headers {
  const headers = new Headers();
  for (const [key, value] of Object.entries(obj)) {
    headers.set(key, value);
  }
  return headers;
}

export function headersToObject(headers: Headers): Record<string, string> {
  const obj: Record<string, string> = {};
  for (const [key, value] of headers.entries()) {
    obj[key] = value;
  }
  return obj;
}
