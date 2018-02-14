/*    SERVICE - AUTOMATIZAR GERAÇÃO DE VERSOES E PUBLICAÇÃO DO PACKAGE    */

const fs = require('fs'),
    path = require('path'),
    Promise = require('promise'),
    { exec } = require('child_process'),
    colors = require("colors/safe");

let versionValue, versionUpdate, commitMessage;

(async () => {
    versionUpdate = process.argv[2];
    commitMessage = process.argv[3];

    if (!versionUpdate) return console.log('Versão não informada.');
    if (!['patch', 'minor', 'major'].includes(versionUpdate)) return console.log("Versão informada não existe, tipos:['patch', 'minor', 'major']");
    versionValue = versionUpdate == 'patch' ? 2 : versionUpdate == 'minor' ? 1 : 0;

    await init();
})();

async function init() {
    try {
        console.log(colors.bgMagenta.underline('**** START SERVICE ****'));
        console.log('');

        await build();

        const version = prepareJSON();

        await git(version);

        await npm();

        end();
    } catch (ex) {
        end(ex);
    }
}

// COMMANDS

async function git(version) {
    console.log(colors.magenta('GIT PROCESS  ...'));
    await prom('git add .');
    await prom(`git commit -m "${commitMessage || (`Update -${versionUpdate}- para versão ${version}`)}"`);
    await prom('git push');
    await prom(`git tag ${version}`);
    await prom(`git push origin ${version}`);
}

async function build() {
    console.log(colors.magenta('BUILD FILES  ...'));
    await prom('gulp build');
}

async function npm() {
    console.log(colors.magenta('NPM PUBLISH  ...'));

    if (await verificarUserNpm())
        console.log('PUBLICADO');//await prom(`npm publish`);
    else if (await confirmLogNpm()) {
        await prom('start cmd.exe /K "@echo off & npm adduser & exit"')

        if (await verificarUserNpm())
            console.log('PUBLICADO');//await prom(`npm publish`);
        else
            console.log(colors.red('Conta NPM não autenticada, verifique com administrador da conta.'));
    }
}

// FUNCTIONS

async function prom(command) {
    return new Promise((resolve, reject) => {
        exec(command, (err, out) => {
            if (err) return reject(err);
            if (out && out.trim()) console.log(out);
            resolve(out);
        })
    });
}

async function verificarUserNpm() {
    let user;
    try {
        user = new Buffer(await prom('npm whoami')).toString().trim();
    } catch (error) { }
    return user == 'gustavomaritan';
}

async function confirmLogNpm() {
    try {
        let retorno = await confirm();
        return retorno.toLowerCase() == 'y'
    } catch (error) {
        return false;
    }

    async function confirm() {
        const prompt = require('prompt');
        prompt.message = '';
        prompt.delimiter = '';

        return new Promise((resolve, reject) => {
            prompt.start();
            prompt.get({
                properties: {
                    confirm: {
                        pattern: /^(?:[yY]|[nN])$/,
                        description: colors.green('Deseja se conectar ao npm para publicar (y|n)?'),
                        message: 'Informe (y ou n) para continuar.',
                        required: true
                    }
                }
            }, (err, result) => {
                if (err) return reject(err);
                resolve(result.confirm);
            });
        });
    }
}

function prepareJSON() {
    const pack = fs.readFileSync(path.join(process.cwd(), 'package.json')),
        packDist = fs.readFileSync(path.join(process.cwd(), 'dist/package.json')),
        bower = fs.readFileSync(path.join(process.cwd(), 'bower.json')),
        objPackage = JSON.parse(pack),
        objBower = JSON.parse(bower),
        objPackDist = JSON.parse(packDist);

    let a = objPackage.version.split('.'),
        oldVersion = objPackage.version;

    a[versionValue] = +a[versionValue] + 1;

    if (versionUpdate == 'major') { a[1] = 0; a[2] = 0; }

    objPackDist.version = objBower.version = objPackage.version = a.join('.');

    fs.writeFileSync(path.join(process.cwd(), 'package.json'), JSON.stringify(objPackage, null, 4));
    fs.writeFileSync(path.join(process.cwd(), 'bower.json'), JSON.stringify(objBower, null, 4));
    fs.writeFileSync(path.join(process.cwd(), 'dist/package.json'), JSON.stringify(objPackDist, null, 4));

    return objPackDist.version;
}

function end(ex) {
    console.log('\n');
    console.log(colors.grey('______________________________________________________________________'));
    if (ex) {
        console.log(colors.red('##### ERROUU #####'));
        fs.writeFileSync(path.join(process.cwd(), `logs/log-${new Date().getTime()}.json`), JSON.stringify(ex, null, 4))
    } else
        console.log(colors.yellow(':: EXIT....'));
}
