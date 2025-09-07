import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json(
        {
          error:
            'Invalid payload. "message" property must be a non-empty string.',
        },
        { status: 400 }
      );
    }

    const { message } = body;

    return NextResponse.json({ echoed: `Echo: ${message}` });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON in request body.' },
      { status: 400 }
    );
  }
}
