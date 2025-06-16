declare global {
   interface ObjectConstructor {
      get(that: object, path: string)
   }
}

Object.get = function (that: object, path: string) {
   if (!path) return undefined

   const [name, next] = path.split('.')

   return name && next ? Object.get(that[name], next)
      : name ? that[name]
         : undefined
}

export {}