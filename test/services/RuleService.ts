import _ from "the-lodash"
import { IRuleService } from "@kubevious/ui-middleware"
import { RuleConfig, RuleListItem, RuleResult, RulesExportData, RuleStatus } from "@kubevious/ui-middleware/dist/services/rule"

export class RuleService implements IRuleService {

    constructor() {
       
    }

    close()
    {

    }

    getRuleList() : Promise<RuleListItem[]> {
        return Promise.resolve([{
            enabled: true,
            name: "rule 1",
            target: "target-1",
            script: "script-1",
        }])
    }

    getRule(name: string) : Promise<RuleConfig | null> {
        return Promise.resolve({
            enabled: true,
            name: name,
            target: "target-1",
            script: "script-1",
        })
    }

    createRule(config: RuleConfig, name: string) : Promise<RuleConfig> {
        console.log(config, name)
        return Promise.resolve({
            enabled: true,
            name: name,
            target: "target-1",
            script: "script-1",
        })
    }

    deleteRule(name: string) : Promise<void> {
        console.log(name)
        return Promise.resolve();
    }

    exportRules() : Promise<RulesExportData> {
       return Promise.resolve({
        kind: 'rules',
        items: []
    });
    }

    importRules(data: RulesExportData) : Promise<void> {
        console.log(data);
        return Promise.resolve();
    }

    getRulesStatuses() : Promise<RuleStatus[]>
    {
        return Promise.resolve([]);
    }

    getRuleResult(name: string) : Promise<RuleResult>
    {
        return Promise.resolve({
            name: name,
            items: [],
            item_count: 0,
            is_current: false,
            logs: []
        })
    }

    subscribeRuleStatuses(cb: ((items: RuleStatus[]) => void)) : void
    {
        this.getRulesStatuses()
            .then(result => cb(result));
    }

    subscribeRuleResult(cb: ((result: RuleResult) => void))
    {
        return {
            update: (ruleName : string) => {
                this.getRuleResult(ruleName)
                    .then(result => cb(result));
            },
            close: () => {
            }
        }
    }
}
