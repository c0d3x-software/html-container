import { Render } from "../component"

export type HTMLString = `<${string}>${string}</${string}>`
   
export interface HTML {
   body: HTMLElement
   head: HTMLElement
   root: HTMLElement
}

export class DOM {
   private constructor(public document: HTMLDocument) {}

   public static async intantiate(html: string) {
      if (globalThis?.window?.document) 
         return new DOM(window.document)

      const JSDOM = await import('jsdom').then(x => x.JSDOM)
      const document = new JSDOM(html).window.document

      return new DOM(document)
   }
}

export function sleep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
 }