'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SecurityClient } from '@/lib/encryption';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/auth';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Link from 'next/link';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import Image from 'next/image';
import { LoadingSpinner } from '../ui/loadingSpinner';

const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

const chartConfig = {
    desktop: {
        label: 'Desktop',
        color: 'hsl(var(--primary))'
    }
} satisfies ChartConfig;

export function PrivateMonthDashboard() {
    const supabase = createClient();
    const { user } = useAuthStore();

    const today = new Date(new Date().getTime() - 12 * 60 * 60 * 1000);

    const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());
    const [shareColor, setShareColor] = useState(false);
    const [shareEmotions, setShareEmotions] = useState(false);
    const [shareScores, setShareScores] = useState(false);
    const [shareDrawings, setShareDrawings] = useState(false);

    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month, 0).getDate();
    };

    const daysInSelectedMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1).getDay();

    const userMonthQuery = useQuery({
        queryKey: ['user-month', selectedMonth, selectedYear],
        queryFn: async () => {
            const selectedMonthInt = selectedYear * 10000 + selectedMonth * 100;
            const selectedRange = [selectedMonthInt, selectedMonthInt + 99];
            const dayDataArray = await supabase
                .from('day_data')
                .select(
                    `
                    metadata->day_color, 
                    metadata->day_emoji,
                    metadata->day_score, 
                    day_int, 
                    user_id
                `
                )
                .eq('user_id', user!.id)
                .lte('day_int', selectedRange[1])
                .gte('day_int', selectedRange[0])
                .order('day_int', { ascending: true });

            if (dayDataArray.error || !dayDataArray.data) {
                throw dayDataArray.error;
            }

            const decryptedMetadataArray = await SecurityClient.decryptMultipleKeys(
                dayDataArray.data.map((userData) => ({
                    day_color: userData.day_color as string,
                    day_score: userData.day_score as string,
                    day_emoji: userData.day_emoji as string
                }))
            );

            dayDataArray.data.forEach((userData, index) => {
                userData.day_color = decryptedMetadataArray[index].day_color;
                userData.day_score = decryptedMetadataArray[index].day_score;
                userData.day_emoji = decryptedMetadataArray[index].day_emoji;
            });
            return dayDataArray.data;
        },
        staleTime: Infinity
    });

    const userMonthDrawingQuery = useQuery({
        queryKey: ['user-month-drawing', selectedMonth, selectedYear],
        queryFn: async () => {
            const selectedMonthInt = selectedYear * 10000 + selectedMonth * 100;
            const selectedRange = [selectedMonthInt, selectedMonthInt + 99];
            const dayDataArray = await supabase
                .from('day_data')
                .select(
                    `
                    metadata->day_drawing, 
                    day_int, 
                    user_id
                `
                )
                .eq('user_id', user!.id)
                .lte('day_int', selectedRange[1])
                .gte('day_int', selectedRange[0])
                .order('day_int', { ascending: true });

            if (dayDataArray.error || !dayDataArray.data) {
                throw dayDataArray.error;
            }

            const decryptedMetadataArray = await SecurityClient.decryptMultipleKeys(
                dayDataArray.data.map((userData) => ({
                    day_drawing: userData.day_drawing as string
                }))
            );

            dayDataArray.data.forEach((userData, index) => {
                userData.day_drawing = decryptedMetadataArray[index].day_drawing;
            });
            return dayDataArray.data;
        },
        staleTime: Infinity
    });

    // useEffect(() => {
    //     const fetchAccess = async () => {
    //         const dashboardShares = await supabase
    //             .from('dashboard_shares')
    //             .select('access')
    //             .eq('user_id', user!.id)
    //             .eq('month', selectedMonth)
    //             .eq('year', selectedYear);

    //         if (dashboardShares.error || !dashboardShares.data) {
    //             throw dashboardShares.error;
    //         }

    //         if (dashboardShares.data.length === 0) {
    //             setShareColor(false);
    //             setShareEmotions(false);
    //             setShareScores(false);
    //             setShareDrawings(false);
    //             return;
    //         }
    //         const allAccessString = dashboardShares.data.map((x) => x.access).join(':');

    //         setShareColor(allAccessString.includes('--color--'));
    //         setShareEmotions(allAccessString.includes('--emoji--'));
    //         setShareScores(allAccessString.includes('--score--'));
    //         setShareDrawings(allAccessString.includes('--drawing--'));
    //     };
    //     fetchAccess().then().catch(console.error);
    // }, []);

    const handleAccessChange = async ({ access, value }: { access: string; value: boolean }) => {
        if (value) await supabase.from('dashboard_shares').insert({ user_id: user!.id, month: selectedMonth, year: selectedYear, access });
        else
            await supabase
                .from('dashboard_shares')
                .delete()
                .eq('user_id', user!.id)
                .eq('month', selectedMonth)
                .eq('year', selectedYear)
                .eq('access', access);
    };

    const dayIntDataMap: { [key: string]: any } = {};
    userMonthQuery.data?.forEach((dayData) => {
        dayIntDataMap[dayData.day_int] = dayData;
    });

    return (
        <div className="flex flex-col items-center justify-center">
            <Select onValueChange={(v) => setSelectedMonth(parseInt(v))} defaultValue={selectedMonth.toString()}>
                <SelectTrigger className="my-4 w-[180px]">
                    <SelectValue className="pt-6 text-3xl" placeholder="Select a Month" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="1">January</SelectItem>
                    <SelectItem value="2">February</SelectItem>
                    <SelectItem value="3">March</SelectItem>
                    <SelectItem value="4">April</SelectItem>
                    <SelectItem value="5">May</SelectItem>
                    <SelectItem value="6">June</SelectItem>
                </SelectContent>
            </Select>
            <div>
                <Link href={'/p/dashboard/public'} className="underline hover:text-primary">
                    View Public Dashboard
                </Link>
            </div>
            <div className="m-8 grid grid-cols-1 items-center justify-center gap-4 lg:grid-cols-2">
                <Card className="w-fit">
                    <CardHeader>
                        <CardTitle>Calendar of Colors</CardTitle>
                        <CardDescription className="flex items-center justify-start gap-2">
                            {/* <Switch
                                name="share_color"
                                checked={shareColor}
                                onCheckedChange={(newValue) => {
                                    setShareColor(newValue);
                                    handleAccessChange({ access: '--color--', value: newValue })
                                        .then(() => {
                                            toast.success('Updated public access');
                                        })
                                        .catch((error) => {
                                            console.error(error);
                                            toast.error('Failed to update access');
                                        });
                                }}
                            />
                            <Label htmlFor="share_color">{shareColor ? 'Shared To Everyone' : 'Not Shared'}</Label> */}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid w-fit grid-cols-7 gap-2">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                                <div key={'colors' + day + index} className="flex h-8 w-8 items-center justify-center">
                                    {day}
                                </div>
                            ))}
                            {Array.from({ length: daysInSelectedMonth + firstDayOfMonth - 1 }).map((_, index) => {
                                const dayNumber = index - (firstDayOfMonth - 1) + 1;
                                if (dayNumber <= 0) {
                                    return <div key={'colors' + dayNumber} className="h-8 w-8"></div>;
                                }
                                return (
                                    <TooltipProvider key={'colors' + dayNumber}>
                                        <Tooltip>
                                            <TooltipTrigger className="h-8 w-8 cursor-pointer">
                                                <div
                                                    style={{
                                                        backgroundColor:
                                                            dayIntDataMap[selectedYear * 10000 + selectedMonth * 100 + dayNumber]
                                                                ?.day_color ?? 'a1a1a1',
                                                        border: dayIntDataMap[selectedYear * 10000 + selectedMonth * 100 + dayNumber]
                                                            ? 'none'
                                                            : '1px dashed black'
                                                    }}
                                                    className="h-8 w-8 rounded-sm duration-300"
                                                ></div>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-white">{dayNumber}</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
                <Card className="w-fit">
                    <CardHeader>
                        <CardTitle>Calendar of Emotions</CardTitle>
                        <CardDescription className="flex items-center justify-start gap-2">
                            {/* <Switch
                                name="share_emoji"
                                checked={shareEmotions}
                                onCheckedChange={(newValue) => {
                                    setShareEmotions(newValue);
                                    handleAccessChange({ access: '--emoji--', value: newValue })
                                        .then(() => {
                                            toast.success('Updated public access');
                                        })
                                        .catch((error) => {
                                            console.error(error);
                                            toast.error('Failed to update access');
                                        });
                                }}
                            />
                            <Label htmlFor="share_emoji">{shareEmotions ? 'Shared To Everyone' : 'Not Shared'}</Label> */}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid w-fit grid-cols-7 gap-2">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                                <div key={'emoji' + day + index} className="flex h-8 w-8 items-center justify-center">
                                    {day}
                                </div>
                            ))}
                            {Array.from({ length: daysInSelectedMonth + firstDayOfMonth - 1 }).map((_, index) => {
                                const dayNumber = index - (firstDayOfMonth - 1) + 1;
                                if (dayNumber <= 0) {
                                    return <div key={'emoji' + dayNumber} className="h-8 w-8"></div>;
                                }
                                return (
                                    <TooltipProvider key={'emoji' + dayNumber}>
                                        <Tooltip>
                                            <TooltipTrigger className="h-8 w-8 cursor-pointer">
                                                <div
                                                    style={{
                                                        border: dayIntDataMap[selectedYear * 10000 + selectedMonth * 100 + dayNumber]
                                                            ?.day_emoji
                                                            ? 'none'
                                                            : '1px dashed black'
                                                    }}
                                                    className="h-8 w-8 rounded-sm text-2xl duration-300"
                                                >
                                                    {dayIntDataMap[selectedYear * 10000 + selectedMonth * 100 + dayNumber]?.day_emoji ?? ''}
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-white">{dayNumber}</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>How were your days ?</CardTitle>
                        <CardDescription className="flex items-center justify-start gap-2">
                            {/* <Switch
                                name="share_score"
                                checked={shareScores}
                                onCheckedChange={(newValue) => {
                                    setShareScores(newValue);
                                    handleAccessChange({ access: '--score--', value: newValue })
                                        .then(() => {
                                            toast.success('Updated public access');
                                        })
                                        .catch((error) => {
                                            console.error(error);
                                            toast.error('Failed to update access');
                                        });
                                }}
                            />
                            <Label htmlFor="share_score">{shareScores ? 'Shared To Everyone' : 'Not Shared'}</Label> */}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig}>
                            <AreaChart
                                accessibilityLayer
                                data={
                                    userMonthQuery.data
                                        ? userMonthQuery.data.map((x) => ({ day: x.day_int % 100, score: x.day_score }))
                                        : []
                                }
                                margin={{
                                    left: 12,
                                    right: 12
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" hideLabel />} />
                                <Area
                                    dataKey="score"
                                    type="natural"
                                    fill="var(--color-desktop)"
                                    fillOpacity={0.4}
                                    stroke="var(--color-desktop)"
                                    dot={{ fill: 'var(--color-desktop)', r: 2 }}
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
            {userMonthDrawingQuery.isLoading && (
                <div className="p-4">
                    <LoadingSpinner />
                </div>
            )}
            {userMonthDrawingQuery.data?.length && (
                <div className="relative flex w-full max-w-[90%] flex-wrap items-center justify-center gap-2">
                    {userMonthDrawingQuery.data
                        .filter((x) => x.day_drawing)
                        .sort((a, b) => a.day_int - b.day_int)
                        .map((data, index) => {
                            return (
                                <div key={index} className="flex max-w-[150px] items-center justify-center sm:max-w-[300px]">
                                    <Image
                                        width={300}
                                        height={300 * 0.6}
                                        // key={index}
                                        src={data.day_drawing as string}
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
