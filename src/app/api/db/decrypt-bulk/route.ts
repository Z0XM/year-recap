import { SecurityServer } from '@/lib/encryption';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // console.log(data);

        return NextResponse.json({ data: data.map(SecurityServer.decryptKeys) });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ data: [] });
    }
}
