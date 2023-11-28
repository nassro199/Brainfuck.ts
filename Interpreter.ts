import * as fs from 'fs';
import * as readline from 'readline';

interface LoopData {
    index: number;
    falsedLoops: number;
    loops: number[];
}

const ARRAY_SIZE = 5000;

const createArray = (size: number): number[] => Array(size).fill(0);

const printf = (text: string): void => {
    process.stdout.write(text);
    process.stdout.write(''); // Flush the output
};

const getInput = async (): Promise<number> => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
    });

    return new Promise<number>((resolve) => {
        rl.once('line', (chunk) => {
            rl.close();
            resolve(chunk.charCodeAt(0));
        });
    });
};

const handleClosingBracket = (array: number[], pointer: number, loopData: LoopData): void => {
    if (loopData.falsedLoops > 0) {
        loopData.falsedLoops--;
    } else if (loopData.loops.length > 0) {
        if (array[pointer]) {
            loopData.index = loopData.loops[loopData.loops.length - 1];
        } else {
            loopData.loops.pop();
        }
    }
};

const handleOpeningBracket = (array: number[], pointer: number, loopData: LoopData): void => {
    if (array[pointer] && loopData.falsedLoops < 1) {
        loopData.loops.push(loopData.index + 1);
    } else {
        loopData.falsedLoops++;
    }
};

const executeBrainfuck = async (program: string): Promise<void> => {
    const array: number[] = createArray(ARRAY_SIZE);
    const loopData: LoopData = { index: 0, falsedLoops: 0, loops: [] };
    let pointer: number = Math.floor(array.length / 2);

    while (loopData.index < program.length) {
        const currentChar: string = program[loopData.index];

        switch (currentChar) {
            case ']':
                handleClosingBracket(array, pointer, loopData);
                break;
            case '[':
                handleOpeningBracket(array, pointer, loopData);
                break;
            case '>':
                pointer++;
                break;
            case '<':
                pointer--;
                break;
            case '+':
                array[pointer]++;
                break;
            case '-':
                array[pointer]--;
                break;
            case '.':
                printf(String.fromCharCode(array[pointer]));
                break;
            case ',':
                array[pointer] = await getInput();
                break;
        }

        loopData.index++;
    }

    printf('\n');
};

const main = async (): Promise<void> => {
    const args: string[] = process.argv.slice(2);
    await Promise.all(args.map(async (program) => await executeBrainfuck(program)));
};

main();
