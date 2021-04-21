import { IRuleService } from '@kubevious/ui-middleware';
import {
    RuleConfig,
    RuleListItem,
    RuleResult,
    RulesExportData,
    RuleStatus,
} from '@kubevious/ui-middleware/dist/services/rule';

export class RuleService implements IRuleService {
    getList(): Promise<RuleListItem[]> {
        return Promise.resolve([
            {
                enabled: true,
                name: 'rule 1',
                target: 'target-1',
                script: 'script-1',
            },
        ]);
    }

    getItem(name: string): Promise<RuleConfig | null> {
        return Promise.resolve({
            enabled: true,
            name: name,
            target: 'target-1',
            script: 'script-1',
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

    importItems(data): Promise<void> {
        console.log(data);
        return Promise.resolve();
    }

    getItemsStatuses(): Promise<RuleStatus[]> {
        return Promise.resolve([]);
    }

    getItemResult(name: string): Promise<RuleResult> {
        return Promise.resolve({
            name: name,
            items: [],
            item_count: 0,
            is_current: false,
            logs: [],
        });
    }

    subscribeItemStatuses(cb: (items: RuleStatus[]) => void): void {
        this.getItemsStatuses().then((result) => cb(result));
    }

    subscribeItemResult(cb: (result: RuleResult) => void) {
        return {
            update: (ruleName: string) => {
                this.getItemResult(ruleName).then((result) => cb(result));
            },
            close: () => {},
        };
    }

    close() {}
}
