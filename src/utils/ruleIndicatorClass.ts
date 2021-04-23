import styles from '../components/Sider/styles.module.css';
import { EditorItem, IndicatorType } from '../types';

export const ruleIndicatorClass = (x: EditorItem): string => {
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
