import { expect, test } from "bun:test"
import { pretest } from "../tests";
import { interpolateHTML } from "./merger";

test('mergin HTML', async function () {
   const { outer, inner } = await pretest()

   const resulted = await interpolateHTML(inner)

   expect(resulted).toInclude('<h3>layout HTML</h3>')
})