const issueBody = {
  summary: "",
  issue_type: "",
};

function submitJira(e) {
  e.preventDefault();
  document.querySelector(".feedbug-modal").remove();
  console.log("submit jira");
  fetch("http://localhost:8080/create_issue", { method: "post" })
    .then((res) => res.json())
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
}

function handleChange(e) {
  console.log(e);
  console.log(e.target.value);
}
