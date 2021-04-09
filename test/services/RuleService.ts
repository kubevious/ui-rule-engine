import _ from "the-lodash"
import { IRuleService } from "@kubevious/ui-middleware"
import { RuleResult, RuleStatus } from "@kubevious/ui-middleware/dist/services/rule"

export class RuleService implements IRuleService {

    constructor() {
       
    }

    close()
    {

    }

    backendFetchRuleList(cb: (data: any) => any): void {
        cb([{
            enabled: true,
            name: "rule 1",
            target: "target-1",
            script: "script-1",
        }])
    }

    backendFetchRule(name: string, cb: (data: any) => any): void {
        cb({
            enabled: true,
            name: name,
            target: "target-1",
            script: "script-1",
        })
    }

    backendCreateRule(rule: any, name: string, cb: (data: any) => any): void {
        console.log(rule, name)
        cb({
            enabled: true,
            name: name,
            target: "target-1",
            script: "script-1",
        })
    }

    _backendUpdateRule(rule, name, cb) {
        console.log(rule, name)
        cb({
            enabled: true,
            name: name,
            target: "target-1",
            script: "script-1",
        })
    }

    backendDeleteRule(id: string, cb: (data: any) => any): void {
        console.log(id)
        cb({})
    }

    backendExportItems(cb: (data: any) => any): void {
       cb({});
    }

    backendImportItems(rules: any, cb: (data: any) => any): void {
        console.log(rules);
        cb({});
    }

    subscribeRuleStatuses(cb: ((items: RuleStatus[]) => void)) : void
    {
       cb([]);
    }

    subscribeRuleResult(cb: ((result: RuleResult) => void))
    {
        return {
            update: (ruleName : string) => {
                console.log(ruleName);
                cb({
                    name: ruleName,
                    items: [],
                    item_count: 0,
                    is_current: false,
                    logs: []
                })
            },
            close: () => {
            }
        }
    }
}
