import CryptoJS from 'crypto-js';

const secretKey = () => {
    const key = process.env.CRYPTO_KEY;
    if (!key) throw 'Encryption Key not found';
    return key;
};
export class SecurityServer {
    static encrypt(data: string) {
        return CryptoJS.AES.encrypt(data, secretKey()).toString();
    }

    static decrypt(encrypted_value: string) {
        if (!encrypted_value) return '';
        const bytes = CryptoJS.AES.decrypt(encrypted_value, secretKey());
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    public static encryptKeys<T extends Record<string, string | number>>(
        unEncryptedObject: T
    ): {
        [key: string]: string;
    } {
        const encryptedObject: { [key: string]: string } = {};
        Object.keys(unEncryptedObject).forEach((key) => {
            let valueToEncrypt = unEncryptedObject[key];
            if (typeof valueToEncrypt === 'number') {
                valueToEncrypt = `--number--${valueToEncrypt}`;
            }
            encryptedObject[key] = SecurityServer.encrypt(valueToEncrypt);
        });
        return encryptedObject;
    }

    public static decryptKeys<T extends Record<string, string>>(
        encryptedObject: T
    ): {
        [key: string]: string | number;
    } {
        const decryptedObject: { [key: string]: string | number } = {};
        Object.keys(encryptedObject).forEach((key) => {
            let decryptedValue: string | number = SecurityServer.decrypt(encryptedObject[key]);
            if (decryptedValue.startsWith('--number--')) {
                decryptedValue = decryptedValue.split('--number--')[1];
                decryptedValue = Number(decryptedValue);
            }
            decryptedObject[key] = decryptedValue;
        });
        return decryptedObject;
    }
}

export class SecurityClient {
    public static async encryptKeys<T extends Record<string, string | number>>(
        unEncryptedObject: T
    ): Promise<{
        [key: string]: string;
    }> {
        const res = await fetch('/api/db/encrypt', {
            method: 'POST',
            body: JSON.stringify(unEncryptedObject)
        });
        return (await res.json()).data;
    }

    public static async decryptKeys<T extends Record<string, string>>(
        encryptedObject: T
    ): Promise<{
        [key: string]: string | number;
    }> {
        const res = await fetch('/api/db/decrypt', {
            method: 'POST',
            body: JSON.stringify(encryptedObject)
        });
        return (await res.json()).data;
    }

    public static async decryptMultipleKeys<T extends Record<string, string>>(
        encryptedObjects: T[]
    ): Promise<
        {
            [key: string]: string | number;
        }[]
    > {
        const res = await fetch('/api/db/decrypt-bulk', {
            method: 'POST',
            body: JSON.stringify(encryptedObjects)
        });
        return (await res.json()).data;
    }
}
