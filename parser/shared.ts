import { Render } from "../component"

export type HTMLString = `<${string}>${string}</${string}>`
   
export interface HTML {
   body: HTMLElement
   head: HTMLElement
   root: HTMLElement
}