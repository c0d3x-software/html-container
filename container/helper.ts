import '../polyfills'

export function getStackDirectories() {
   const regex = /at[^\(]+\((.+[\/\\][^\:]+)[\/\\]\w+\.\w+/gmi
   const stack = new Error().stack || ''
   const paths = stack.findAll(regex)

   return [... new Set(paths.map(x => x.first))]
}