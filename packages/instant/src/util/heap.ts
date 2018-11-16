import { ObjectMap } from '@0x/types';
import { logUtils } from '@0x/utils';

import { ANALYTICS_ENABLED, HEAP_ANALYTICS_DEVELOPMENT_APP_ID, HEAP_ANALYTICS_PRODUCTION_APP_ID } from '../constants';

import { AnalyticsEventOptions, AnalyticsUserOptions } from './analytics';

export interface HeapAnalytics {
    loaded: boolean;
    appid: string;
    identify(id: string, idType: string): void;
    track(eventName: string, eventProperties?: ObjectMap<string | number>): void;
    resetIdentity(): void;
    addUserProperties(properties: AnalyticsUserOptions): void;
    addEventProperties(properties: AnalyticsEventOptions): void;
    removeEventProperty(property: string): void;
    clearEventProperties(): void;
}
interface ModifiedWindow {
    heap?: HeapAnalytics;
    zeroExInstantLoadedHeap?: boolean;
}
const getWindow = (): ModifiedWindow => {
    return window as ModifiedWindow;
};

const getHeapAppId = (): string => {
    if (process.env.NODE_ENV === 'production') {
        return HEAP_ANALYTICS_PRODUCTION_APP_ID;
    }
    return HEAP_ANALYTICS_DEVELOPMENT_APP_ID;
};

const setupZeroExInstantHeap = () => {
    const curWindow = getWindow();
    // Set property to specify that this is zeroEx's heap
    curWindow.zeroExInstantLoadedHeap = true;

    // Typescript-compatible version of https://docs.heapanalytics.com/docs/installation
    /* tslint:disable */
    ((window as any).heap = (window as any).heap || []),
        ((window as any).heap.load = function(e: any, t: any) {
            ((window as any).heap.appid = e), ((window as any).heap.config = t = t || {});
            var r = t.forceSSL || 'https:' === (document.location as Location).protocol,
                a = document.createElement('script');
            (a.type = 'text/javascript'),
                (a.async = !0),
                (a.src = (r ? 'https:' : 'http:') + '//cdn.heapanalytics.com/js/heap-' + e + '.js');
            var n = document.getElementsByTagName('script')[0];
            (n.parentNode as Node).insertBefore(a, n);
            for (
                var o = function(e: any) {
                        return function() {
                            (window as any).heap.push([e].concat(Array.prototype.slice.call(arguments, 0)));
                        };
                    },
                    p = [
                        'addEventProperties',
                        'addUserProperties',
                        'clearEventProperties',
                        'identify',
                        'resetIdentity',
                        'removeEventProperty',
                        'setEventProperties',
                        'track',
                        'unsetEventProperty',
                    ],
                    c = 0;
                c < p.length;
                c++
            )
                (window as any).heap[p[c]] = o(p[c]);
        });
    // TODO: use production heap id once environment utils merged
    (window as any).heap.load(getHeapAppId());
    /* tslint:enable */

    return curWindow.heap as HeapAnalytics;
};

export const heapUtil = {
    getHeap: (): HeapAnalytics | null => {
        const curWindow = getWindow();
        const hasOtherExistingHeapIntegration = curWindow.heap && !curWindow.zeroExInstantLoadedHeap;
        if (hasOtherExistingHeapIntegration) {
            return null;
        }

        const zeroExInstantHeapIntegration = curWindow.zeroExInstantLoadedHeap && curWindow.heap;
        if (zeroExInstantHeapIntegration) {
            return zeroExInstantHeapIntegration;
        }

        return setupZeroExInstantHeap();
    },
    evaluateHeapCall: (heapFunctionCall: (heap: HeapAnalytics) => void): void => {
        if (!ANALYTICS_ENABLED) {
            return;
        }

        const curHeap = heapUtil.getHeap();
        if (curHeap) {
            try {
                if (curHeap.appid !== getHeapAppId()) {
                    // Integrator has included heap after us and reset the app id
                    return;
                }
                heapFunctionCall(curHeap);
            } catch (e) {
                // We never want analytics to crash our React component
                // TODO: error reporter here
                logUtils.log('Analytics error', e);
            }
        }
    },
};