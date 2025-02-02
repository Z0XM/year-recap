'use client';

import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '../ui/loadingSpinner';
import { SecurityClient } from '@/lib/encryption';
import { useAppInfo } from '@/store/appInfo';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';

const fetchPeopleOfToday = async ({ dayInt }: { dayInt: number }) => {
    const supabase = createClient();

    const userList = await supabase.from('users').select('id, display_name, accent_color').eq('isActive', true).limit(100);

    if (userList.error || !userList.data) {
        return { isError: true as const, errorMessage: userList.error.message };
    }

    const hasFilledFormList = await supabase
        .from('day_data')
        .select(
            `
            user_id,
            metadata->day_color,
            metadata->day_emoji,
            metadata->day_public_note
        `
        )
        .eq('day_int', dayInt);

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
            day_color: userData.day_color as string,
            day_emoji: userData.day_emoji as string,
            day_public_note: userData.day_public_note as string
            // day_drawing: userData.day_drawing as string
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

const fetchDrawingsOfToday = async ({ dayInt }: { dayInt: number }) => {
    const supabase = createClient();

    const drawings = await supabase
        .from('day_data')
        .select(
            `
            user_id,
            metadata->day_drawing
        `
        )
        .eq('day_int', dayInt);

    if (drawings.error || !drawings.data) {
        return { isError: true as const, errorMessage: drawings.error.message };
    }

    const drawingMap: { [key: string]: any } = {};

    const decryptedMetadata = await SecurityClient.decryptMultipleKeys(
        drawings.data.map((userData) => ({
            day_drawing: userData.day_drawing as string
        }))
    );

    drawings.data.map((userData, index) => {
        drawingMap[userData.user_id] = decryptedMetadata[index];
    });

    return {
        isError: false as const,
        data: {
            drawingMap
        }
    };
};

export default function PeopleOfToday() {
    const { dayInt } = useAppInfo();

    // const [peopleOfToday, setPeopleOfToday] = useState<
    //     | { hasLoaded: false }
    //     | { hasLoaded: true; isError: true; errorMessage: string }
    //     | {
    //           hasLoaded: true;
    //           isError: false;
    //           data: {
    //               userList: {
    //                   id: string;
    //                   display_name: string;
    //                   accent_color: string;
    //               }[];
    //               hasFilledMap: { [key: string]: boolean };
    //               metadataMap: { [key: string]: any };
    //           };
    //       }
    // >({
    //     hasLoaded: false
    // });

    // useEffect(() => {
    //     fetchPeopleOfToday({ dayInt }).then((res) => {
    //         setPeopleOfToday({ hasLoaded: true, ...res });
    //     });
    // }, [dayInt]);

    const peopleMetadataQuery = useQuery({
        queryKey: ['people-day-metadata', dayInt],
        queryFn: () => fetchPeopleOfToday({ dayInt }),
        staleTime: 1000 * 60 * 5
    });

    const peopleDrawingQuery = useQuery({
        queryKey: ['people-day-drawings', dayInt],
        queryFn: () => fetchDrawingsOfToday({ dayInt }),
        staleTime: 1000 * 60 * 5
    });

    // if (!peopleOfToday.hasLoaded) {
    //     return <LoadingSpinner />;
    // }

    // if (peopleOfToday.isError) {
    //     return <div>Something Went Wrong!</div>;
    // }

    return (
        <div className="flex flex-col items-center">
            <div className="flex max-w-[90%] flex-row flex-wrap justify-center gap-4 pt-4 text-center">
                {!peopleMetadataQuery.data && <LoadingSpinner />}
                {peopleMetadataQuery.data?.data &&
                    peopleMetadataQuery.data.data.userList.map((user, index) => {
                        if (peopleMetadataQuery.data.data!.hasFilledMap[user.id]) {
                            return (
                                <Badge
                                    key={index}
                                    // style={{ borderColor: user.accent_color }}
                                    variant={'outline'}
                                    className="border-green-500 px-4 py-1 text-sm md:text-xl"
                                >
                                    <div className="flex">
                                        <span
                                            className="mr-2"
                                            style={{ color: peopleMetadataQuery.data.data!.metadataMap[user.id].day_color }}
                                        >
                                            {user.display_name}
                                        </span>
                                        {/* {dayCountMap[user.id] ?? 0}🔥 */}
                                        {peopleMetadataQuery.data.data!.metadataMap[user.id].day_emoji}
                                    </div>
                                    {/* <span className="text-sm text-gray-800">/{today.getFullYear() % 4 === 0 ? 366 : 365}</span> */}
                                </Badge>
                            );
                        } else {
                            return (
                                <Badge key={index} variant={'outline'} className="text-sm md:text-xl">
                                    {user.display_name}
                                    {/* {dayCountMap[user.id] ?? 0}🔥 */}
                                    {/* <span className="text-sm text-gray-300">/{today.getFullYear() % 4 === 0 ? 366 : 365}</span> */}
                                </Badge>
                            );
                        }
                    })}
            </div>

            <div className="mt-4 flex w-full max-w-[90%] flex-col items-start justify-center gap-2 pt-4 md:items-center">
                {peopleMetadataQuery.data?.data &&
                    peopleMetadataQuery.data
                        .data!.userList.filter(
                            (user) =>
                                peopleMetadataQuery.data.data!.hasFilledMap[user.id] &&
                                peopleMetadataQuery.data.data!.metadataMap[user.id].day_public_note
                        )
                        .map((user, index) => {
                            return (
                                <div key={index} className="flex items-center justify-center px-4 py-1 text-sm md:text-xl">
                                    <Badge
                                        variant={'outline'}
                                        className="mr-2 text-sm md:text-xl"
                                        style={{ color: peopleMetadataQuery.data.data!.metadataMap[user.id].day_color }}
                                    >
                                        {user.display_name}
                                    </Badge>
                                    {peopleMetadataQuery.data.data!.metadataMap[user.id].day_public_note}
                                </div>
                            );
                        })}
            </div>
            {!peopleDrawingQuery.data && <LoadingSpinner />}
            {peopleDrawingQuery.data?.data && (
                <div className="relative flex w-full max-w-[90%] flex-wrap items-center justify-center gap-2">
                    {Object.keys(peopleDrawingQuery.data.data.drawingMap).map((userId, index) => {
                        return (
                            <div key={index} className="flex max-w-[150px] items-center justify-center sm:max-w-[300px]">
                                <Image
                                    width={300}
                                    height={300 * 0.6}
                                    // key={index}
                                    src={peopleDrawingQuery.data.data!.drawingMap[userId].day_drawing}
                                    alt=""
                                />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
