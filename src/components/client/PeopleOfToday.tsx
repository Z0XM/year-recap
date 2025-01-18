'use client';

import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '../ui/loadingSpinner';
import { SecurityClient } from '@/lib/encryption';
import { useAppInfo } from '@/store/appInfo';

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

    const decryptedMetadata = await SecurityClient.decryptMultipleKeys(
        hasFilledFormList.data.map((userData) => ({
            day_color: userData.metadata.day_color,
            day_emoji: userData.metadata.day_emoji,
            day_public_note: userData.metadata.day_public_note
        }))
    );

    hasFilledFormList.data.map((userData, index) => {
        metadataMap[userData.user_id] = decryptedMetadata[index];
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
    const { dayInt } = useAppInfo();

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
        <div className="flex flex-col items-center">
            <div className="flex max-w-[90%] flex-row flex-wrap justify-center gap-4 pt-4 text-center">
                {peopleOfToday.data.userList.map((user, index) => {
                    if (peopleOfToday.data.hasFilledMap[user.id]) {
                        return (
                            <Badge
                                key={index}
                                // style={{ borderColor: user.accent_color }}
                                variant={'outline'}
                                className="text-md border-green-500 px-4 py-1 md:text-xl"
                            >
                                <div className="flex">
                                    <span className="mr-2" style={{ color: peopleOfToday.data.metadataMap[user.id].day_color }}>
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
                            <Badge key={index} variant={'outline'} className="text-md md:text-xl">
                                {user.display_name}
                                {/* {dayCountMap[user.id] ?? 0}🔥 */}
                                {/* <span className="text-sm text-gray-300">/{today.getFullYear() % 4 === 0 ? 366 : 365}</span> */}
                            </Badge>
                        );
                    }
                })}
            </div>

            <div className="flex w-full max-w-[90%] flex-col items-start justify-center gap-2 pt-4 md:items-center">
                {peopleOfToday.data.userList
                    .filter((user) => peopleOfToday.data.hasFilledMap[user.id] && peopleOfToday.data.metadataMap[user.id].day_public_note)
                    .map((user, index) => {
                        return (
                            <div key={index} className="flex items-center justify-center px-4 py-1 text-sm md:text-xl">
                                <Badge
                                    variant={'outline'}
                                    className="mr-2 text-sm md:text-xl"
                                    style={{ color: peopleOfToday.data.metadataMap[user.id].day_color }}
                                >
                                    {user.display_name}
                                </Badge>
                                {peopleOfToday.data.metadataMap[user.id].day_public_note}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
