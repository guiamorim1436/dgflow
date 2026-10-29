import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xzjugxtxuxgkiszbpuxx.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function handleProxy(req: NextRequest, paramsPromise: Promise<{ path: string[] }>) {
  const { path } = await paramsPromise;
  const targetPath = (path || []).join('/');
  const search = req.nextUrl.search;
  const targetUrl = `${SUPABASE_URL}/${targetPath}${search}`;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    // Preserve useful headers except host, connection, etc.
    const lower = key.toLowerCase();
    if (!['host', 'connection', 'content-length'].includes(lower)) {
      headers.set(key, value);
    }
  });

  // Attach service role key securely on server side
  headers.set('apikey', SERVICE_KEY);
  headers.set('Authorization', `Bearer ${SERVICE_KEY}`);

  try {
    const body = ['GET', 'HEAD'].includes(req.method) ? undefined : await req.arrayBuffer();

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    });

    const resHeaders = new Headers();
    response.headers.forEach((value, key) => {
      resHeaders.set(key, value);
    });

    // Ensure CORS headers if needed
    resHeaders.set('Access-Control-Allow-Origin', '*');
    resHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    resHeaders.set('Access-Control-Allow-Headers', '*');

    const resBody = await response.arrayBuffer();
    return new NextResponse(resBody, {
      status: response.status,
      statusText: response.statusText,
      headers: resHeaders,
    });
  } catch (err: any) {
    console.error('Supabase proxy error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, context.params);
}

export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, context.params);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, context.params);
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, context.params);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, context.params);
}

export async function HEAD(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, context.params);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}
