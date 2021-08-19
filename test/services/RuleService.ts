import _ from 'the-lodash';
import { Promise } from 'the-promise';

import { IRuleService } from '@kubevious/ui-middleware';
import {
    RuleConfig,
    RuleListItem,
    RuleResult,
    RuleResultItem,
    RuleResultLog,
    RulesExportData,
    RuleStatus,
} from '@kubevious/ui-middleware/dist/services/rule';

interface RuleMockData
{
    config: RuleConfig,

    is_current: boolean,
    items: RuleResultItem[];
    logs: RuleResultLog[];
}

export class RuleService implements IRuleService {

    private _rules : Record<string, RuleMockData> = {};

    constructor(empty?: boolean)
    {
        if (empty) {
            return;
        }

        for(let i = 1; i <= 50; i++)
        {
            const name = `rule ${i}`;

            const config : RuleConfig = {
                enabled: (i % 10) > 8,
                name: name,
                target: `target-${i}`,
                script: `script-${i}`,
            }

            const items: RuleResultItem[] = [];
            if ((i % 10) > 5) {
                for(let j = 1; j <= i * 5; j++)
                {
                    items.push({ 
                        dn: 'root/ns-[kube-system]'
                    });
                }
            }

            const logs: RuleResultLog[] = [];
            if ((i % 10) > 8) {
                for(let j = 1; j <= i * 2; j++)
                {
                    logs.push({
                        kind: 'error',
                        msg: {
                            source: [`Other`],
                            msg: `ERROR Message ${j}`
                        }
                    })
                }
            }

            this._rules[name] = {
                config: config,
                is_current: (i % 10) > 7,
                items: items,
                logs: logs
            };
        }
    }

    getList(): Promise<RuleListItem[]> {
        return Promise.resolve(_.values(this._rules).map(x => ({
            name: x.config.name,
            enabled: x.config.enabled,
        })));
    }

    getItem(name: string): Promise<RuleConfig | null> {
        return Promise.resolve()
            .then(() => {
                const item = this._rules[name];
                if (item) {
                    return item.config
                }
                return null;
            });
    }

    createItem(config: RuleConfig, name: string): Promise<RuleConfig> {
        console.log(config, name);
        return Promise.resolve({
            enabled: true,
            name: name,
            target: 'target-1',
            script: 'script-1',
        });
    }

    deleteItem(name: string): Promise<void> {
        console.log(name);
        return Promise.resolve();
    }

    exportItems(): Promise<RulesExportData> {
        return Promise.resolve({
            kind: 'rules',
            items: [],
        });
    }

    importItems(data: any): Promise<void> {
        console.log(data);
        return Promise.resolve();
    }

    getItemStatuses(): Promise<RuleStatus[]> {
        return Promise.resolve(_.values(this._rules).map(x => ({
            name: x.config.name,
            enabled: x.config.enabled,
            is_current: x.is_current,
            error_count: x.logs.length,
            item_count: x.items.length
        })));
    }

    getItemResult(name: string): Promise<RuleResult> {

        return Promise.resolve()
            .then(() => {
                const item = this._rules[name];
                if (!item) {
                    throw new Error("xxx");
                }

                const result : RuleResult = {
                    name: item.config.name,
                    items: item.items,
                    is_current: true,
                    error_count: item.logs.length,
                    logs: item.logs
                };
                return result;
            });
    }

    subscribeItemStatuses(cb: (items: RuleStatus[]) => void): void {
        this.getItemStatuses().then((result) => cb(result));
    }

    subscribeItemResult(cb: (result: RuleResult) => void) {
        return {
            update: (ruleName: string | null) => {
                if (ruleName) {
                    this.getItemResult(ruleName).then((result) => cb(result));
                }
            },
            close: () => {},
        };
    }

    close() {}
}
