'use client';

import { useRef, useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { createClient } from '@/lib/supabase/client';
import { DayDataSchema } from '@/lib/type-definitions/dayData';
import { useAppInfo } from '@/store/appInfo';
import { useRouter } from 'next/navigation';
import { Slider } from '../ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { listOfEmojis } from '@/lib/emojis';

async function addDayData(day_int: number, userId: string, formData: FormData) {
    const supabase = createClient();

    const metadata: { [key: string]: unknown } = {};

    for (const [key, value] of formData.entries()) {
        if (!key.startsWith('$')) {
            metadata[key] = value;
        }
    }

    const validatedFields = DayDataSchema.safeParse({
        day_int: day_int,
        metadata,
        user_id: userId
    });

    if (!validatedFields.success) {
        return {
            message: Object.values(validatedFields.error.flatten().fieldErrors).flat().join(', ')
        };
    }

    const { data, error } = await supabase.from('day_data').insert(validatedFields.data);

    if (error) {
        return {
            message: error.message
        };
    }
}

export default function DayForm(props: { dayInt: number; userId: string; accent_color: string }) {
    const { dayInt, userId, accent_color } = props;
    const [errorMsg, setErrorMsg] = useState('');

    const { setHasFilledDayForm } = useAppInfo();
    const router = useRouter();

    const [hasSubmitted, setHasSubmitted] = useState(false);

    const [rating, setRating] = useState(7);
    const [emoji, setEmoji] = useState('😄');

    return (
        <>
            <div className="text-sm italic">Note: All fields are optional. You can fill as much as you want.</div>
            <form
                className="my-4 w-full"
                onSubmit={(e) => {
                    e.preventDefault();
                    setHasSubmitted(true);
                    const formData = new FormData(e.target as HTMLFormElement);
                    formData.append('day_emoji', emoji);
                    addDayData(dayInt, userId, formData).then((error) => {
                        if (error?.message) {
                            setErrorMsg(error.message);
                            setHasSubmitted(false);
                        } else {
                            setHasFilledDayForm(true);
                            router.refresh();
                        }
                    });
                }}
            >
                <div className="grid w-full grid-cols-8 flex-col gap-x-4 gap-y-6">
                    {/* <div className='w-full flex gap-4'> */}
                    <Card className="col-span-6">
                        <CardHeader className="pb-0 pt-6">
                            <CardTitle>
                                <Label htmlFor="day_score" className="text-md">
                                    Rate your day out of 10.
                                </Label>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-6 pt-0">
                            <div className="flex w-full flex-col gap-2">
                                {/* <Input className="text-md" name="day_score" type="number" placeholder="7" min={-1} max={11} step={0.5} /> */}
                                <div className="flex w-full gap-2">
                                    <Slider
                                        className="text-md cursor-pointer"
                                        name="day_score"
                                        defaultValue={[rating]}
                                        max={11}
                                        min={-1}
                                        step={0.5}
                                        onValueChange={(v) => {
                                            setRating(v[0]);
                                        }}
                                        accent_color={accent_color}
                                    />
                                    <div className="min-w-8 text-end">{rating}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="col-span-2 flex items-center justify-center">
                        <CardContent className="p-0">
                            <Dialog>
                                <DialogTrigger>
                                    <div className="flex cursor-pointer items-center justify-center text-3xl">{emoji}</div>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle className="pb-2 text-2xl">Emote your day! {emoji}</DialogTitle>
                                        <DialogDescription className="flex flex-wrap">
                                            {listOfEmojis.map((emoji, i) => (
                                                <Button
                                                    variant={'ghost'}
                                                    key={i}
                                                    className="cursor-pointer p-0 text-3xl"
                                                    onClick={() => setEmoji(emoji)}
                                                >
                                                    {emoji}
                                                </Button>
                                            ))}
                                        </DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>

                    <div className="col-span-8 flex w-full flex-col gap-2">
                        <Label className="text-md" htmlFor="day_word">
                            Describe today in short.
                        </Label>
                        <Input className="text-md" name="day_word" type="text" placeholder="Average" />
                    </div>
                    <div className="col-span-8 flex w-full flex-col gap-2">
                        <Label className="text-md" htmlFor="day_color">
                            Assign a color for today.
                        </Label>
                        <Input className="text-md" name="day_color" type="color" />
                    </div>
                    <div className="col-span-8 flex w-full flex-col gap-2">
                        <Label className="text-md" htmlFor="day_person">
                            A person to remember for today.
                        </Label>
                        <Input className="text-md px-2 py-1" name="day_person" />
                    </div>
                    <div className="col-span-8 flex w-full flex-col gap-2">
                        <Label htmlFor="day_note" className="text-md">
                            Write a note about today.
                        </Label>
                        <Textarea className="text-md px-2 py-1" name="day_note" placeholder="Today was a good day." />
                    </div>

                    <Button type="submit" disabled={hasSubmitted} className="text-md col-span-8 w-full rounded p-2">
                        Submit
                    </Button>
                    {errorMsg && <div className="mt-2 rounded border border-red-500 bg-red-100 p-2 text-sm text-red-500">{errorMsg}</div>}
                </div>
            </form>
        </>
    );
}
