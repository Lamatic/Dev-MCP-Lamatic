const axios = require('axios');
const { getConfig } = require('./config');
const { de } = require('zod/v4/locales');

const BASE_URL = 'https://enterprise-api.edge.lamatic.tech/v1';

function getHeaders() {
  const config = getConfig();
  if (!config || !config.apiKey) {
    throw new Error('Not authenticated.');
  }
  return {
    Authorization: `Bearer ${config.apiKey}`,
    'Content-Type': 'application/json',
  };
}


async function createProject({ orgId, name, region, userId }) {
  if (!orgId) throw new Error('Organization ID is required. Use --org-id or set it during auth login.');

  const res = await axios.post(
    `${BASE_URL}/organizations/${orgId}/project/create`,
    { name, region, userId },
    { headers: getHeaders() }
  );

  return res.data;
}

async function createFlow({ orgId, projectId, name }) {
  const res = await axios.post(
    `${BASE_URL}/organizations/${orgId}/project/${projectId}/flows/create`,
    {
      name,
      nodes: [
        {
          id: 'triggerNode_1',
          data: {
            nodeId: 'apiNode',
            values: {
              id: 'triggerNode_1',
              nodeName: 'API Trigger',
            },
            trigger: true,
          },
          type: 'triggerNode',
          position: {
            x: 225,
            y: 0,
          },
          measured: {
            width: 216,
            height: 93,
          },
        },
      ],
      edges: [],
    },
    { headers: getHeaders() }
  );
  return res.data;
}

async function triggerDeployment({ orgId, projectId, name, description, userId }) {
  const res = await axios.post(
    `${BASE_URL}/organizations/${orgId}/project/${projectId}/deployments/trigger`,
    {
      name: name || 'Deployment',
      description: description || 'Triggered from Lamatic CLI',
      userId: userId,
    },
    { headers: getHeaders() }
  );
  return res.data;
}

async function getProject({ orgId, projectId }) {
  const res = await axios.get(
    `${BASE_URL}/organizations/${orgId}/project/${projectId}`,
    { headers: getHeaders() }
  );
  return res.data;
}

async function getFlows({ orgId, projectId }) {
  const res = await axios.get(
    `${BASE_URL}/organizations/${orgId}/project/${projectId}/flows`,
    { headers: getHeaders() }
  );
  return res.data;
}

async function getFlowDetail({ orgId, projectId, flowId }) {
  const res = await axios.get(
    `${BASE_URL}/organizations/${orgId}/project/${projectId}/flows/${flowId}`,
    { headers: getHeaders() }
  );
  return res.data;
}

async function listProjects({ orgId }) {
  const res = await axios.get(
    `${BASE_URL}/organizations/${orgId}/projects`,
    { headers: getHeaders() }
  );
  return res.data;
}

async function updateProject({ orgId, projectId, name }) {
  const res = await axios.post(
    `${BASE_URL}/organizations/${orgId}/project/${projectId}/update`,
    { name },
    { headers: getHeaders() }
  );
  return res.data;
}

async function deleteProject({ orgId, projectId, userId }) {
  const res = await axios.delete(
    `${BASE_URL}/organizations/${orgId}/project/delete`,
    {
      headers: getHeaders(),
      data: { projectId, userId },
    }
  );
  return res.data;
}

async function updateFlow(projectId, flowId, nodes, edges, status = 'active') {
  const { apiKey, orgId } = getConfig();
  const response = await axios.post(
    `https://enterprise-api.edge.lamatic.tech/v1/organizations/${orgId}/project/${projectId}/flows/update`,
    { nodes, edges, flowId, status },
    {
      headers: { Authorization: `Bearer ${apiKey}` }
    }
  );
  return response.data;
}

async function deleteFlow(projectId, flowId) {
  const { apiKey, orgId } = getConfig();
  const response = await axios.delete(
    `https://enterprise-api.edge.lamatic.tech/v1/organizations/${orgId}/project/${projectId}/flows/delete`,
    {
      headers: { Authorization: `Bearer ${apiKey}` },
      data: { flowId }
    }
  );
  return response.data;
}

async function listAllFlows(projectId) {
  const { apiKey, orgId } = getConfig();
  const response = await axios.get(
    `https://enterprise-api.edge.lamatic.tech/v1/organizations/${orgId}/project/${projectId}/flows`,
    {
      headers: { Authorization: `Bearer ${apiKey}` }
    }
  );
  return response.data;
}

async function renameFlow(projectId, flowId, name) {
  const { apiKey, orgId } = getConfig();
  const url = `https://enterprise-api.edge.lamatic.tech/v1/organizations/${orgId}/project/${projectId}/flows/rename`;
  console.error('URL:', url);
  console.error('Body:', { flowId, name });
  const response = await axios.post(
    url,
    { flowId, name },
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );
  return response.data;
}

async function updateFlowStatus(projectId, flowId, status) {
  const { apiKey, orgId } = getConfig();
  const response = await axios.post(
    `https://enterprise-api.edge.lamatic.tech/v1/organizations/${orgId}/project/${projectId}/flows/update-status`,
    { flowId, status },
    {
      headers: { Authorization: `Bearer ${apiKey}` }
    }
  );
  return response.data;
}

async function createContext(projectId, name, type) {
  const { apiKey, orgId } = getConfig();
  const response = await axios.post(
    `https://enterprise-api.edge.lamatic.tech/v1/organizations/${orgId}/project/${projectId}/context/create`,
    { name, type },
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );
  return response.data;
}

