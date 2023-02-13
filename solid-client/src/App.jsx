import {
  Box,
  Button,
  createDisclosure,
  FormControl,
  Icon,
  Input,
  Text,
  Textarea,
} from "@hope-ui/solid";
import { createEffect, createSignal, For } from "solid-js";

import VideoFileIcon from "@mui/icons-material/VideoFile";
import CustomInput from "./components/CustomInput";
import CustomModal from "./components/CustomModal";
import CustomSelect from "./components/CustomSelect";

const { isOpen, onClose, onOpen } = createDisclosure();
const [currentStep, setCurrentStep] = createSignal("");
const [isModalOpen, setModalOpen] = createSignal(false);
const [jiraBody, setJiraBody] = createSignal({ summary: "", issuetype: "" });
const [issueTypes, setIssueTypes] = createSignal([]);
const [assignableUsers, setAssignableUsers] = createSignal([]);
const [steps, setSteps] = createSignal([]);
createEffect(() => {
  fetch("http://localhost:8080/issuetypes")
    .then((res) => res.json())
    .then(setIssueTypes)
    .catch((err) => console.log(err));
});

createEffect(() => {
  fetch("http://localhost:8080/assignable_users")
    .then((res) => res.json())
    .then(setAssignableUsers)
    .catch((err) => console.log(err));
});

createEffect(() => {
  document.addEventListener("click", () => {
    onOpen();
  });
});

createEffect(() => {});

createEffect(() => {
  console.log(issueTypes());
});

function App() {
  function submitJira(e) {
    e.preventDefault();
    fetch("http://localhost:8080/create_issue", {
      method: "post",
      body: JSON.stringify(jiraBody),
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
  }

  return (
    <>
      <CustomModal
        size="lg"
        body={
          <FormControl display="flex" style="flex-direction:column;gap:10px">
            <CustomInput
              onChange={(e) => {
                setJiraBody({ ...jiraBody(), summary: e.target.value });
              }}
              placeholder="Summary"
            />
            <Box display="flex" gap="10px">
              <CustomSelect
                onChange={(value) => {
                  setJiraBody({ ...jiraBody(), issuetype: value });
                }}
                placeholder="Issue types"
                options={issueTypes}
              />
              <CustomSelect
                onChange={(value) => {
                  setJiraBody({ ...jiraBody(), assignee: value });
                }}
                placeholder="Assignee"
                options={assignableUsers}
              />
            </Box>
            <Textarea placeholder="Description" resize="none" />
            <Text>Steps to reproduce</Text>
            <For each={steps()}>
              {(item, index) => (
                <Input
                  readOnly={index > 0 && steps.length > 1}
                  value={item}
                  onkeyup={(e) => {
                    setCurrentStep(e.target.value);
                  }}
                />
              )}
            </For>
            <Button
              onclick={() => {
                setSteps((prev) => [...prev, currentStep()]);
                setCurrentStep("");
              }}
            >
              Add step
            </Button>
            <Button
              onclick={() => {
                setJiraBody({ ...jiraBody(), steps: steps().join("*\n") });
                const formdata = new FormData();
                for (let key in jiraBody()) {
                  formdata.append(key, jiraBody()[key]);
                }
                console.log(Object.fromEntries(formdata));
                // fetch("http://localhost:8080/create_issue", {
                //   method: "post",
                //   body: JSON.stringify(jiraBody),
                // });
              }}
              alignSelf="flex-end"
            >
              Submit
            </Button>

            <label>Record screen</label>
            <Input
              onChange={(e) => {
                const file = e.target.files[0];
                setJiraBody({ ...jiraBody(), file: file });
                const fr = new FileReader();
                fr.onload = function (ev) {
                  const f = ev.target.result;
                  console.log(f);
                };
                fr.readAsDataURL(file);
              }}
              type="file"
            />
          </FormControl>
        }
        title="Create jira issue"
        isOpen={true}
        onOpen={onOpen}
        onClose={onClose}
      />
    </>
  );
}

export default App;
