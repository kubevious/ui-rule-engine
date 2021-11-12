import { Story } from '@storybook/react';
import React, { useEffect } from 'react';

import { Assistant } from './';

export default {
    title: 'Assistant',
    component: Assistant
};

export const Default: Story = () => {

    return <div style={{ background: 'black', margin: '20px', padding: '20px', height: '800px' }}>
        <Assistant
            dn="root/logic/ns-[kube-system]"
            scripts={SCRIPTS}
            />
    </div>
};



const SCRIPTS = [
    {
        "name": "Simple Target Script",
        "code": "Logic()\n  .child('Namespace')\n  .child('Application')"
    },
    {
        "name": "Filtered Target Script",
        "code": "Logic()\n  .child('Namespace')\n    .name('test-webapp-backend')\n  .child('Application')\n    .name('backend')"
    },
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

