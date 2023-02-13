const app = require("express")();
require("dotenv").config();
const { default: axios } = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const { AppMigration } = require("jira.js/out/version2");
const test_issue_key = "MS-1264";
const SUB_DOMAINS = {
  auth: "auth",
  api: "api",
};
const steps_to_reproduce_custom_field = "customfield_10444";
let access_token =
  "eyJraWQiOiJmZTM2ZThkMzZjMTA2N2RjYTgyNTg5MmEiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiI1NTIzMGZjMC02NzdkLTQzYjMtODFjMy1jZmNlMWRiZjk0YzgiLCJzdWIiOiI2MzM5M2JiNjA3YTI3ZWJlZmYxN2I3ZGMiLCJuYmYiOjE2NzYyNDU4ODMsImlzcyI6Imh0dHBzOi8vYXRsYXNzaWFuLWFjY291bnQtcHJvZC5wdXMyLmF1dGgwLmNvbS8iLCJpYXQiOjE2NzYyNDU4ODMsImV4cCI6MTY3NjI0OTQ4MywiYXVkIjoiYVQyaWlYVU9XQVp3SXFYUE4yNXViNlpRODBScnJpMDQiLCJodHRwczovL2lkLmF0bGFzc2lhbi5jb20vdWp0IjoiMGZjN2QyZGUtNWE3Yy00OTk2LWE4YmUtYzE2NGY0MjVhZDI2IiwiaHR0cHM6Ly9hdGxhc3NpYW4uY29tL29yZ0lkIjoiNDE4MDE0ZGMtOTZjNy00ZTU4LTljMmUtZmI0Y2ViOTVlNWEyIiwiaHR0cHM6Ly9pZC5hdGxhc3NpYW4uY29tL2F0bF90b2tlbl90eXBlIjoiQUNDRVNTIiwiaHR0cHM6Ly9hdGxhc3NpYW4uY29tL29hdXRoQ2xpZW50SWQiOiJhVDJpaVhVT1dBWndJcVhQTjI1dWI2WlE4MFJycmkwNCIsImh0dHBzOi8vaWQuYXRsYXNzaWFuLmNvbS9zZXNzaW9uX2lkIjoiMzU0ZGNjM2MtNTNiYy00Zjg1LWJjN2EtOTMzNjZjY2E2ODExIiwiaHR0cHM6Ly9hdGxhc3NpYW4uY29tL2ZpcnN0UGFydHkiOmZhbHNlLCJodHRwczovL2F0bGFzc2lhbi5jb20vc3lzdGVtQWNjb3VudEVtYWlsIjoiMmJjYmRmNmEtNGI3ZC00NWJhLTgzNjAtNTJkMmZiZjZlNjQ0QGNvbm5lY3QuYXRsYXNzaWFuLmNvbSIsImh0dHBzOi8vYXRsYXNzaWFuLmNvbS92ZXJpZmllZCI6dHJ1ZSwiY2xpZW50X2F1dGhfdHlwZSI6IlBPU1QiLCJodHRwczovL2F0bGFzc2lhbi5jb20vc3lzdGVtQWNjb3VudElkIjoiNjNkN2Q5MzU2MTRjYjRiYTUzZmRkNGE2IiwiaHR0cHM6Ly9hdGxhc3NpYW4uY29tL2VtYWlsRG9tYWluIjoid2F2ZXMuY29tIiwiaHR0cHM6Ly9hdGxhc3NpYW4uY29tLzNsbyI6dHJ1ZSwiaHR0cHM6Ly9pZC5hdGxhc3NpYW4uY29tL3ZlcmlmaWVkIjp0cnVlLCJzY29wZSI6InJlYWQ6aXNzdWU6amlyYS1zb2Z0d2FyZSB3cml0ZTplcGljOmppcmEtc29mdHdhcmUgcmVhZDpqaXJhLXdvcmsgd3JpdGU6YXR0YWNobWVudDpqaXJhIHJlYWQ6cHJvamVjdDpqaXJhIHJlYWQ6cHJvamVjdC1jYXRlZ29yeTpqaXJhIHJlYWQ6amlyYS11c2VyIHJlYWQ6YXR0YWNobWVudDpqaXJhIHdyaXRlOmF2YXRhcjpqaXJhIHdyaXRlOmlzc3VlOmppcmEgcmVhZDp1c2VyOmppcmEgcmVhZDplcGljOmppcmEtc29mdHdhcmUgcmVhZDphdmF0YXI6amlyYSB3cml0ZTpwcm9qZWN0LmF2YXRhcjpqaXJhIHJlYWQ6aXNzdWUtdHlwZTpqaXJhIHJlYWQ6aXNzdWU6amlyYSByZWFkOnByb2plY3QuYXZhdGFyOmppcmEiLCJodHRwczovL2F0bGFzc2lhbi5jb20vc3lzdGVtQWNjb3VudEVtYWlsRG9tYWluIjoiY29ubmVjdC5hdGxhc3NpYW4uY29tIiwiY2xpZW50X2lkIjoiYVQyaWlYVU9XQVp3SXFYUE4yNXViNlpRODBScnJpMDQifQ.Yn7nCrcFRr8foxgNJ6Vl6BFP5CVgHUM9LZq8McMSUNXi-c-N59DSwGLgfQxJB0roLYJEGwXlqOvPvu9MImzR0C8uVXzso4VfdRKOb9J0o6GI1NpEAdmE-8ufdHSPBkqa13UDJaZlIq7MRzMgjeXD2wkBHXOMz2LE-ECju3ObkxF4AjmZcdIGms8WRv54cVWrAOkOBrcumsk0rCxqIKUfMcb5sB5dRF3PkjgmsobLGZvg4VmW-ddaFqNSLqHXG7fml_9NFuxQvnUNszyBuuhghXlZzadYa72uYUcX_5r_UmesURpbj4RZ5UTECvH2MjqD24YQ9AGeX1TaPmYDSvErQA";
