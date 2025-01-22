class ConfluenceButtonCreator {
    constructor(jiraBaseUrl) {
        this.jira_base_url = jiraBaseUrl;
        this.mode = "production";
        this.mappings = [
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
        ];
    }

    init() {
        this.initMode();

        var buttonDivs = document.querySelectorAll(".jira-issue-button");
        console.debug(`found ${buttonDivs.length} button divs`);
        buttonDivs.forEach((buttonDiv) => {
            const codePreWrapper = document.createElement("pre");
            const codeWrapper = document.createElement("code");
            codePreWrapper.classList.add("code");

            let config = JSON.parse(buttonDiv.textContent);
            codeWrapper.textContent = JSON.stringify(config, null, 2);

            buttonDiv.textContent = "";
            codePreWrapper.prepend(codeWrapper);
            buttonDiv.prepend(codePreWrapper);

            console.debug(`building button [prj: ${config.project_id}, issuetype: ${config.issue_type}]`);

            let baseConfig = this.getBaseConfig();
            let newButton = new JiraButton(baseConfig, config);
            let newButtonElement = newButton.getButtonElement();

            buttonDiv.prepend(newButtonElement);
        });
    }

    initMode() {
        let styleDiv = document.createElement("style");
        switch (this.mode) {
            case "production":
                console.debug("running in production mode");
                styleDiv.textContent = `.jira-issue-button { text-align: center; }`;
                styleDiv.textContent += `.jira-issue-button .code { display: none; }`;
                break;
            case "development":
                console.debug("running in development mode");
                styleDiv.textContent += `.jira-issue-button .code { font-size: 0.8em; }`;
                document.body.prepend(styleDiv);
                break;
            default:
                console.error("invalid mode. must be 'production' or 'development'");
                return;
        }

        document.body.prepend(styleDiv);
    }

    getBaseConfig() {
        return this;
    }

    addTemplate(templateId, templateText) {
        this[templateId] = templateText;
    }

    setMode(mode) {
        if (mode !== "production" && mode !== "development") {
            console.error("invalid mode. must be 'production' or 'development'");
            return;
        }
        this.mode = mode;
    }
}

class JiraButton {
    constructor(baseConfig, config) {
        this.id = `create-issue-${config.project_id}-${config.issue_type}`;
        this.baseConfig = baseConfig;
        this.config = config;
    }

    getButtonElement() {
        const newButton = document.createElement("a");

        newButton.classList.add("contentf-button", "aui-button", "aui-button-primary", "conf-macro", "output-inline");
        newButton.text = this.config.button_text;

        newButton.setAttribute("style", "text-decoration: none");
        newButton.setAttribute("target", "_blank");
        newButton.setAttribute("data-hasbody", "false");
        newButton.setAttribute("data-macro-name", "auibutton");
        newButton.setAttribute("id", this.id);
        newButton.setAttribute("name", `name-${this.id}`);

        let jiraLink = this.getJiraLink();
        newButton.href = jiraLink;

        return newButton;
    }

    getJiraLink() {
        const fieldMappings = this.baseConfig.mappings;
        const jiraUrl = new URL(this.baseConfig.jira_base_url);

        for (var dataKey in this.config) {
            let mappedKey = fieldMappings.find((mapping) => mapping.id === dataKey);
            if (mappedKey) {
                if (!mappedKey.ignore) {
                    let keyValue = this.config[dataKey];
                    if (Array.isArray(keyValue)) {
                        keyValue.forEach((val) => {
                            jiraUrl.searchParams.append(mappedKey.jira_key, val);
                        });
                    } else {
                        jiraUrl.searchParams.append(mappedKey.jira_key, keyValue);
                    }
                } else if (mappedKey.id === "description_template") {
                    let templateId = this.config["description_template"];
                    let templateText = this.baseConfig[templateId];
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
}

initConfluenceButtonCreator();
