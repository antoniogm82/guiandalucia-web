export function GET() {
  return Response.json({ ok: true, env: process.env.SITE_ENV ?? 'staging' });
}
