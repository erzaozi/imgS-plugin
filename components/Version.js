import fs from 'fs'
import {pluginRoot} from "../model/path.js";

let packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
let pluginPackageJson = JSON.parse(fs.readFileSync(`${pluginRoot}/package.json`,'utf8'))

const yunzaiVersion = packageJson.version
const pluginVersion = pluginPackageJson.version
const isMiao = packageJson.name === 'miao-yunzai'
const isTrss = Array.isArray(Bot.uin) ? true : false

let Version = {
  isMiao,
  isTrss,
  get plugin() {
    return pluginVersion
  },
  get yunzai() {
    return yunzaiVersion
  }
}

export default Version