async function deleteContext(projectId, contextId) {
  const { apiKey, orgId } = getConfig();
  const response = await axios.delete(
    `https://enterprise-api.edge.lamatic.tech/v1/organizations/${orgId}/project/${projectId}/context/${contextId}`,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );
  return response.data;
}

async function getContext(projectId, contextId) {
  const { apiKey, orgId } = getConfig();
  const response = await axios.get(
    `https://enterprise-api.edge.lamatic.tech/v1/organizations/${orgId}/project/${projectId}/context/${contextId}`,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );
  return response.data;
}

async function getAllContexts(projectId) {
  const { apiKey, orgId } = getConfig();
  const response = await axios.get(
    `https://enterprise-api.edge.lamatic.tech/v1/organizations/${orgId}/project/${projectId}/context`,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );
  return response.data;
}

async function listAllDeployments(projectId) {
  const { apiKey, orgId } = getConfig();
  const response = await axios.get(
    `https://enterprise-api.edge.lamatic.tech/v1/organizations/${orgId}/project/${projectId}/deployments`,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );
  return response.data;
}

async function getDeployment(projectId, deploymentId) {
  const { apiKey, orgId } = getConfig();
  const response = await axios.get(
    `https://enterprise-api.edge.lamatic.tech/v1/organizations/${orgId}/project/${projectId}/deployments/${deploymentId}`,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );
  return response.data;
}

async function listModelCreds(projectId) {
  const { apiKey, orgId } = getConfig();
  const response = await axios.get(
    `https://enterprise-api.edge.lamatic.tech/v1/organizations/${orgId}/project/${projectId}/models`,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );
  return response.data;
}

async function listModelProviders(projectId, includeModels = false) {
  const { apiKey, orgId } = getConfig();
  const url = `https://enterprise-api.edge.lamatic.tech/v1/organizations/${orgId}/project/${projectId}/models/providers${includeModels ? '?includeModels=true' : ''}`;
  const response = await axios.get(url, { headers: { Authorization: `Bearer ${apiKey}` } });
  return response.data;
}

async function checkModelStatus(projectId, modelName) {
  const { apiKey, orgId } = getConfig();
  const response = await axios.get(
    `https://enterprise-api.edge.lamatic.tech/v1/organizations/${orgId}/project/${projectId}/models/status?modelName=${encodeURIComponent(modelName)}`,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );
  return response.data;
}

async function createModelCreds(projectId, name, provider, credentials) {
  const { apiKey, orgId } = getConfig();
  const response = await axios.post(
    `https://enterprise-api.edge.lamatic.tech/v1/organizations/${orgId}/project/${projectId}/models/create`,
    { name, provider, credentials },
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );
  return response.data;
}

async function listSupportedIntegrations(projectId) {
  const { apiKey, orgId } = getConfig();
  const response = await axios.get(
    `https://enterprise-api.edge.lamatic.tech/v1/organizations/${orgId}/project/${projectId}/integrations/supported`,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );
  return response.data;
}

async function listIntegrationCreds(projectId) {
  const { apiKey, orgId } = getConfig();
  const response = await axios.get(
    `https://enterprise-api.edge.lamatic.tech/v1/organizations/${orgId}/project/${projectId}/integrations`,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );
  return response.data;
}

async function createIntegrationCreds(projectId, name, integration, credentials) {
  const { apiKey, orgId } = getConfig();
  const response = await axios.post(
    `https://enterprise-api.edge.lamatic.tech/v1/organizations/${orgId}/project/${projectId}/integrations/create`,
    { name, integration, credentials },
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );
  return response.data;
}

async function getCredInfo(projectId, credentialId) {
  const { apiKey, orgId } = getConfig();
  const response = await axios.get(
    `https://enterprise-api.edge.lamatic.tech/v1/organizations/${orgId}/project/${projectId}/credentials/${credentialId}`,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );
  return response.data;
}

async function getOAuthUrl(projectId, nodeName, redirectUri, credentialName) {
  const { apiKey, orgId } = getConfig();
  const response = await axios.post(
    `https://enterprise-api.edge.lamatic.tech/v1/organizations/${orgId}/project/${projectId}/credentials/oauth/url`,
    { nodeName, redirect_uri: redirectUri, credentialName },
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );
  return response.data;
}

async function deleteCredential(projectId, credentialId) {
  const { apiKey, orgId } = getConfig();
  const response = await axios.delete(
    `https://enterprise-api.edge.lamatic.tech/v1/organizations/${orgId}/project/${projectId}/credentials/${credentialId}`,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );
  return response.data;
}

async function updateCredential(projectId, credentialId, credentials) {
  const { apiKey, orgId } = getConfig();
  const response = await axios.post(
    `https://enterprise-api.edge.lamatic.tech/v1/organizations/${orgId}/project/${projectId}/credentials/update`,
    { credentialId, credentials },
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );
  return response.data;
}

module.exports = { createProject, createFlow, triggerDeployment, getProject, getFlows, getFlowDetail, listProjects, updateProject, deleteProject, updateFlow, deleteFlow, listAllFlows, renameFlow, updateFlowStatus, createContext, deleteContext, getContext, getAllContexts, listAllDeployments, getDeployment, listModelCreds, listModelProviders, checkModelStatus, createModelCreds, listSupportedIntegrations , listIntegrationCreds, createIntegrationCreds , getCredInfo, getOAuthUrl, deleteCredential, updateCredential};