import { NextRequest, NextResponse } from 'next/server';

const PI_API_KEY = process.env.PI_API_KEY || 'szoh3bcpzx2xjdkjjloi8xtj3gk3n2hdfeo3bz6t0uwe99ps0lucqudbfohvs0fq';
const PI_API_URL = 'https://api.minepi.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, txid } = body;

    if (!paymentId || !txid) {
      return NextResponse.json(
        { success: false, error: 'paymentId veya txid eksik' },
        { status: 400 }
      );
    }

    // Pi Network API'ye tamamlama gonder
    const response = await fetch(`${PI_API_URL}/v2/payments/${paymentId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${PI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ txid }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error('[Pi Complete] API hatasi:', response.status, errData);
      return NextResponse.json(
        { success: false, error: `Pi API hatasi: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      paymentId,
      txid,
      data,
    });

  } catch (error: any) {
    console.error('[Pi Complete] Sunucu hatasi:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Sunucu hatasi' },
      { status: 500 }
    );
  }
}
