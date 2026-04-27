const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { z } = require('zod');
const { createProject, createFlow, triggerDeployment, getProject, getFlows } = require('./utils/api');
const { getConfig, saveConfig } = require('./utils/config');

const server = new McpServer({
  name: 'lamatic',
  version: '1.0.0',
});

server.tool('auth_login', 'Authenticate with Lamatic', {
  apiKey: z.string(),
  orgId: z.string(),
  userId: z.string(),
}, async ({ apiKey, orgId, userId }) => {
  saveConfig({ apiKey, orgId, userId });
  return { content: [{ type: 'text', text: `Authenticated successfully! Org ID: ${orgId}` }] };
});

server.tool('create_project', 'Create a new Lamatic project', {
  name: z.string(),
  region: z.enum(['us-east-1', 'us-west-2', 'eu-west-1', 'ap-south-1']),
}, async ({ name, region }) => {
  const config = getConfig();
  if (!config?.apiKey) return { content: [{ type: 'text', text: 'Error: Not authenticated.' }] };
  try {
    const project = await createProject({ orgId: config.orgId, name, region, userId: config.userId });
    return { content: [{ type: 'text', text: `Project created!\n- ID: ${project.id}\n- Slug: ${project.slug}\n- Status: ${project.status}` }] };
  } catch (err) {
    return { content: [{ type: 'text', text: `Error: ${err.response?.data?.message || err.message}` }] };
  }
});

server.tool('get_project', 'Get details of a Lamatic project', {
  projectId: z.string(),
}, async ({ projectId }) => {
  const config = getConfig();
  if (!config?.apiKey) return { content: [{ type: 'text', text: 'Error: Not authenticated.' }] };
  try {
    const project = await getProject({ orgId: config.orgId, projectId });
    return { content: [{ type: 'text', text: `Project found!\n- ID: ${project.id}\n- Name: ${project.name}\n- Status: ${project.status}\n- Region: ${project.location}\n- Endpoint: ${project.endpoint}` }] };
  } catch (err) {
    return { content: [{ type: 'text', text: `Error: ${err.response?.data?.message || err.message}` }] };
  }
});

server.tool('create_flow', 'Create a new flow in a Lamatic project', {
  projectId: z.string(),
  name: z.string(),
}, async ({ projectId, name }) => {
  const config = getConfig();
  if (!config?.apiKey) return { content: [{ type: 'text', text: 'Error: Not authenticated.' }] };
  try {
    const result = await createFlow({ orgId: config.orgId, projectId, name });
    return { content: [{ type: 'text', text: `Flow created!\n- ID: ${result.id}\n- Name: ${result.name}\n- Status: ${result.status}` }] };
  } catch (err) {
    return { content: [{ type: 'text', text: `Error: ${err.response?.data?.message || err.message}` }] };
  }
});

server.tool('get_flows', 'List all flows in a Lamatic project', {
  projectId: z.string(),
}, async ({ projectId }) => {
  const config = getConfig();
  if (!config?.apiKey) return { content: [{ type: 'text', text: 'Error: Not authenticated.' }] };
  try {
    const data = await getFlows({ orgId: config.orgId, projectId });
    const flows = data.flows || [];
    if (flows.length === 0) return { content: [{ type: 'text', text: 'No flows found.' }] };
    const flowList = flows.map((f) => `- ${f.name} (ID: ${f.id}, Status: ${f.status})`).join('\n');
    return { content: [{ type: 'text', text: `Flows:\n\n${flowList}` }] };
  } catch (err) {
    return { content: [{ type: 'text', text: `Error: ${err.response?.data?.message || err.message}` }] };
  }
});

server.tool('deploy_project', 'Deploy a Lamatic project', {
  projectId: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
}, async ({ projectId, name, description }) => {
  const config = getConfig();
  if (!config?.apiKey) return { content: [{ type: 'text', text: 'Error: Not authenticated.' }] };
  try {
    const result = await triggerDeployment({
      orgId: config.orgId,
      projectId,
      name: name || 'Deployment',
      description: description || 'Triggered from Lamatic MCP',
      userId: config.userId,
    });
    return { content: [{ type: 'text', text: `Deployment triggered!\n\n${JSON.stringify(result, null, 2)}` }] };
  } catch (err) {
    return { content: [{ type: 'text', text: `Error: ${err.response?.data?.message || err.message}` }] };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Lamatic MCP Server running...');
}

main().catch(console.error);