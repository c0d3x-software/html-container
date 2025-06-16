import { expect, test } from "bun:test";
import { postest, pretest } from "../tests";
import { parser } from "./parser";

test('metatag transfers...', async function () {
   const { outer, inner } = await pretest()
   
   const resulted = await parser("#root")
      .template(outer, inner)
      .generate('tests/')
   
   const html = postest(outer, resulted)
   
   expect(html.body.innerHTML.includes('<meta')).not.toBeTrue()
   expect(html.head.innerHTML.includes('<meta')).toBeTrue()
})