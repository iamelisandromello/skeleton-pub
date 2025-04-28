import { addAlias } from 'module-alias'
import { join } from 'node:path'

addAlias('@', join(__dirname, '/../../'))
