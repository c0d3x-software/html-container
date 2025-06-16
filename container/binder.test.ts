import { expect, test } from "bun:test"
import { interpolate } from "./binder";
import { pretest } from "../tests";

// test('get interpolations', async function () {
//    const { outer, inner } = await pretest()
//    const resulted = await getBindings(inner)

//    expect(resulted[0]).toEqual({ key: 'title', get: '${ title }' })
//    expect(resulted[1]).toEqual({ key: 'subtitle', get: '${ subtitle }' })
//    expect(resulted[2]).toEqual({ key: 'title', get: '${ title }' })
// })

// test('interpolate values', async function () {
//    const { outer, inner } = await pretest()
//    const context = { title:'My Title', subtitle: 'My Subtitle' }
//    const interpolateds = await getBindings(inner)
//    const resulted = await interpolate(inner, context, interpolateds)

//    expect(resulted).toInclude('<h1>My Title</h1>')
//    expect(resulted).toInclude('<h2>My Subtitle</h2>')
//    expect(resulted).toInclude('<title>My Title</title>')
// })