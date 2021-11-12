export type AssistantProps = {
    dn: string;
    scripts: RuleAssistantSnippet[];

    handleInsert?: (script: RuleAssistantSnippet) => void;
};

export interface RuleAssistantData
{
    dn: string;
    targetScripts: RuleAssistantSnippet[];
    ruleScripts: RuleAssistantSnippet[];
}

export interface RuleAssistantSnippet
{
    name: string;
    code: string;
}