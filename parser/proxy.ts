import { Interpolation } from "../container"

type Callback = (field: string) => void

export function proxify(reference: object, callback: Callback) {
   return new Proxy(reference, {
      get: (refer, field) => {
         return refer[field]
      },

      set: (refer, field, value) => {
         refer[field] = value

         if (field == 'children') return true
         if (typeof field == "symbol") return true
         if (typeof value == "function") return true
         
         callback(field)

         return true
      }
   })
}