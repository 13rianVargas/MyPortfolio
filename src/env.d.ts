/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

declare module 'astro:i18n' {
    export function getRelativeLocaleUrl(locale: string, path?: string, options?: Record<string, any>): string;
    export function getAbsoluteLocaleUrl(locale: string, path?: string, options?: Record<string, any>): string;
    export function getLocaleByPath(path: string): string;
}
