import YAML from 'yaml'
import fs from 'fs'
import { pluginRoot } from '../model/path.js'

class Config {
  getConfig() {
    try {
      const config_data = YAML.parse(
        fs.readFileSync(`${pluginRoot}/config/config/config.yaml`, 'utf-8')
      )
      return config_data
    } catch (err) {
      logger.error('读取config.yaml失败', err)
      return false
    }
  }

  getDefConfig() {
    try {
      const config_default_data = YAML.parse(
        fs.readFileSync(`${pluginRoot}/config/config_default.yaml`, 'utf-8')
      )
      return config_default_data
    } catch (err) {
      logger.error('读取config_default.yaml失败', err)
      return false
    }
  }

  setConfig(config_data) {
    try {
      fs.writeFileSync(
        `${pluginRoot}/config/config/config.yaml`,
        YAML.stringify(config_data),
      )
      return true
    } catch (err) {
      logger.error('写入config.yaml失败', err)
      return false
    }
  }
}

export default new Config()
