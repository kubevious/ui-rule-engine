import React, { FC } from 'react';
import { Button, CodeControl } from '@kubevious/ui-components';
import { app } from '@kubevious/ui-framework';

import styles from './styles.module.css';

import { RuleAssistantBuilder, RuleAssistantSnippet } from './rule-assistant-builder';

import { SnapshotPropsConfig } from '@kubevious/state-registry';

export interface RuleAssistantProps {
    dn: string;
    props: SnapshotPropsConfig[];
}

export const RuleAssistant: FC<RuleAssistantProps> = ({ dn, props }) => {

    const builder = new RuleAssistantBuilder(dn, props);

    const onActivateAssistant = () => {
        const data = {
            dn: dn,
            targetScripts: builder.targetScripts,
            ruleScripts: builder.ruleScripts
        }

        app.sharedState.set('rule_engine_assistant_data', data);
        app.sharedState.set('rule_editor_is_new_rule', true);
        app.sharedState.set('focus_rule_editor', true);
    };

    return <div>

        <div>
            <Button onClick={onActivateAssistant}>
                Create New Rule with Assistant
            </Button>
        </div>

        {builder.targetScripts.map((snippet, index) => (
            <div key={index}>
                <div className={styles.sectionTitle}>{snippet.name}</div>
                <div className={styles.sectionCode}>
                    <CodeControl 
                        value={snippet.code}
                        syntax={'javascript'}
                        showCopyButton
                        sizeToContent
                        />
                </div>
            </div>
        ))}

        <div className={styles.sectionTitle}>Rule Script</div>
        <div className={styles.sectionCode}>
            <CodeControl 
                value={getRuleScriptsCode(builder.ruleScripts)}
                syntax={'javascript'}
                showCopyButton
                sizeToContent
                />
        </div>

    </div>
}

function getRuleScriptsCode(snippets: RuleAssistantSnippet[])
{
    let script = 
        snippets.map(x => getRuleScriptSnippetCode(x))
            .join('\n');
    return script;
}

function getRuleScriptSnippetCode(snippet: RuleAssistantSnippet)
{
    let script = '';

    script += `console.log(${snippet.name});`
    script += '\n';
    script += commentCode(snippet.code);
    script += '\n';
    
    return script;
}

function commentCode(str: string)
{
    const lines = str.split('\n');
    const commented = lines.map(x => `  // ${x}`);
    return commented.join('\n');
}