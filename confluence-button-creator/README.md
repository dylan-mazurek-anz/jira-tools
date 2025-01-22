# Confluence Button Creator

This is a simple tool that allows you to create jira issue buttons which when clicked will take the user to a jira issue template with pre-filled fields.

## How to use

1. On your confluence page, create a "HTML" macro block.
2. Copy the following code into the block and replace the `jiraBaseUrl` with your jira base url.
3. Use the `buttonCreator.addTemplate` method to add templates. The first argument is the template name and the second argument is the template description.

```html
<!-- --- DO NOT EDIT --- -->
<script type="text/javascript">var scriptUrl="https://raw.githubusercontent.com/dylan-mazurek-anz/jira-tools/refs/heads/main/confluence-button-creator/script.js";fetch(scriptUrl).then(function(t){return t.text()}).then(function(t){var e=document.createElement("script");e.text=t,document.getElementsByTagName("head")[0].appendChild(e)}).catch(function(t){console.log("fetch error",t)});</script>
<!-- --- DO NOT EDIT --- -->

<!-- --- CUSTOM CODE BELOW --- -->
<script type="text/javascript">
let jiraBaseUrl = 'https://jira.com/secure/CreateIssueDetails!init.jspa';
var buttonCreator = new ConfluenceButtonCreator(jiraBaseUrl);
buttonCreator.addTemplate('ticket_template_base', 'This is a ticket template');

buttonCreator.init();
</script>
```

4. Create a "HTML" macro block for each button you want to create. And insert the following code. Replace the JSON values with the values you want to pre-fill in the jira issue template.

```html
<div class="jira-issue-button">
{
"button_text": "New Epic",
"project_id": 10100,
"issue_type": 10000,
"systems_impacted": 10253,
"components": [ 15906 ],
"product_owner": "testuser",
"initiative_lead": "testuser2",
"home_value_stream": 48400,
"priority": 10003,
"description_template": "ticket_template_base"
}
</div>
```
