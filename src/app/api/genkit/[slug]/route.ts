import { NextRequest, NextResponse } from 'next/server';

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, context: Params) {
  const { slug } = await context.params;
  return NextResponse.json(
    {
      message: `Genkit route ${slug} not implemented`,
      status: 'not_implemented',
    },
    { status: 501 }
  );
}

export async function POST(request: NextRequest, context: Params) {
  const { slug } = await context.params;
  return NextResponse.json(
    {
      message: `Genkit route ${slug} not implemented`,
      status: 'not_implemented',
    },
    { status: 501 }
  );
}
