interface LoopData {
    index: number;
    falsedLoops: number;
    loops: number[];
}

const dist = (a: number, b: number): number => Math.abs(a - b);

const executeBrainfuck = (program: string): void => {
    const array: number[] = Array(5000).fill(0);
    const loopData: LoopData = { index: 0, falsedLoops: 0, loops: [] };
    let pointer: number = Math.floor(array.length / 2);
    let code: string = "";

    while (loopData.index < program.length) {
        const currentChar: string = program[loopData.index];

        switch (currentChar) {
            case '>':
                while (dist(array[pointer + 1], array[pointer]) < dist(array[pointer], array[pointer])) {
                    code += '>';
                    ++pointer;
                }
                break;
            case '<':
                while (dist(array[pointer - 1], array[pointer]) < dist(array[pointer], array[pointer])) {
                    code += '<';
                    --pointer;
                }
                break;
            case '+':
                ++array[pointer];
                break;
            case '-':
                --array[pointer];
                break;
            case '.':
                code += '.';
                break;
        }

        loopData.index++;
    }

    console.log(code);
};

const args: string[] = process.argv.slice(2);

for (const program of args) {
    executeBrainfuck(program);
}
