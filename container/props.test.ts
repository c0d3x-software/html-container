import { expect, test } from "bun:test"
import { getProps } from "./props";

test('props binding', async function () {
   const attrs = `<Sample number=1 string="ok" boolean=true 
      array=[1,2,3] object={ name:'john', age:30 }
      reference=obj.value>`
   
   const resulted = getProps({ obj: { value: 333 } }, attrs) as any

   expect(resulted.array).toEqual([1, 2, 3])
   expect(resulted.number).toEqual(1)
   expect(resulted.string).toEqual('ok')
   expect(resulted.boolean).toEqual(true)
   expect(resulted.reference).toEqual(333)
   expect(resulted.object).toEqual({
      name: "john",
      age: 30,
    })
})