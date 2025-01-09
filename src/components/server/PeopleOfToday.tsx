import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/server';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

export const revalidate = 60;

export default async function PeopleOfToday() {
    const supabase = await createClient();

    const today = new Date(new Date().getTime() - 12 * 60 * 60 * 1000);
    const dayInt = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    const { data: userArray, error: userError } = await supabase
        .from('users')
        .select('id, display_name, accent_color')
        .eq('isActive', true)
        .limit(100);

    if (userError || !userArray) {
        console.error(userError);
        return <div className="flex h-screen w-screen items-center justify-center">Something Went Wrong!</div>;
    }

    const { data: hasFilledForms, error: hasFilledFormError } = await supabase
        .from('day_data')
        .select('id, user_id, metadata')
        .eq('day_int', dayInt)
        .in(
            'user_id',
            userArray.map((x) => x.id)
        );

    if (hasFilledFormError || !hasFilledForms) {
        console.error(hasFilledFormError);
        return <div className="flex h-screen w-screen items-center justify-center">Something Went Wrong!</div>;
    }

    const { data: dayCounts, error: dayCountError } = await supabase
        .from('day_data')
        .select('user_id, day_int.count()')
        .in(
            'user_id',
            userArray.map((x) => x.id)
        );

    if (dayCountError || !dayCounts) {
        console.error(dayCountError);
        return <div className="flex h-screen w-screen items-center justify-center">Something Went Wrong!</div>;
    }

    const hasFilledMap: { [key: string]: boolean } = {};
    hasFilledForms.forEach((userData) => {
        hasFilledMap[userData.user_id] = true;
    });

    const metadataMap: { [key: string]: any } = {};
    hasFilledForms.forEach((userData) => {
        metadataMap[userData.user_id] = userData.metadata;
    });

    const dayCountMap: { [key: string]: number } = {};
    dayCounts.forEach((user) => {
        dayCountMap[user.user_id] = user.count;
    });

    return (
        <div className="flex max-w-[90%] flex-row flex-wrap justify-center gap-4 pt-4 text-center">
            {userArray
                .sort((a, b) => dayCountMap[b.id] - dayCountMap[a.id])
                .map((user, index) => {
                    if (hasFilledMap[user.id]) {
                        return (
                            <Badge
                                key={index}
                                // style={{ borderColor: user.accent_color }}
                                variant={'outline'}
                                className="border-green-500 px-4 py-1 text-xl"
                            >
                                <div className="flex">
                                    <span className="mr-2" style={{ color: user.accent_color }}>
                                        {user.display_name}
                                    </span>
                                    {dayCountMap[user.id] ?? 0}🔥 {metadataMap[user.id].day_emoji}
                                </div>
                                {/* <span className="text-sm text-gray-800">/{today.getFullYear() % 4 === 0 ? 366 : 365}</span> */}
                            </Badge>
                        );
                    } else {
                        return (
                            <Badge key={index} variant={'outline'} className="text-xl">
                                {user.display_name} {dayCountMap[user.id] ?? 0}🔥
                                {/* <span className="text-sm text-gray-300">/{today.getFullYear() % 4 === 0 ? 366 : 365}</span> */}
                            </Badge>
                        );
                    }
                })}
        </div>
    );
}
