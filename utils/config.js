const fs = require('fs-extra');
const path = require('path');
const os = require('os');

const CONFIG_DIR = path.join(os.homedir(), '.lamatic');
const CONFIG_PATH = path.join(CONFIG_DIR, 'config.json');

function saveConfig(data) {
  fs.ensureDirSync(CONFIG_DIR);
  fs.writeJsonSync(CONFIG_PATH, data, { spaces: 2 });
}

function getConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error('Not authenticated. Run: lamatic auth login --api-key <key> --org-id <id>');
  }

  const config = fs.readJsonSync(CONFIG_PATH);

  if (!config?.apiKey || !config?.orgId) {
    throw new Error('Not authenticated. Run: lamatic auth login --api-key <key> --org-id <id>');
  }

  return config;
}

function clearConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    fs.removeSync(CONFIG_PATH);
  }
}

module.exports = { saveConfig, getConfig, clearConfig };