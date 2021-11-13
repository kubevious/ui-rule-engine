import { app } from '@kubevious/ui-framework';
import { RuleConfig } from '@kubevious/ui-middleware/dist/services/rule';
import { Story } from '@storybook/react';
import React from 'react';
import { RuleAssistantData } from './types';

import { RuleMainTab } from './';

export default {
    title: 'Rule Main Tab',
    component: RuleMainTab
};

export const NewItem: Story = () => {

    const ruleConfig : RuleConfig = {
        name: '',
        target: '',
        script: '',
        enabled: true
    }

    app.sharedState.set("rule_engine_assistant_data", null);

    return <div style={{ background: 'black', margin: '20px', padding: '20px', height: '800px' }}>
        <RuleMainTab
            isNewItem={true}
            selectedItem={ruleConfig}
            saveItem={dummyHandler('saveItem')}
            deleteItem={dummyHandler('deleteItem')}
            createItem={dummyHandler('createItem')}
            openSummary={dummyHandler('openSummary')}
            />
    </div>
};

export const RuleAssistant: Story = () => {

    const ruleConfig : RuleConfig = {
        name: '',
        target: '',
        script: '',
        enabled: true
    }

    const assistantData : RuleAssistantData = {
        dn: 'root/logic/ns-[kube-system]',
        targetScripts: TARGET_SCRIPTS,
        ruleScripts: RULE_SCRIPTS
    } 

    app.sharedState.set("rule_engine_assistant_data", assistantData);

    return <div style={{ background: 'black', margin: '20px', padding: '20px', height: '800px' }}>
        <RuleMainTab
            isNewItem={true}
            selectedItem={ruleConfig}
            saveItem={dummyHandler('saveItem')}
            deleteItem={dummyHandler('deleteItem')}
            createItem={dummyHandler('createItem')}
            openSummary={dummyHandler('openSummary')}
            />
    </div>
};

function dummyHandler(name: string)
{
    return () => {
        console.log("[dummyHandler] :: ", name)
    }
}

const TARGET_SCRIPTS = [
    {
        "name": "Simple Target Script",
        "code": "Logic()\n  .child('Namespace')\n  .child('Application')"
    },
    {
        "name": "Filtered Target Script",
        "code": "Logic()\n  .child('Namespace')\n    .name('test-webapp-backend')\n  .child('Application')\n    .name('backend')"
    }
]

const RULE_SCRIPTS = [
    {
        "name": "item.props",
        "code": "{\n    \"Exposed\": \"No\",\n    \"Volumes\": 0,\n    \"Launcher\": \"Deployment\",\n    \"Replicas\": \"1\",\n    \"Container Count\": 1,\n    \"Init Container Count\": 0\n}"
    },
    {
        "name": "item.labels",
        "code": "{\n    \"app\": \"backend\"\n}"
    },
    {
        "name": "links",
        "code": "item.allLinks()\n  // -> root/images/repo-[dockerhub]/image-[nginx]/tag-[latest]/ns-[test-webapp-backend]/app-[backend]\n\nitem.links('image')\n  // -> root/images/repo-[dockerhub]/image-[nginx]/tag-[latest]/ns-[test-webapp-backend]/app-[backend]\n\n\n"
    },
    {
        "name": "item.getProperties('resources-per-pod')",
        "code": "{\n    \"cpu\": {\n        \"unit\": \"cores\",\n        \"value\": 0\n    },\n    \"memory\": {\n        \"unit\": \"bytes\",\n        \"value\": 0\n    }\n}"
    },
    {
        "name": "item.getProperties('resources')",
        "code": "{\n    \"cpu\": {\n        \"unit\": \"cores\",\n        \"value\": 0\n    },\n    \"memory\": {\n        \"unit\": \"bytes\",\n        \"value\": 0\n    }\n}"
    },
    {
        "name": "item.getProperties('cluster-consumption')",
        "code": "{\n    \"cpu\": {\n        \"unit\": \"%\",\n        \"value\": 0\n    },\n    \"memory\": {\n        \"unit\": \"%\",\n        \"value\": 0\n    }\n}"
    },
    { 
        "name": "item.config",
        "code": JSON.stringify(
            {
                "kind": "Deployment",
                "spec": {
                    "replicas": 1,
                    "selector": {
                        "matchLabels": {
                            "app": "isolated-nginx"
                        }
                    },
                    "template": {
                        "spec": {
                            "dnsPolicy": "ClusterFirst",
                            "containers": [
                                {
                                    "name": "nginx",
                                    "image": "nginx"
                                }
                            ],
                            "restartPolicy": "Always",
                            "terminationGracePeriodSeconds": 30
                        },
                        "metadata": {
                            "labels": {
                                "app": "isolated-nginx"
                            }
                        }
                    }
                },
                "metadata": {
                    "name": "isolated-nginx",
                    "labels": {
                        "app": "isolated-nginx"
                    },
                    "namespace": "test-ingress-isolated-pod"
                },
                "apiVersion": "apps/v1"
            }, null, 4
        )
    }
];