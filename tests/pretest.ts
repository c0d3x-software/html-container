import fs from 'fs/promises'
import { JSDOM } from "jsdom";

export async function pretest() {
   const outer = await fs.readFile('./tests/index.html', 'utf-8')
   const inner = await fs.readFile('./tests/template.html', 'utf-8')
   
   return { outer, inner }
}

export function postest(outer: string, inner: string) {
   const { head, body } = new JSDOM(outer).window.document 
   const root = body.querySelector('#root') as HTMLElement
   
   root.innerHTML = inner
   root.innerHTML = root.children[0].innerHTML

   return { head, root, body } as {
      head: HTMLElement,
      root: HTMLElement,
      body: HTMLElement
   }
}

