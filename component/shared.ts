export interface ParseInfo {
   tag: string
   text: string
   props: object
}

export type Render = (html: string, self: object) => Promise<string>