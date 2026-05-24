# Lamatic MCP Server

## Requirements

- Node.js v16 or higher
- npm v7 or higher
- Claude Desktop app

---

## Installation

```
git clone <your-repo-url>
cd DevMCP
npm install
```

---

## Testing with MCP Inspector

### Step 1 — Start the server
```
node server.js
```

Should print:
```
Lamatic MCP Server running...
```

### Step 2 — Open Inspector
```
npx @modelcontextprotocol/inspector node server.js
```

### Step 3 — Connect
- Open the URL shown in terminal (e.g. `http://localhost:6274`)
- Click **Connect**
- All tools will appear on the left side

### Step 4 — Test auth_login first
- Click `auth_login`
- Click **Add pair** and add:

| Key | Value |
|---|---|
| apiKey | your-org-api-key |
| orgId | your-org-id |
| userId | your-user-id |

- Click **Run Tool**
- Should return `Authenticated successfully!`

### Step 5 — Test other tools
After authenticating, test the remaining tools in this order:

| Tool | Required Input |
|---|---|
| `create_project` | `name`, `region` |
| `get_project` | `projectId` |
| `create_flow` | `projectId`, `name` |
| `get_flows` | `projectId` |
| `deploy_project` | `projectId` |

---

## Available Tools

| Tool | Description |
|---|---|
| `auth_login` | Authenticate with your Lamatic API key |
| `create_project` | Create a new Lamatic project |
| `get_project` | Fetch details of an existing project |
| `create_flow` | Create a new flow in a project |
| `get_flows` | List all flows in a project |
| `deploy_project` | Trigger a deployment for a project |

---

## Available Regions

| Region |
|---|
| `us-east-1` |
| `us-west-2` |
| `eu-west-1` | 
| `ap-south-1` |

---

## Project Structure

```
DevMCP/
├── utils/
│   ├── api.js
│   └── config.js
├── server.js
├── package.json
└── node_modules/
```


## Support

- Documentation: [lamatic.ai/docs](https://lamatic.ai/docs)
