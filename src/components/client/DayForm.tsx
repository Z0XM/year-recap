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
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '../ui/dialog';
import { listOfEmojis } from '@/lib/emojis';
import { HexColorPicker } from 'react-colorful';
import { toast } from 'sonner';
import { SecurityClient } from '@/lib/encryption';
import { Canvas } from './Canvas';

function formDataToJSON(formData: FormData) {
    const metadata: { [key: string]: unknown } = {};

    for (const [key, value] of formData.entries()) {
        if (!key.startsWith('$')) {
            metadata[key] = value;
        }
    }

    return metadata;
}

async function addDayData(day_int: number, userId: string, formData: FormData) {
    const supabase = createClient();

    const metadata = formDataToJSON(formData);

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

    const existingData = await supabase.from('day_data').select('id').eq('day_int', day_int).eq('user_id', userId);

    if (existingData.error) {
        return {
            message: existingData.error.message
        };
    }

    const encryptedMetadata = await SecurityClient.encryptKeys(validatedFields.data.metadata);
    if (existingData.data.length > 0) {
        const { error } = await supabase
            .from('day_data')
            .update({ ...validatedFields.data, metadata: encryptedMetadata })
            .eq('id', existingData.data[0].id);

        if (error) {
            return {
                message: error.message
            };
        }
    } else {
        const { error } = await supabase.from('day_data').insert({ ...validatedFields.data, metadata: encryptedMetadata });

        if (error) {
            return {
                message: error.message
            };
        }
    }
}

export default function DayForm(props: { dayInt: number; userId: string; initialValues: { [key: string]: any } }) {
    const { dayInt, userId } = props;
    const [errorMsg, setErrorMsg] = useState('');

    const { setHasFilledDayForm, setDayMetadata } = useAppInfo();
    const router = useRouter();

    const [hasSubmitted, setHasSubmitted] = useState(false);

    const defaultValues = {
        day_score: 7,
        day_emoji: '😄',
        day_color: '#a1a1a1',
        day_note: '',
        day_person: '',
        day_word: '',
        day_public_note: '',
        day_drawing: ''
    };

    const getMetadata = (key: keyof typeof defaultValues) => {
        if (props.initialValues[key] === undefined || props.initialValues[key] === null) {
            return defaultValues[key];
        }
        return props.initialValues[key];
    };

    const [dayRating, setDayRating] = useState(getMetadata('day_score'));
    const [dayEmoji, setDayEmoji] = useState(getMetadata('day_emoji'));
    const [dayColor, setDayColor] = useState(getMetadata('day_color'));

    const [initialDrawing, _] = useState(getMetadata('day_drawing'));

    const [dayDrawingFunction, setDayDrawingFunction] = useState<() => string>(() => () => initialDrawing);

    return (
        <>
            {/* <div className="text-sm italic">Note: All fields are optional. You can fill as much as you want.</div> */}
            <form
                className="w-full"
                onSubmit={(e) => {
                    e.preventDefault();
                    // setHasSubmitted(true);
                    const formData = new FormData(e.target as HTMLFormElement);
                    formData.append('day_emoji', dayEmoji);
                    formData.append('day_color', dayColor);

                    const currentDayDrawing = dayDrawingFunction();
                    formData.append('day_drawing', currentDayDrawing ? currentDayDrawing : initialDrawing);
                    addDayData(dayInt, userId, formData).then((error) => {
                        if (error?.message) {
                            setErrorMsg(error.message);
                            setHasSubmitted(false);
                        } else {
                            console.log('Day data added successfully');
                            toast.success('Submitted successfully');
                            setHasFilledDayForm(true);
                            setDayMetadata(formDataToJSON(formData));
                            router.push('/p');
                        }
                    });
                }}
            >
                <div className="grid w-full grid-cols-8 flex-col gap-x-4 gap-y-4">
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
                                <div className="flex w-full gap-2">
                                    <Slider
                                        className="text-md cursor-pointer"
                                        name="day_score"
                                        defaultValue={[dayRating]}
                                        max={11}
                                        min={-1}
                                        step={0.5}
                                        onValueChange={(v) => {
                                            setDayRating(v[0]);
                                        }}
                                        // accent_color={accent_color}
                                    />
                                    <div className="min-w-8 text-end">{dayRating}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="col-span-2 flex items-center justify-center">
                        <CardContent className="p-0">
                            <Dialog>
                                <DialogTrigger>
                                    <div className="flex animate-bounce cursor-pointer items-center justify-center text-3xl">
                                        {dayEmoji}
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="flex flex-col items-center justify-center">
                                    <DialogHeader>
                                        <DialogTitle className="pb-2 text-2xl">Emote your day! {dayEmoji}</DialogTitle>
                                        <DialogDescription className="flex flex-wrap">
                                            {listOfEmojis.map((emoji, i) => (
                                                <Button
                                                    variant={'ghost'}
                                                    key={i}
                                                    className="cursor-pointer p-0 text-3xl"
                                                    onClick={() => setDayEmoji(emoji)}
                                                >
                                                    {emoji}
                                                </Button>
                                            ))}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className="sm:justify-start">
                                        <DialogClose asChild>
                                            <Button type="button" variant="secondary">
                                                Done!
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                    <Card className="col-span-8">
                        <CardContent className="pt-6">
                            <div className="flex w-full flex-col gap-2">
                                <Input
                                    className="text-md"
                                    name="day_word"
                                    type="text"
                                    maxLength={64}
                                    placeholder="Describe today in short."
                                    defaultValue={getMetadata('day_word')}
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="col-span-2 flex items-center justify-center">
                        <CardContent className="p-0">
                            <Dialog>
                                <DialogTrigger className="flex items-center justify-center">
                                    <div style={{ backgroundColor: dayColor }} className="h-[35px] w-[35px] rounded-full"></div>
                                </DialogTrigger>
                                <DialogContent className="flex flex-col items-center justify-center">
                                    <DialogHeader>
                                        <DialogTitle className="pb-2 text-2xl">Color your day!</DialogTitle>
                                    </DialogHeader>
                                    <HexColorPicker color={dayColor} onChange={setDayColor} />
                                    <DialogFooter className="sm:justify-start">
                                        <DialogClose asChild>
                                            <Button type="button" variant="secondary">
                                                Done!
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                    <Card className="col-span-6">
                        <CardContent className="pt-6">
                            <div className="flex w-full flex-col gap-2">
                                <Input
                                    className="text-md"
                                    name="day_person"
                                    type="text"
                                    maxLength={64}
                                    placeholder="A person to remember."
                                    defaultValue={getMetadata('day_person')}
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <div className="col-span-8 flex w-full flex-col gap-2">
                        <Textarea
                            className="text-md px-2 py-1"
                            name="day_note"
                            placeholder="Write a note about today."
                            defaultValue={getMetadata('day_note')}
                        />
                    </div>
                    <div className="col-span-8 flex w-full flex-col gap-2">
                        <Input
                            className="text-md px-2 py-1"
                            name="day_public_note"
                            placeholder="Write a public note."
                            type="text"
                            maxLength={120}
                            defaultValue={getMetadata('day_public_note')}
                        />
                    </div>
                    <Canvas setDayDrawingFunction={setDayDrawingFunction} initialDrawing={initialDrawing} />
                    <Button type="submit" disabled={hasSubmitted} className="text-md col-span-8 w-full rounded p-2">
                        Submit
                    </Button>
                    {errorMsg && <div className="mt-2 rounded border border-red-500 bg-red-100 p-2 text-sm text-red-500">{errorMsg}</div>}
                </div>
            </form>
        </>
    );
}
