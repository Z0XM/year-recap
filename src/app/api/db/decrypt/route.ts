import { SecurityServer } from '@/lib/encryption';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        return NextResponse.json({ data: SecurityServer.decryptKeys(data) });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ data: {} });
    }
}
