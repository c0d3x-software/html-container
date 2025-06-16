export interface Interpolation {
   key: string
   get: string
}

export interface Interpolate extends Interpolation {
   set: any
}

export interface AttributeInfo {
   name: string
   data: string
   type: string
}

export function tryParse(value: string) {
   try { return JSON.parse(value) }
   catch { return undefined }
}

export function tryEval(value: string) {
   try { return eval(`(${value})`) }
   catch { return undefined }
}

export interface VTAG {
   inner: string
   outer: string
   props: object
   binds: string[]
}
export interface VDOM {
   [key: string]: VTAG
}
