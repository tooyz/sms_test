import {TextSplitterConfig} from "./text-splitter-config";

export class TextSplitter {
    private readonly config: TextSplitterConfig;

    constructor(private readonly input: string, config?: TextSplitterConfig) {
        this.config = config ?? {
            maxLength: 140
        }
    }

    public split(): string[] {
        const split = this.input.split(' ');
        const {maxLength} = this.config;
        let predictedTotal = 9;
        let lastCalculatedResult: string[] | null = [];
        let totalSetAs: null | number  = null;

        const tryCalculate = () => {
            const result: string[] = [];
            let currentRow = 1;
            let message = '';
            for ( let i = 0; i < split.length; i++ ) {
                const word = split[i];
                const suffix = ` ${currentRow}/${totalSetAs === null ? predictedTotal: totalSetAs}`;

                if ( word.length + suffix.length > maxLength ) {
                    throw new Error(`Word too large: ${word}, suffixLen: ${suffix.length}`);
                }

                let newMessage = message;
                newMessage += `${message.length === 0 ? '' : ' '}${word}`;

                if ( (newMessage.length + suffix.length) > maxLength) {
                    result.push(message + suffix);
                    currentRow++;
                    message = '';
                    i--;
                } else if ((i === split.length - 1)) {
                    result.push(newMessage + suffix);
                } else {
                    message = newMessage;
                }

                if ( result.length > predictedTotal ) {
                    return null;
                }
            }

            return result;
        }

        while (true) {
            const newResult = tryCalculate();
            if ( newResult === null ) {
                predictedTotal = +`9${predictedTotal}`;
            } else {
                if ( newResult.length !== lastCalculatedResult?.length ) {
                    totalSetAs = newResult.length;
                } else if (totalSetAs !== null) {
                    if ( newResult.length === 1 ) {
                        const repl = newResult[0].replace(/\s..\/..$/, '')
                        return [repl];
                    }
                    return newResult as string[];
                }
            }
            lastCalculatedResult = newResult;
        }
    }
}