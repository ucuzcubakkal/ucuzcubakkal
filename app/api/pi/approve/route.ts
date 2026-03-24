import { NextRequest, NextResponse } from 'next/server';

// Pi Network Server-Side API Key
// develop.pi adresinden "API Keys" bolumunden alin
const PI_API_KEY = process.env.PI_API_KEY || 'szoh3bcpzx2xjdkjjloi8xtj3gk3n2hdfeo3bz6t0uwe99ps0lucqudbfohvs0fq';
const PI_API_URL = 'https://api.minepi.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId } = body;

    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: 'paymentId eksik' },
        { status: 400 }
      );
    }

    // Pi Network API'ye onay gonder
    const response = await fetch(`${PI_API_URL}/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${PI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error('[Pi Approve] API hatasi:', response.status, errData);
      return NextResponse.json(
        { success: false, error: `Pi API hatasi: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      paymentId,
      data,
    });

  } catch (error: any) {
    console.error('[Pi Approve] Sunucu hatasi:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Sunucu hatasi' },
      { status: 500 }
    );
  }
}
