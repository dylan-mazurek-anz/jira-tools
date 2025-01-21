var jiraButtonConfigBase = {
    "mappings": [
        { id: "button_text", ignore: true },
        { id: "description_template", ignore: true },
        { id: "project_id", jira_key: "pid" },
        { id: "issue_type", jira_key: "issuetype" },
        { id: "components", jira_key: "components" },
        { id: "systems_impacted", jira_key: "customfield_10303" },
        { id: "product_owner", jira_key: "customfield_11911" },
        { id: "epic_link", jira_key: "customfield_10101" },
        { id: "initiative_lead", jira_key: "customfield_11910" },
        { id: "home_value_stream", jira_key: "customfield_10900" },
        { id: "test_impact", jira_key: "customfield_11285" },
        { id: "is_a_regression", jira_key: "customfield_11802" },
        { id: "environments_impacted", jira_key: "customfield_11501" },
        { id: "environment_found", jira_key: "customfield_11235" },
        { id: "test_impact", jira_key: "customfield_11285" },
        { id: "priority", jira_key: "priority" }
    ]
}

console.log("initialising jira button creator");

if (typeof jiraButtonConfig !== 'undefined') {
    jiraButtonConfig = { ...jiraButtonConfig, ...jiraButtonConfigBase };
    var buttonDivs = document.querySelectorAll(".jira-issue-button");
    buttonDivs.forEach((buttonDiv) => {
        var ticketData = JSON.parse(buttonDiv.textContent);
        console.log(`building button [prj: ${ticketData.project_id}, issuetype: ${ticketData.issue_type}]`)
        var button = newButton(ticketData);
        buttonDiv.prepend(button);
    });
} else {
    console.log("jira button config not found. stopped loading.")
}


function newButton(ticketData) {
    let buttonId = `create-ticket-${ticketData.project_id}-${ticketData.issue_type}`;

    const button = document.createElement("a");

    button.classList.add("contentf-button", "aui-button", "aui-button-primary", "conf-macro", "output-inline");
    button.text = ticketData.button_text;

    button.setAttribute("style", "text-decoration: none");
    button.setAttribute("target", "_blank");
    button.setAttribute("data-hasbody", "false");
    button.setAttribute("data-macro-name", "auibutton");
    button.setAttribute("id", buttonId);
    button.setAttribute("name", `name-${buttonId}`);

    let jiraLink = buildJiraLink(ticketData);
    button.href = jiraLink;

    return button;
}

function buildJiraLink(ticketData) {
    const fieldMappings = jiraButtonConfig.mappings;
    const jiraUrl = new URL(jiraButtonConfig.jira_base_url);
    for (var dataKey in ticketData) {
        let mappedKey = fieldMappings.find((mapping) => mapping.id === dataKey);
        if (mappedKey) {
            if (!mappedKey.ignore) {
                let keyValue = ticketData[dataKey];
                if (Array.isArray(keyValue)) {
                    keyValue.forEach((val) => {
                        jiraUrl.searchParams.append(mappedKey.jira_key, val);
                    });
                } else {
                    jiraUrl.searchParams.append(mappedKey.jira_key, keyValue);
                }
            } else if (mappedKey.id === "description_template") {
                let templateId = ticketData["description_template"];
                let templateText = jiraButtonConfig[templateId];
                if (templateText) {
                    jiraUrl.searchParams.append("description", templateText);
                }
            }
        } else {
            console.error(`key not found: ${dataKey}`);
        }
    }

    return jiraUrl.href;
}
