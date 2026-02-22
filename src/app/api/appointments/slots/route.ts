import { NextRequest, NextResponse } from 'next/server';
import { getAvailableSlots } from '@/lib/db/queries/appointments';

export async function GET(req: NextRequest) {
    const date = req.nextUrl.searchParams.get('date');

    if (!date) {
        return new NextResponse('Date is required', { status: 400 });
    }

    try {
        const slots = await getAvailableSlots(date);
        return NextResponse.json(slots);
    } catch (error) {
        console.error('[SLOTS_GET]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}
