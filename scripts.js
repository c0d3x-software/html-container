import fs from 'fs';

const [type, version] = process.argv.slice(2);

if (type == 'build') {
   console.log('bulding...\n')

   await Bun.$`mkdir -p ./package`
   await Bun.$`rm -rf tsconfig.tsbuildinfo`
   await Bun.$`tsc -p tsconfig.build.json`

   console.log('\n--- build with success! ---\n')
}

if (type == 'publish') {
   console.log(' --- publishing package --- \n')

   if (['minor', 'major', 'patch'].includes(version) == false)
      throw `It must be minor, major or patch, but receive '${version}'`

   await Bun.$`bun update`
   await Bun.$`bun run build`
   await Bun.$`npm version ${version}`
   await Bun.$`npm publish --access public`
}