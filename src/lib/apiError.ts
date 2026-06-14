export function errorResponse(err: unknown): Response {
  const message = err instanceof Error ? err.message : "Erro desconhecido.";
  const status = /não encontrada/i.test(message) ? 404 : 400;
  return Response.json({ error: message }, { status });
}
