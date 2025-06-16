import fs from 'fs/promises'
import { DOM } from '../commander';

export async function pretest() {
   const outer = await fs.readFile('./tests/index.html', 'utf-8')
   const inner = await fs.readFile('./tests/template.html', 'utf-8')
   
   return { outer, inner }
}

export async function postest(outer: string, inner: string) {   
   const { head, body } = (await DOM.intantiate(outer)).document 
   const root = body.querySelector('#root') as HTMLElement
   
   root.innerHTML = inner
   root.innerHTML = root.children[0].innerHTML

   return { head, root, body } as {
      head: HTMLElement,
      root: HTMLElement,
      body: HTMLElement
   }
}

