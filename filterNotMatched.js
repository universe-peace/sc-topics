const fs = require('fs').promises
const path = require('path')
const async = require('async')

const readFile = file => fs.readFile(file).then(data => data.toString()).then(JSON.parse)
const writeFile = (file, data) => fs.writeFile(file, JSON.stringify(data))

const main = async () => {
  const files = await readFile(path.resolve(__dirname, 'data.json'))
  const result = await async.mapLimit(files, 5, async file => {
    const exists = await fs.access(path.resolve(__dirname, 'topics', file.i + '.json'))
      .then(() => true)
      .catch(() => false)
    if (exists) return file
    console.log(file.i, file.t, 'lost')
    return {
      ...file,
      l: true,
    }
  })
  await writeFile(path.resolve(__dirname, 'data-filtered.json'), result)
  console.log('lost', result.filter(i => i.l).length, result.length)
}

main()
