const { exec, spawn } = require('child_process');
const { logger } = require('../utils/logging');
const { codeDirectory } = require('./index');

const STDOUT = "stdout", STDERR = "stderr";

const TIME_LIMIT_MS = 1000;

/**
 * @param {{name: String, image: String, memory?: String}} config
 * @returns {Promise<String>}
 */
const createContainer = ({ name, image, memory = '512m' }) => {
    return new Promise((resolve, reject) => {
        const command = `docker run -i -d --rm --memory=${memory} --memory-swap=${memory} --mount type=bind,src="${codeDirectory}",dst=/codeFiles --name ${name} --label oj=oj ${image}`;
        exec(command, (error, stdout, stderr) => {
            if (error || stderr) {
                return reject({ msg: 'Docker Container Creation Error', error, stderr });
            }
            resolve(stdout.trim());
        });
    });
};

const killContainer = container_id_name => {
    return new Promise((resolve) => {
        exec(`docker kill ${container_id_name}`, (error, stdout, stderr) => {
            stdout && logger.log('Deleted(stopped) :', stdout);
            resolve(container_id_name);
        });
    });
};

const details = {
    'c': {
        compilerCmd: id => `gcc ./codeFiles/${id}.c -o ./codeFiles/${id}.out -lpthread -lrt`,
        executorCmd: id => `./codeFiles/${id}.out`,
    },
    'cpp': {
        compilerCmd: id => `g++ ./codeFiles/${id}.cpp -o ./codeFiles/${id}.out`,
        executorCmd: id => `./codeFiles/${id}.out`,
    },
    'py': {
        compilerCmd: null,
        executorCmd: id => `python ./codeFiles/${id}`,
    },
    'js': {
        compilerCmd: null,
        executorCmd: id => `node ./codeFiles/${id}`,
    },
    'java': {
        compilerCmd: id => `javac -d ./codeFiles/${id} ./codeFiles/${id}.java`,
        executorCmd: id => `java -cp ./codeFiles/${id} Solution`,
    }
};

/**
 * Compile source code in container
 */
const compile = (containerId, filename, language) => {
    const id = filename.split(".")[0];
    const command = details[language].compilerCmd ? details[language].compilerCmd(id) : null;

    return new Promise((resolve, reject) => {
        if (!command) return resolve(filename);

        exec(`docker exec ${containerId} ${command}`, (error, stdout, stderr) => {
            if (error || stderr) {
                return reject({
                    msg: 'Compilation Error',
                    error: `${error || ''}`,
                    stderr: `${stderr || ''}`
                });
            }
            resolve(id);
        });
    });
};

/**
 * Execute compiled code in container
 */
const execute = (containerId, filename, input, language,timeLimit=TIME_LIMIT_MS, onProgress = null) => {
    const command = details[language].executorCmd ? details[language].executorCmd(filename) : null;

    return new Promise((resolve, reject) => {
        if (!command) return reject('Language Not Supported');

        const cmd = spawn('docker', ['exec', '-i', `${containerId}`, command], { shell: true });

        let stdout = '';
        let stderr = '';
        let timedOut = false;

        const timeout = setTimeout(() => {
            timedOut = true;
            cmd.kill('SIGKILL');
            reject({ msg: 'Time Limit Exceeded' });
        }, timeLimit);

        if (input) {
            cmd.stdin.write(input);
            cmd.stdin.end();
        }

        cmd.stdin.on('error', err => {
            reject({ msg: 'Stdin Error', error: `${err}` });
        });

        cmd.stdout.on('data', data => {
            stdout += `${data}`;
            onProgress && onProgress(`${data}`, STDOUT, cmd.pid);
        });

        cmd.stderr.on('data', data => {
            stderr += `${data}`;
            onProgress && onProgress(`${data}`, STDERR, cmd.pid);
        });

        cmd.on('error', (error) => {
            clearTimeout(timeout);
            reject({ msg: 'Process Error', error });
        });

        cmd.on('close', (code, signal) => {
            clearTimeout(timeout);
            if (timedOut) return;

            if (code === 137) {
                return reject({ msg: 'Memory Limit Exceeded' });
            }

            if (code !== 0) {
                if (stderr.includes('Segmentation fault')) {
                    return reject({ msg: 'Runtime Error: Segmentation Fault', stderr });
                }
                return reject({ msg: 'Runtime Error', stderr });
            }

            resolve(stdout.trim());
        });
    });
};

module.exports = {
    createContainer,
    killContainer,
    compile,
    execute,
    STDOUT,
    STDERR
};
