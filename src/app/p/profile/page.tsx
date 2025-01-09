'use client';

import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { profileSettingsSchema } from '@/lib/type-definitions/settings';
import { useAuthStore } from '@/store/auth';
import { useState } from 'react';
import { toast } from 'sonner';
import { HexColorPicker } from 'react-colorful';
import { setGlobalAccentColor } from '@/lib/color';

export default function ProfilePage() {
    const { user, updateProfile } = useAuthStore();

    const [errorMsg, setErrorMsg] = useState('');
    const [accentColor, setAccentColorGlob] = useState(user?.accent_color || '#000000');

    if (!user) return null;

    async function onSave(formData: FormData) {
        const supabase = createClient();

        const validatedFields = profileSettingsSchema.pick({ display_name: true, accent_color: true }).safeParse({
            display_name: formData.get('display_name'),
            accent_color: formData.get('accent_color')
        });

        // If validation fails, return an error message
        if (!validatedFields.success) {
            return {
                message: Object.values(validatedFields.error.flatten().fieldErrors).flat().join(', ')
            };
        }

        if (Object.keys(validatedFields.data).length === 0) return;

        if (validatedFields.data.display_name !== user?.display_name) {
            const { error } = await supabase.auth.updateUser({
                data: {
                    display_name: validatedFields.data.display_name
                }
            });

            if (error) {
                return {
                    message: error.message
                };
            }
        }

        const { error: dbError } = await supabase
            .from('users')
            .update({
                display_name: validatedFields.data.display_name,
                accent_color: validatedFields.data.accent_color
            })
            .eq('id', user!.id);

        if (dbError) {
            return {
                message: dbError.message
            };
        }
        updateProfile({
            ...validatedFields.data
        });
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                formData.set('accent_color', accentColor);
                setGlobalAccentColor(accentColor);
                onSave(formData).then((error) => {
                    if (error?.message) {
                        setErrorMsg(error.message);
                    } else {
                        toast.success('Updated successfully.');
                    }
                });
            }}
        >
            <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your profile info here.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex w-full flex-col gap-4">
                    <div className="flex w-full justify-start gap-8">
                        <div className="max-w-36">
                            <Label htmlFor="display_name">Display Name</Label>
                            <Input name="display_name" type="text" defaultValue={`${user.display_name}`} required />
                        </div>
                        <div className="max-w-36">
                            <Label htmlFor="avatar">Avatar</Label>
                            <Input name="avatar" type="file" disabled={true} />
                        </div>
                    </div>
                    <div className="flex w-full justify-start gap-8">
                        <div className="max-w-36">
                            <Label htmlFor="accent_color">Your Color</Label>
                            <HexColorPicker color={accentColor} onChange={setAccentColorGlob} />
                            {/* <Input name="accent_color" type="color" defaultValue={`${user.accent_color}`} required /> */}
                        </div>
                    </div>
                    {errorMsg && <div className="mt-2 rounded border border-red-500 bg-red-100 p-2 text-sm text-red-500">{errorMsg}</div>}
                </div>
            </CardContent>
            <CardFooter className="flex w-full justify-between gap-4">
                <Button className="" variant="secondary" type="reset">
                    Cancel
                </Button>
                <Button className="" type="submit">
                    Save
                </Button>
            </CardFooter>
        </form>
    );
}
