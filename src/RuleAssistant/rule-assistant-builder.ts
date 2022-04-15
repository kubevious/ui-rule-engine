import _ from 'the-lodash';
import { Dn, NodeKind, parseDn, NODE_LABELS, PropsId } from '@kubevious/entity-meta';
import { SnapshotPropsConfig } from '@kubevious/state-registry';

export class RuleAssistantBuilder
{
    private _dn: string;
    private _dnParts: Dn;
    private _props: SnapshotPropsConfig[] = [];

    private _targetScripts: RuleAssistantSnippet[] = [];
    private _ruleScripts: RuleAssistantSnippet[] = [];

    constructor(dn: string, props: SnapshotPropsConfig[])
    {
        this._dn = dn;
        this._dnParts = parseDn(dn);
        this._props = props;

        this._buildTargetScripts();
        this._buildRuleScripts();
    }

    get dn() {
        return this._dn;
    }

    get targetScripts() {
        return this._targetScripts;
    }

    get ruleScripts() {
        return this._ruleScripts;
    }

    private _buildTargetScripts()
    {
        this._targetScripts.push({
            name: 'Simple Target Script',
            code: this._getTargetScript(false)
        });

        this._targetScripts.push({
            name: 'Filtered Target Script',
            code: this._getTargetScript(true)
        });
    }

    private _buildRuleScripts()
    {
        const propsDict = _.makeDict(this._props, x => x.id, x => x);
        
        {
            const config = propsDict[PropsId.properties];
            if (config)
            {
                this._ruleScripts.push({
                    name: 'item.props',
                    code: this._getCodeStr(config.config)
                });
            }
        }


        {
            const config = propsDict[PropsId.labels];
            if (config)
            {
                this._ruleScripts.push({
                    name: 'item.labels',
                    code: this._getCodeStr(config.config)
                });
            }
        }

        {
            const config = propsDict[PropsId.annotations];
            if (config)
            {
                this._ruleScripts.push({
                    name: 'item.annotations',
                    code: this._getCodeStr(config.config)
                });
            }
        }

        {
            const config = propsDict[PropsId.targetLinks];
            if (config)
            {
                {
                    const links = _.flatten(_.values(config.config));
                    const linksCode = links.map(x => `// -> ${x.dn}`).join('\n');
                    this._ruleScripts.push({
                        name: 'item.allLinks()',
                        code: linksCode
                    });
                }

                for(const linkName of _.keys(config.config))
                {
                    const links = config.config[linkName];
                    const linksCode = links.map(x => `// -> ${x.dn}`).join('\n');
                    this._ruleScripts.push({
                        name: `item.links("${linkName}")`,
                        code: linksCode
                    });
                }
            }
        }

        const propsToSkip = 
            [PropsId.properties, PropsId.config, PropsId.labels, PropsId.annotations, PropsId.targetLinks]

        for(const config of this._props)
        {
            if (!_.includes(propsToSkip, config.id))
            {
                this._ruleScripts.push({
                    name: `item.getProperties('${config.id}')`,
                    code: this._getCodeStr(config.config)
                });
            }
        }

        {
            const config = propsDict[PropsId.config];
            if (config)
            {
                this._ruleScripts.push({
                    name: 'item.config',
                    code: this._getCodeStr(config.config)
                });
            }
        }
    }

    private _getTargetScript(nameFilters: boolean)
    {
        if (this._dnParts.length < 2)
        {
            return '';
        }

        let script = '';
        const firstKind = this._dnParts[1].kind;
        if (firstKind === NodeKind.logic)
        {
            script = 'Logic()'
        }
        else if (firstKind === NodeKind.images)
        {
            script = 'Images()'
        }
        else if (firstKind === NodeKind.gateway)
        {
            script = 'Gateway()'
        }
        else if (firstKind === NodeKind.pack)
        {
            script = 'Package()'
        }
        else if (firstKind === NodeKind.k8s)
        {
            script = 'K8s()'
        }
        else if (firstKind === NodeKind.infra)
        {
            script = 'Infra()'
        }
        else if (firstKind === NodeKind.rbac)
        {
            script = 'RBAC()'
        }

        for(let i = 2; i < this._dnParts.length; i++)
        {
            const rn = this._dnParts[i];

            const kindLabel = NODE_LABELS.get(rn.kind);
            script += `\n  .child('${kindLabel}')`;

            if (nameFilters)
            {
                if (rn.name)
                {
                    script += `\n    .name('${rn.name}')`;
                }
            }
        }
        
        return script;
    }

    private _getCodeStr(config: any)
    {
        if (config) {
            const str = JSON.stringify(config, null, 4);
            return str;
        }
        return '';
    }
}

export interface RuleAssistantSnippet
{
    name: string;
    code: string;
}