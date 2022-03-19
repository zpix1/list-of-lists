export const listNameValidation = (name: string) => /^[\wа-яА-Я ]{3,20}$/.test(name);

export const taskDescriptionValidation = (desc: string) => /^[\wа-яА-Я ]{3,60}$/.test(desc);