import { RuleStatus } from '@kubevious/ui-middleware/dist/services/rule';
import styles from '../components/Sider/styles.module.css';
import { IndicatorType } from '../types';

export const ruleIndicatorClass = (x: RuleStatus): string => {
    let indicatorClass: string;
    if (!x.enabled) {
        indicatorClass = IndicatorType.disabled;
    } else if (x.error_count) {
        indicatorClass = IndicatorType.invalid;
    } else {
        indicatorClass = IndicatorType.enabled;
    }
    return styles[indicatorClass];
};
