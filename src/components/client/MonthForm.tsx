'use client';

import { useEffect, useState } from 'react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { createClient } from '@/lib/supabase/client';
import { MonthDataSchema } from '@/lib/type-definitions/dayData';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { SecurityClient } from '@/lib/encryption';

function formDataToJSON(formData: FormData) {
    const metadata: { [key: string]: unknown } = {};

    for (const [key, value] of formData.entries()) {
        if (!key.startsWith('$')) {
            metadata[key] = value;
        }
    }

    return metadata;
}

async function addMonthData(month_int: number, userId: string, formData: FormData) {
    const supabase = createClient();

    const metadata = formDataToJSON(formData);

    const validatedFields = MonthDataSchema.safeParse({
        month_int: month_int,
        metadata,
        user_id: userId
    });

    if (!validatedFields.success) {
        return {
            message: Object.values(validatedFields.error.flatten().fieldErrors).flat().join(', ')
        };
    }

    const existingData = await supabase.from('month_data').select('id').eq('month_int', month_int).eq('user_id', userId);

    if (existingData.error) {
        return {
            message: existingData.error.message
        };
    }

    const encryptedMetadata = await SecurityClient.encryptKeys(validatedFields.data.metadata);
    if (existingData.data.length > 0) {
        const { error } = await supabase
            .from('month_data')
            .update({ ...validatedFields.data, metadata: encryptedMetadata })
            .eq('id', existingData.data[0].id);

        if (error) {
            return {
                message: error.message
            };
        }
    } else {
        const { error } = await supabase.from('month_data').insert({ ...validatedFields.data, metadata: encryptedMetadata });

        if (error) {
            return {
                message: error.message
            };
        }
    }
}

export default function MonthForm(props: { dayInt: number; userId: string }) {
    const { dayInt, userId } = props;
    const monthInt = Math.floor(dayInt / 100);

    const [errorMsg, setErrorMsg] = useState('');

    const router = useRouter();

    const [hasSubmitted, setHasSubmitted] = useState(false);

    const defaultValues = {
        month_bad: '',
        month_good: '',
        month_next_hopes: ''
    };

    const [monthGood, setMonthGood] = useState(defaultValues.month_good);
    const [monthBad, setMonthBad] = useState(defaultValues.month_bad);
    const [monthNextHopes, setMonthNextHopes] = useState(defaultValues.month_next_hopes);

    const supabase = createClient();

    useEffect(() => {
        const fetchExistingData = async () => {
            const existingMonthData = await supabase.from('month_data').select('metadata').eq('month_int', monthInt).eq('user_id', userId);
            if (existingMonthData.error) {
                console.log('Error fetching existing month data', existingMonthData.error.message);
                return;
            }
            if (existingMonthData.data.length > 0) {
                const decryptedMetadata = await SecurityClient.decryptKeys(existingMonthData.data[0].metadata);
                setMonthGood(decryptedMetadata.month_good as string);
                setMonthBad(decryptedMetadata.month_bad as string);
                setMonthNextHopes(decryptedMetadata.month_next_hopes as string);
            }
        };

        fetchExistingData();
    }, []);

    return (
        <>
            <div className="text-sm italic">Note: All fields are optional. You can fill as much as you want.</div>
            <form
                className="my-4 w-full"
                onSubmit={(e) => {
                    e.preventDefault();
                    setHasSubmitted(true);
                    const formData = new FormData(e.target as HTMLFormElement);
                    addMonthData(monthInt, userId, formData).then((error) => {
                        if (error?.message) {
                            setErrorMsg(error.message);
                            setHasSubmitted(false);
                        } else {
                            console.log('Day data added successfully');
                            toast.success('Submitted successfully');
                            router.push('/p');
                        }
                    });
                }}
            >
                <div className="grid w-full grid-cols-8 flex-col gap-x-4 gap-y-4">
                    <div className="col-span-8 flex w-full flex-col gap-2">
                        <Textarea
                            className="text-md px-2 py-1"
                            name="month_good"
                            placeholder="What went well this month?"
                            defaultValue={monthGood}
                        />
                    </div>
                    <div className="col-span-8 flex w-full flex-col gap-2">
                        <Textarea
                            className="text-md px-2 py-1"
                            name="month_bad"
                            placeholder="What went bad this month?"
                            defaultValue={monthBad}
                        />
                    </div>
                    <div className="col-span-8 flex w-full flex-col gap-2">
                        <Textarea
                            className="text-md px-2 py-1"
                            name="month_next_hopes"
                            placeholder="What are your hopes for next month?"
                            defaultValue={monthNextHopes}
                        />
                    </div>
                    {/* <div className="col-span-8 flex items-center justify-center gap-4">
                        <Label htmlFor="day_photo" className="w-full">
                            Photo of the your day
                        </Label>
                        <Input name="day_photo" id="day_photo" accept="image/*" type="file" className="cursor-pointer" />
                    </div> */}
                    <Button type="submit" disabled={hasSubmitted} className="text-md col-span-8 w-full rounded p-2">
                        Submit
                    </Button>
                    {errorMsg && <div className="mt-2 rounded border border-red-500 bg-red-100 p-2 text-sm text-red-500">{errorMsg}</div>}
                </div>
            </form>
        </>
    );
}
