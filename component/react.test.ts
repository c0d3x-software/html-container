import { expect, test } from "bun:test";
import { reactRender } from "./react";
import { postest, pretest } from "../tests";
import { Sample } from "../tests";

test('react rendering', async function () {
   const { outer, inner } = await pretest()
   const contexts = { Sample, obj: { ok:true } }
   const resulted = await reactRender(inner, contexts)
   const html = postest(outer, resulted)
   const ul = html.body.querySelector('ul') as HTMLElement
   let id = 0

   // console.log(ul?.outerHTML.decodeHTML(true))

   expect(ul.children[id++].innerHTML).toBe('array: [1,2,3]')
   expect(ul.children[id++].innerHTML).toBe('object: {"name":"john","age":30}')
   expect(ul.children[id++].innerHTML).toBe('string: "ok"')
   expect(ul.children[id++].innerHTML).toBe('number: 1')
   expect(ul.children[id++].innerHTML).toBe('boolean: true')
   expect(ul.children[id++].innerHTML).toBe('reference: {"ok":true}')
})