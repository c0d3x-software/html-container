import { expect, test } from "bun:test";
import './request'

test('request.match extension', async function () {
   const routing = 'http://www.api.com/route/subroute/1/true/ok'
   const pattern = '/route/subroute/:id/:ok/:text'
   const request = new Request(routing)
   const matchts = request.match(pattern)

   expect(matchts.params?.id).toBe(1)
   expect(matchts.params?.ok).toBe(true)
   expect(matchts.params?.text).toBe('ok')
})

test('request.resolve extension', async function () {
   const routing = 'http://www.api.com/route/subroute/1/true/ok'
   const pattern = '/route/subroute/:id/:ok/:text'
   const request = new Request(routing).resolve(pattern)

   console.log(request.url)
})