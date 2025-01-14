import CryptoJS from 'crypto-js';

const secretKey = process.env.NEXT_PUBLIC_CRYPTO_KEY ?? 'secret';

export class Security {
    public static encrypt(data: string) {
        return CryptoJS.AES.encrypt(data, secretKey).toString();
    }

    public static decrypt(encrypted_value: string) {
        const bytes = CryptoJS.AES.decrypt(encrypted_value, secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    public static encryptKeys<T extends Record<string, string | number>>(unEncryptedObject: T) {
        const encryptedObject: { [key: string]: string } = {};
        Object.keys(unEncryptedObject).forEach((key) => {
            let valueToEncrypt = unEncryptedObject[key];
            if (typeof valueToEncrypt === 'number') {
                valueToEncrypt = `--number--${valueToEncrypt}`;
            }
            encryptedObject[key] = this.encrypt(valueToEncrypt);
        });
        return encryptedObject;
    }

    public static decryptedKeys<T extends Record<string, string>>(encryptedObject: T) {
        const decryptedObject: { [key: string]: string | number } = {};
        Object.keys(encryptedObject).forEach((key) => {
            let decryptedValue: string | number = this.decrypt(encryptedObject[key]);
            if (decryptedValue.startsWith('--number--')) {
                decryptedValue = decryptedValue.split('--number--')[1];
                decryptedValue = Number(decryptedValue);
            }
            decryptedObject[key] = decryptedValue;
        });
        return decryptedObject;
    }
}
