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

export interface VARG {
   field: string
   value: string
   refer: string
}

export interface VTAG {
   inner: string
   props: object
   attrs: VARG[]   
   binds: string[]
}
export interface VDOM {
   [key: string]: VTAG
}
