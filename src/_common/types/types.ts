export interface IObject { [key: string]: any }

export interface Dictionary {
    [key: string]: string
}

type Impossible<K extends keyof any> = {
    [P in K]: never;
};
// Необходимо получить T (показывает лишние поля в U).Не глубока сверка(один уровень). Так как ts допускает лишние поля при проверке типа
//TODO подумать как сделать глубокое сравнение
export type NoExtraProperties<T, U> = U & Impossible<Exclude<keyof U, keyof T>>;