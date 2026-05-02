/**
 * analytics.ts — Firebase Analytics event tracking for ElectionWise.
 *
 * Wraps Firebase Analytics logEvent() in a safe, typed utility that gracefully
 * degrades if Analytics is unavailable (e.g., blocked by ad-blockers or
 * during SSR). All events are also mirrored to Cloud Firestore for richer
 * server-side analysis.
 *
 * Google Services used:
 *  - Firebase Analytics (GA4 event pipeline)
 *  - Cloud Firestore (event persistence for BigQuery export)
 */
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import app, { db } from './firebase';

export type AnalyticsEventName =
  | 'page_view'
  | 'ai_query'
  | 'fact_check'
  | 'language_change'
  | 'state_change'
  | 'readiness_task_toggle'
  | 'share_response';

export interface AnalyticsEventParams {
  page?: string;
  mode?: 'assistant' | 'simulation' | 'detector';
  language?: string;
  state?: string;
  verdict?: 'True' | 'False' | 'Misleading' | 'Error';
  task_id?: string;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Logs a typed analytics event to both Firebase Analytics (GA4) and
 * Cloud Firestore for persistence and BigQuery export capability.
 *
 * @param eventName - The name of the event to log
 * @param params - Optional structured parameters for the event
 */
export async function logAnalyticsEvent(
  eventName: AnalyticsEventName,
  params: AnalyticsEventParams = {}
): Promise<void> {
  try {
    // 1. Firebase Analytics (GA4) — only if supported by the browser
    const supported = await isSupported();
    if (supported) {
      const analytics = getAnalytics(app);
      logEvent(analytics, eventName as string, params);
    }

    // 2. Firestore — persist for BigQuery / server-side analytics pipeline
    await addDoc(collection(db, 'analytics_events'), {
      event: eventName,
      params,
      timestamp: serverTimestamp(),
      session: typeof window !== 'undefined'
        ? (sessionStorage.getItem('ew_session_id') ?? 'anonymous')
        : 'server',
    });
  } catch {
    // Analytics failures must never disrupt the user experience
    // Silent fail — events are non-critical telemetry
  }
}
