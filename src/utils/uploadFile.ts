export const uploadFile = ({ service, selector, deleteExtra }): void => {
    const input = document.getElementById(`upload-${selector}`) as HTMLInputElement;

    if (input?.files?.length === 0) {
        console.error('No file selected.');
        return;
    }

    const reader: FileReader = new FileReader();

    reader.onload = () => {
        const importData: {
            data: {};
            deleteExtra: boolean;
        } = {
            // @ts-ignore: Unreachable code error
            data: JSON.parse(reader.result),
            deleteExtra,
        };

        service.importItems(importData as any).then(() => {
            input.value = '';
        });
    };

    input.files && reader.readAsText(input.files[0]);
};
