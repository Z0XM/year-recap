'use client';

import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '../ui/loadingSpinner';

const fetchPeopleOfToday = async ({ dayInt }: { dayInt: number }) => {
    const supabase = createClient();

    const userList = await supabase.from('users').select('id, display_name, accent_color').eq('isActive', true).limit(100);

    if (userList.error || !userList.data) {
        return { isError: true as const, errorMessage: userList.error.message };
    }

    const hasFilledFormList = await supabase
        .from('day_data')
        .select('id, user_id, metadata')
        .eq('day_int', dayInt)
        .in(
            'user_id',
            userList.data.map((x) => x.id)
        );

    if (hasFilledFormList.error || !hasFilledFormList.data) {
        return { isError: true as const, errorMessage: hasFilledFormList.error.message };
    }

    const hasFilledMap: { [key: string]: boolean } = {};
    hasFilledFormList.data.forEach((userData) => {
        hasFilledMap[userData.user_id] = true;
    });

    const metadataMap: { [key: string]: any } = {};
    hasFilledFormList.data.forEach((userData) => {
        metadataMap[userData.user_id] = userData.metadata;
    });

    return {
        isError: false as const,
        data: {
            userList: userList.data,
            hasFilledMap,
            metadataMap
        }
    };
};

export default function PeopleOfToday() {
    const today = new Date(new Date().getTime() - 12 * 60 * 60 * 1000);
    const dayInt = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    const [peopleOfToday, setPeopleOfToday] = useState<
        | { hasLoaded: false }
        | { hasLoaded: true; isError: true; errorMessage: string }
        | {
              hasLoaded: true;
              isError: false;
              data: {
                  userList: {
                      id: string;
                      display_name: string;
                      accent_color: string;
                  }[];
                  hasFilledMap: { [key: string]: boolean };
                  metadataMap: { [key: string]: any };
              };
          }
    >({
        hasLoaded: false
    });

    useEffect(() => {
        fetchPeopleOfToday({ dayInt }).then((res) => {
            setPeopleOfToday({ hasLoaded: true, ...res });
        });
    }, [dayInt]);

    if (!peopleOfToday.hasLoaded) {
        return <LoadingSpinner />;
    }

    if (peopleOfToday.isError) {
        return <div>Something Went Wrong!</div>;
    }

    return (
        <div className="flex max-w-[90%] flex-row flex-wrap justify-center gap-4 pt-4 text-center">
            {peopleOfToday.data.userList.map((user, index) => {
                if (peopleOfToday.data.hasFilledMap[user.id]) {
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
                                {/* {dayCountMap[user.id] ?? 0}🔥 */}
                                {peopleOfToday.data.metadataMap[user.id].day_emoji}
                            </div>
                            {/* <span className="text-sm text-gray-800">/{today.getFullYear() % 4 === 0 ? 366 : 365}</span> */}
                        </Badge>
                    );
                } else {
                    return (
                        <Badge key={index} variant={'outline'} className="text-xl">
                            {user.display_name}
                            {/* {dayCountMap[user.id] ?? 0}🔥 */}
                            {/* <span className="text-sm text-gray-300">/{today.getFullYear() % 4 === 0 ? 366 : 365}</span> */}
                        </Badge>
                    );
                }
            })}
        </div>
    );
}