let cloud_id = "8c9183da-3903-430d-b2bd-06d82256bff1";

app.use(cors());
app.use(bodyParser.json());
const resources_route = "oauth/token/accessible-resources";
const jira_url = (type) => {
  return `https://${type}.atlassian.com/`;
};

[];

const jira_request_scopes = [
  "read:jira-work",
  "read:user:jira",
  "read:project:jira",
  "read:project-category:jira",
  "read:issue:jira",
  "read:issue-type:jira",
  "read:avatar:jira",
  "read:attachment:jira",
  "write:epic:jira-software",
  "read:project.avatar:jira",
  "read:issue:jira-software",
  "read:epic:jira-software",
  "write:project.avatar:jira",
  "write:issue:jira",
  "write:avatar:jira",
  "write:attachment:jira",
  "read:jira-user",
];

const auth_qs = `audience=api.atlassian.com&client_id=${
  process.env.JIRA_CLIENT_ID
}&scope=${jira_request_scopes.join(" ")}&redirect_uri=${
  process.env.CALLBACK_URL
}&state=idontknowhwatthisis&response_type=code&prompt=consent`;

auth_link = `${jira_url(SUB_DOMAINS.auth)}/authorize?${auth_qs}`;
console.log(auth_link);
app.get("/api/get_authentication_link", (req, res) => {
  return res.json(auth_link);
});

app.get("/api/get_authorization_code", async (req, res) => {
  const generate_access_token_path = jira_url("api") + "/oauth/token";

  const resp = await axios.post(generate_access_token_path, {
    grant_type: "authorization_code",
    client_id: process.env.JIRA_CLIENT_ID,
    client_secret: process.env.JIRA_CLIENT_SECRET,
    code: req.query.code,
    redirect_uri: process.env.CALLBACK_URL,
  });
  access_token = resp.data.access_token;
  console.log({ access_token });
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  axios
    .get(jira_url("api") + "/oauth/token/accessible-resources")
    .then((res) => {
      console.log(res.data);
      cloud_id = res.data[0].id;
    })
    .catch((err) => console.log(err));
  return res.json("ok");
});

app.get("/issuetypes", (req, res) => {
  axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
  const path =
    jira_url(SUB_DOMAINS.api) +
    `/ex/jira/${cloud_id}/rest/api/2/issue/createmeta?projectKeys=MS&expand=projects.issuetypes.fields`;

  axios
    .get(path)
    .then((resp) =>
      res.json(
        resp.data.projects[0].issuetypes.map((item) => ({
          name: item.name,
          id: item.id,
          icon: item.iconUrl,
        }))
      )
    )
    .catch((err) => console.log(err.response));
});

app.get("/issues", (req, res) => {
  const path =
    jira_url(SUB_DOMAINS.api) + `/ex/jira/${cloud_id}/rest/api/2/issue/MS-1226`;

  axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
  axios
    .get(path)
    .then((resp) => res.json(resp.data))
    .catch((err) => console.log(err.response));
});

app.post("/create_issue", (req, res) => {
  const { summary, issueTypeName } = req.body;
  const body = {
    fields: {
      summary: "connect emailing to distribution",
      project: {
        key: "MS",
      },
      parent: {
        key: "MS-1226",
      },
      issuetype: {
        name: "Task",
      },
      description: "Setting a Copyright year will lead to a blank page ",
      customfield_10444:
        "* Create a release\n* Enter a year into the Copyright field \n* Blank page will appear",
    },
  };
  const path = jira_url("api") + `/rest/api/2/issue/${test_issue_key}`;
  const path2 =
    "https://api.atlassian.com/ex/jira/8c9183da-3903-430d-b2bd-06d82256bff1/rest/api/2/issue/MS-1264";
  axios
    .put(path2, body)
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err.response.data));
});

app.get("/assignable_users", async (req, res) => {
  axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;

  const resp = await axios.get(
    jira_url("api") +
      `ex/jira/${cloud_id}/rest/api/2/user/assignable/search?issueKey=MS-1226&recommended=true`
  );
  console.log(resp);
  return res.json(
    resp.data.map((item) => ({
      name: item.displayName,
      id: item.accountId,
      icon: item.avatarUrls["24x24"],
    }))
  );
});

app.listen(8080);
