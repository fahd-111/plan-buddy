import Constants from 'expo-constants';
import { Platform } from 'react-native';

let BASE = 'http://192.168.1.5:8787'; 
if (Constants.expoConfig?.extra?.API_BASE_URL) {
    BASE = Constants.expoConfig.extra.API_BASE_URL;
} else if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    BASE = process.env.EXPO_PUBLIC_API_BASE_URL;
}

// Override for Android emulator
if (Platform.OS === 'android' && BASE.includes('localhost')) {
    BASE = BASE.replace('localhost', '10.0.2.2');
}

export async function createPlan(goal: string, timeHorizon: 'today' | 'week') {
    try {
        const url = `${BASE}/plan`;
        const body = { goal, timeHorizon };
        console.log('createPlan POST', url, body);
        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!resp.ok) {
            const errText = await resp.text().catch(() => '');
            let errObj: any = {};
            try { errObj = JSON.parse(errText); } catch (e) { }
            const message = errObj.error || errObj.message || errText || `HTTP ${resp.status}`;
            throw new Error(message);
        }

        const data = await resp.json().catch(() => null);
        if (!data) throw new Error('Empty/invalid JSON in response');
        return data;
    } catch (e: any) {
        console.error('createPlan error:', e);
        throw e;
    }
}
