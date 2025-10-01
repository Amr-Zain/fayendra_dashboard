// import Swal from "sweetalert2";
import Cookies from 'js-cookie';
import { CountryPhoneCodes } from './country-phone-code';
import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";
import { ColumnFiltersState } from '@tanstack/react-table';
import { useAuthStore } from '@/stores/authStore';
import { redirect } from '@tanstack/react-router'

export const isPathActive = (url: string, currentPath: string) => {
    if (url === '/' && currentPath === '/') return true
    if (url !== '/' && currentPath.startsWith(url)) return true
    return false
}
export const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
export const getAcceptTypes = (
    accept: string | undefined,
    type_file?: "image" | "document" | "media"
) => {
    if (accept) return accept;
    switch (type_file) {
        case "image":
            return "image/*";
        case "document":
            return ".pdf,.doc,.docx";
        case "media":
            return "image/*,video/*";
        default:
            return "*/*";
    }
};

export const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });



export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}



export const formatPhoneNumber = (phonecode: string, phone: string): string => {
    const dial_code =
        CountryPhoneCodes.find((country) => `+${phonecode}` == country.dial_code.toLowerCase())
            ?.dial_code || '';
    return `${dial_code}${phone}`;
};


// Check language entered in inputs
export const isArabic = (value: any) => /^[\u0600-\u06FF\s\d!@#$%^&*()_+=[\]{}|\\;:'",.<>?/-]+$/.test(value);
export const isEnglish = (value: any) => /^[A-Za-z\s\d!@#$%^&*()_+=[\]{}|\\;:'",.<>?/-]+$/.test(value);

export const logOut = () => {
    Cookies.remove('user_data');
    Cookies.remove('user');
    Cookies.remove('user_token');
    Cookies.remove('permissions');
};

export function generateInitialValues(data: any) {
    const initialValues: Record<string, any> = {};
    Object.keys(data || {}).forEach((key) => {
        if (key === 'ar' || key === 'en') {
            Object.keys(data[key]).forEach((subKey) => {
                initialValues[`${subKey}_ar`] = data?.ar[subKey] || '';
                initialValues[`${subKey}_en`] = data?.en[subKey] || '';
            });
        } else {
            initialValues[key] = data[key] || '';
        }
    });
    console.log("🚀 ~ generateInitialValues ~ initialValues:", initialValues)
    return initialValues;
}

export function generateFinalOut(initialValues: any, values: any) {
    const finalOut: any = {
        'image[media]': values?.image,
    };

    const languages = ['ar', 'en'];
    languages.forEach(lang => {
        finalOut[lang] = {};
        Object.keys(values).forEach((key) => {
            if (key.endsWith(`_${lang}`)) {
                const fieldName = key.replace(`_${lang}`, '');
                finalOut[lang][fieldName] = values[key];
            }
        });
    });

    // Handle non-languages like image[media] or any other key
    Object.keys(values).forEach((key) => {
        if (!key.endsWith('_ar') && !key.endsWith('_en')) {
            finalOut[key] = values[key];
        }
    });

    // Remove undefined keys dynamically
    Object.keys(finalOut).forEach((key) => {
        if (finalOut[key] === undefined || (typeof finalOut[key] === 'object' && Object.keys(finalOut[key]).length === 0)) {
            delete finalOut[key];
        }
    });

    delete finalOut.image;

    if (initialValues?.image === finalOut['image[media]']) {
        delete finalOut['image[media]'];
    }
    return finalOut
}

export const getSearchParamsObject = (searchParamsUrl: any) => {
    const paramsObj: Record<string, string> = {};
    searchParamsUrl.forEach((value: any, key: any) => {
        paramsObj[key] = value;
    });
    return paramsObj;
};
export const formDateToYYYYMMDD = (dateString: Date | string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const formattedMonth = month < 10 ? '0' + month : month;
    const formattedDay = day < 10 ? '0' + day : day;

    return `${year}-${formattedMonth}-${formattedDay}`;
}

export const serializeFilters = (filters: ColumnFiltersState): Record<string, string | string[]> => {
    const result: Record<string, string | string[]> = {};
    filters.forEach(filter => {
        if (Array.isArray(filter.value)) {
            result[filter.id] = filter.value;
        } else if (filter.value !== undefined && filter.value !== '') {
            result[filter.id] = String(filter.value);
        }
    });
    return result;
};

export const deserializeFilters = (filters: Record<string, string | string[]> = {}): ColumnFiltersState => {
    return Object.entries(filters).map(([id, value]) => ({
        id,
        value: Array.isArray(value) ? value : value,
    }));
};
export const checkPermission = (url: string) => {
    if (!hasPermission(url)) {
      throw redirect({
        to: '/',
      })
    }
}
export const hasPermission = (url: string) => useAuthStore.getState()?.user?.permission?.some(per => per.url === url)


