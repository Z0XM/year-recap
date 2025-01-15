import { SecurityServer } from '@/lib/encryption';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //     return Response.json({ message: 'Unauthorized' }, { status: 401 });
    // }
    // const supabase = await createClient();
    // const allDayData = await supabase.from('day_data').select('*');
    // if (allDayData.error) {
    //     return NextResponse.json({ success: false, error: allDayData.error });
    // }
    // const encryptedDayDataArray = allDayData.data.map((data) => {
    //     return { ...data, metadata: Security.encryptKeys(data.metadata) };
    // });
    // const deletionResponse = await supabase.from('day_data').delete().neq('day_int', 0);
    // if (deletionResponse.error) {
    //     return NextResponse.json({ success: false, error: deletionResponse.error });
    // }
    // const insertedData = await supabase.from('day_data').insert(encryptedDayDataArray);
    // if (insertedData.error) {
    //     return NextResponse.json({ success: false, error: insertedData.error });
    // }
    // return NextResponse.json({ message: 'Encrypted All Data Successfully' });
    // return NextResponse.json({ data: encryptedDayDataArray });
    // const decryptedDayDataArray = encryptedDayDataArray.map((data) => {
    //     return { ...data, metadata: Security.decryptedKeys(data.metadata) };
    // });
    // return NextResponse.json({ data: decryptedDayDataArray });
}
