export const exportFile = ({ service }) => {
    service.exportItems().then((response) => {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(response));
        const exportElem: HTMLElement | null = document.getElementById('exportAnchor');

        if (exportElem) {
            exportElem.setAttribute('href', dataStr);
            exportElem.setAttribute('download', `${response.kind}.json`);
            exportElem.click();
        }
    });
};
