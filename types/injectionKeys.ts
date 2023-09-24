export type Holiday = { date: Date; name: string };

export const holidayKey = Symbol("holiday") as InjectionKey<Holiday[]>;
